import { Server } from 'socket.io';
import { GridCoordinates } from '../../models/GridCoordinates';
import { RoomEmitter } from './RoomEmitter';

export class ShotFiredEmitter extends RoomEmitter<GridCoordinates> {
  /**
   *
   * @param ioServer
   * @param matchId
   */
  constructor(ioServer: Server, matchId: string) {
    super(ioServer, 'shot-fired', matchId);
  }
}
