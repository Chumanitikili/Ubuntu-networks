import { io, Socket } from 'socket.io-client';
import { useCallStore } from '@/store';
import { Call } from '@prisma/client';

let socket: Socket;

export const initializeSocket = (userId: string) => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('call:new', (call: Call) => {
      useCallStore.getState().addCall(call);
    });

    socket.on('call:update', (call: Call) => {
      useCallStore.getState().updateCall(call.id, call);
    });

    socket.on('call:end', (callId: string) => {
      useCallStore.getState().removeCall(callId);
    });

    socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 