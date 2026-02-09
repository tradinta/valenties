export type Message = {
    id: string;
    text: string;
    sender: 'me' | 'them' | 'system';
    timestamp: number;
    type?: 'text' | 'image';
};
