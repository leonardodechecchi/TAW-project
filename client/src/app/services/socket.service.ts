import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnInit, OnDestroy {
  private socket: Socket;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // const userId = this.userService.getId();
    this.socket = io(environment.base_endpoint, { auth: { userId: 'userId' } });
    console.log('socket connected');
    this.socket.emit('server-joined');
  }

  ngOnDestroy(): void {
    this.socket.emit('server-left');
    this.socket.disconnect();
  }

  // connectNotifications() {}

  // connectMessages() {}
}
