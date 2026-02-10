import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import { Server as NetServer } from 'http';
import { ModerationService } from '@/services/ModerationService';

export const config = {
    api: {
        bodyParser: false,
    },
};

interface ChatUser {
    id: string; // Socket ID
    userId?: string; // App User ID
    isSearching: boolean;
    partnerId?: string;
    // New fields
    tier?: string;
    interests?: string[];
    mode?: 'chaos' | 'normal';
    gender?: string;
    country?: string;
    filters?: { gender?: string; country?: string };
    lastActive: number;
}

// In-memory stores (WARNING: Resets on Vercel cold boot)
// In a real production app, use Redis or a separate Node server.
const users = new Map<string, ChatUser>();
const waitingQueue: string[] = [];
// Map userId -> socketId for reconnection attempts
const userSocketMap = new Map<string, string>();

// Logger utility
const log = (message: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Socket.IO] ${message}`);
    }
};

type SocketServerResponse = NextApiResponse & {
    socket: {
        server: NetServer & {
            io?: ServerIO;
        };
    };
};

const ioHandler = async (req: NextApiRequest, res: SocketServerResponse) => {
    if (!ModerationService.initialized) {
        await ModerationService.init();
    }

    if (!res.socket.server.io) {
        log('Initializing Socket.IO server');

        const httpServer = res.socket.server;
        const io = new ServerIO(httpServer, {
            path: '/api/socket/io',
            addTrailingSlash: false,
            cors: {
                origin: process.env.NODE_ENV === 'production'
                    ? process.env.NEXT_PUBLIC_BASE_URL
                    : "*",
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket: Socket) => {
            log(`Connected: ${socket.id}`);

            users.set(socket.id, {
                id: socket.id,
                isSearching: false,
                lastActive: Date.now()
            });

            // HANDLE RECONNECTION
            socket.on('reconnect_user', (data: { userId: string }) => {
                if (!data.userId) return;

                // If we have a past socket for this user
                const oldSocketId = userSocketMap.get(data.userId);
                if (oldSocketId) {
                    const oldUser = users.get(oldSocketId);
                    // Check if they were in a chat
                    if (oldUser && oldUser.partnerId) {
                        const partnerId = oldUser.partnerId;
                        const partner = users.get(partnerId);

                        if (partner) {
                            // Re-link
                            users.delete(oldSocketId);
                            users.set(socket.id, { ...oldUser, id: socket.id, partnerId });
                            partner.partnerId = socket.id; // Update partner's ref
                            userSocketMap.set(data.userId, socket.id);

                            // Re-join room
                            const room = `room_${socket.id}_${partnerId}`; // New room ID logic needed or reuse?
                            // Easier to just use specific room ID if stored, but for now:
                            // Notify partner
                            io.to(partnerId).emit('system_message', { text: 'Partner reconnected!' });

                            // To simplify, we might need persistent Room IDs. 
                            // For this MVP, we will try to just notify.
                            log(`Reconnected user ${data.userId} to new socket ${socket.id}`);
                            return;
                        }
                    }
                }

                // Register new mapping
                userSocketMap.set(data.userId, socket.id);
                // Update local user object
                const u = users.get(socket.id);
                if (u) u.userId = data.userId;
            });

            socket.on('join_queue', (data: {
                userId?: string,
                tier?: string,
                gender?: string,
                country?: string,
                filters?: { gender?: string, country?: string }
            }) => {
                const user = users.get(socket.id);
                if (!user) return;

                if (user.isSearching || user.partnerId) return;

                // Check Ban Status
                const ip = socket.handshake.headers['x-forwarded-for'] as string || socket.handshake.address;
                if (data.userId && ModerationService.isBanned(data.userId, ip)) {
                    socket.emit('error', { message: 'You are banned from using this service.' });
                    return;
                }

                user.userId = data.userId;
                user.tier = data.tier;
                user.isSearching = true;
                user.gender = data.gender;
                user.country = data.country;

                // Permission Check for Filters
                if ((data.tier === 'premium' || data.tier === 'admin') && data.filters) {
                    user.filters = data.filters;
                } else {
                    user.filters = undefined;
                }

                if (data.userId) userSocketMap.set(data.userId, socket.id);

                const filterLog = user.filters ? JSON.stringify(user.filters) : "None (All)";
                log(`Queue join: ${socket.id} (Tier: ${user.tier}, Filters: ${filterLog})`);

                // MATCHMAKING LOGIC
                let matchIndex = -1;
                let potentialPartnerId: string | undefined;

                for (let i = 0; i < waitingQueue.length; i++) {
                    const pid = waitingQueue[i];
                    if (pid === socket.id) continue;

                    const partner = users.get(pid);
                    if (!partner) {
                        log(`Match: Skipping stale ID ${pid}`);
                        waitingQueue.splice(i, 1);
                        i--;
                        continue;
                    }

                    log(`Match attempt: ${socket.id} vs ${pid}`);

                    // 1. Check if PARTNER matches MY filters
                    if (user.filters?.gender && user.filters.gender !== 'any' && user.filters.gender !== partner.gender) {
                        log(`Match fail: Partner ${pid} gender (${partner.gender}) doesn't match my filter (${user.filters.gender})`);
                        continue;
                    }
                    if (user.filters?.country && user.filters.country !== 'any' && user.filters.country !== partner.country) {
                        log(`Match fail: Partner ${pid} country (${partner.country}) doesn't match my filter (${user.filters.country})`);
                        continue;
                    }

                    // 2. Check if I match PARTNER'S filters
                    if (partner.filters?.gender && partner.filters.gender !== 'any' && partner.filters.gender !== user.gender) {
                        log(`Match fail: I (${socket.id}) gender (${user.gender}) don't match partner ${pid} filter (${partner.filters.gender})`);
                        continue;
                    }
                    if (partner.filters?.country && partner.filters.country !== 'any' && partner.filters.country !== user.country) {
                        log(`Match fail: I (${socket.id}) country (${user.country}) don't match partner ${pid} filter (${partner.filters.country})`);
                        continue;
                    }

                    // Mutual match found
                    log(`Match success: ${socket.id} <-> ${pid}`);
                    matchIndex = i;
                    potentialPartnerId = pid;
                    break;
                }

                if (matchIndex > -1 && potentialPartnerId) {
                    // Remove partner from queue
                    waitingQueue.splice(matchIndex, 1);

                    const partner = users.get(potentialPartnerId)!;

                    user.isSearching = false;
                    user.partnerId = potentialPartnerId;
                    partner.isSearching = false;
                    partner.partnerId = socket.id;

                    const room = `room_${Math.random().toString(36).substring(7)}`;
                    socket.join(room);
                    io.sockets.sockets.get(potentialPartnerId)?.join(room);

                    io.to(room).emit('match_found', {
                        room,
                        partnerGender: partner.gender || 'Anonymous',
                        partnerTier: partner.tier,
                        partnerCountry: partner.country
                    });

                    log(`Match: ${socket.id} <-> ${potentialPartnerId} in ${room}`);
                } else {
                    waitingQueue.push(socket.id);

                    // If filters are active, warn if queue is small?
                    if (user.filters && waitingQueue.length < 5) {
                        // socket.emit('system_message', { text: "Searching with filters... this might take longer." });
                    }
                }
            });

            socket.on('send_message', (data: { room: string, message: string, type: 'text' | 'image' | 'voice', replyTo?: any }) => {
                // MODERATION CHECK
                if (data.type === 'text') {
                    const { clean, triggered } = ModerationService.filterMessage(data.message);

                    if (triggered) {
                        data.message = clean;
                        socket.emit('system_message', { text: "⚠️ Your message was flagged for inappropriate content." });
                    }
                }

                socket.to(data.room).emit('receive_message', {
                    message: data.message,
                    senderId: socket.id,
                    timestamp: Date.now(),
                    type: data.type,
                    replyTo: data.replyTo // Forward reply context
                });
            });

            // TYPING INDICATORS
            socket.on('typing', (data: { room: string }) => {
                socket.to(data.room).emit('partner_typing');
            });

            socket.on('stop_typing', (data: { room: string }) => {
                socket.to(data.room).emit('partner_stop_typing');
            });

            // REPORT USER
            socket.on('report_user', (data: { reason: string }) => {
                const user = users.get(socket.id);
                if (user && user.partnerId) {
                    const partner = users.get(user.partnerId);
                    if (partner && partner.userId) {
                        // Log report (in a real app, save to DB)
                        log(`REPORT: User ${user.userId} reported ${partner.userId} for ${data.reason}`);
                        // Auto-disconnect?
                    }
                }
            });

            socket.on('leave_chat', () => {
                handleDisconnect(socket, io);
            });

            socket.on('disconnect', () => {
                log(`Disconnected: ${socket.id}`);
                // Don't fully cleanup immediately to allow reconnect?
                // For now, standard cleanup
                handleDisconnect(socket, io);
            });
        });

        res.socket.server.io = io;
    }
    res.end();
};

const handleDisconnect = (socket: Socket, io: ServerIO) => {
    const user = users.get(socket.id);
    if (!user) return;

    const queueIdx = waitingQueue.indexOf(socket.id);
    if (queueIdx > -1) {
        waitingQueue.splice(queueIdx, 1);
    }

    if (user.partnerId) {
        const partner = users.get(user.partnerId);
        if (partner) {
            partner.partnerId = undefined;
            // Notify partner
            io.to(user.partnerId).emit('partner_disconnected');
            // Clean up rooms
            // socket.rooms is auto-cleared on disconnect
        }
    }

    users.delete(socket.id);
    if (user.userId) userSocketMap.delete(user.userId);
};

export default ioHandler;

