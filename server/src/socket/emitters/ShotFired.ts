import { Server } from 'socket.io';
import { GridCoordinates } from '../../models/GridCoordinates';
import { RoomEmitter } from './RoomEmitter';

interface ShotFiredData {
  coordinates: GridCoordinates;
  shooterUsername: string;
}

export class ShotFiredEmitter extends RoomEmitter<ShotFiredData> {
  /**
   * @param ioServer the socket server istance
   * @param matchId the match id
   */
  constructor(ioServer: Server, matchId: string) {
    super(ioServer, 'shot-fired', matchId);
  }
}
