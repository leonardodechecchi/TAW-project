import { Server } from 'socket.io';
import { GridCoordinates } from '../../models/GridCoordinates';
import { RoomEmitter } from './RoomEmitter';

export class ShotFiredEmitter extends RoomEmitter<GridCoordinates> {
  /**
   * @param ioServer the socket server istance
   * @param matchId the match id
   */
  constructor(ioServer: Server, matchId: string) {
    super(ioServer, 'shot-fired', matchId);
  }
}
