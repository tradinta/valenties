import { NextApiRequest, NextApiResponse } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import { Server as NetServer } from 'http';

export const config = {
    api: {
        bodyParser: false,
    },
};

interface ChatUser {
    id: string;
    userId?: string;
    isSearching: boolean;
    partnerId?: string;
}

// In-memory stores (will reset on serverless cold start)
const users = new Map<string, ChatUser>();
const waitingQueue: string[] = [];

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

const ioHandler = (req: NextApiRequest, res: SocketServerResponse) => {
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
                isSearching: false
            });

            socket.on('join_queue', (data: { userId?: string }) => {
                const user = users.get(socket.id);
                if (!user) return;

                if (user.isSearching || user.partnerId) return;

                user.userId = data.userId;
                user.isSearching = true;

                log(`Queue join: ${socket.id} (Queue size: ${waitingQueue.length})`);

                if (waitingQueue.length > 0) {
                    const partnerId = waitingQueue.pop()!;
                    const partner = users.get(partnerId);

                    if (partner && partnerId !== socket.id) {
                        user.isSearching = false;
                        user.partnerId = partnerId;
                        partner.isSearching = false;
                        partner.partnerId = socket.id;

                        const room = `room_${socket.id}_${partnerId}`;
                        socket.join(room);
                        io.sockets.sockets.get(partnerId)?.join(room);

                        io.to(room).emit('match_found', { room });
                        log(`Match: ${socket.id} <-> ${partnerId}`);
                    } else {
                        waitingQueue.push(socket.id);
                    }
                } else {
                    waitingQueue.push(socket.id);
                }
            });

            socket.on('send_message', (data: { room: string, message: string }) => {
                socket.to(data.room).emit('receive_message', {
                    message: data.message,
                    senderId: socket.id,
                    timestamp: Date.now()
                });
            });

            socket.on('leave_chat', () => {
                handleDisconnect(socket, io);
            });

            socket.on('disconnect', () => {
                log(`Disconnected: ${socket.id}`);
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
            io.to(user.partnerId).emit('partner_disconnected');
            io.sockets.sockets.get(user.partnerId)?.leave(`room_${socket.id}_${user.partnerId}`);
            io.sockets.sockets.get(user.partnerId)?.leave(`room_${user.partnerId}_${socket.id}`);
        }
    }

    users.delete(socket.id);
};

export default ioHandler;
