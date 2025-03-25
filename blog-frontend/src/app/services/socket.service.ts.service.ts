// socket.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class SocketServiceTsService implements OnDestroy {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Log si connecté
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connecté');
    });

    // Log si déconnecté
    this.socket.on('disconnect', () => {
      console.warn('🔴 WebSocket déconnecté');
    });
  }

  // Écouter un événement
  listen(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // Arrêter l'écoute d’un événement
  off(event: string) {
    this.socket.off(event);
  }

  // Émettre un événement
  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  // Déconnecter proprement
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Pour vérifier si connecté
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  ngOnDestroy() {
    this.disconnect();
  }
}