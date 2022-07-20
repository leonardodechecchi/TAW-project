import http from 'http';
import io from 'socket.io';
import { httpServer } from '..';

const port: string | undefined = process.env.PORT;

/*
const ioServer: io.Server = new io.Server(httpServer, {
  cors: { origin: `http://localhost:${port}` },
});

ioServer.use((client, next) => {
  const userId = client.handshake.auth.userId;
  client.userId = userId;
  next();
});

interface WrappedServerSocket<T> {
  event: string;
  callback: SocketActionFn<T>;
}

type SocketMessage = 'join_server' | 'join_room' | 'chat_message';

type SocketActionFn<T> = (message: T) => void;

function broadcast<T>(event: SocketMessage) {
  return (message: T) => ioServer.emit(event, message);
}

function createHandler<T>(
  event: SocketMessage,
  action: SocketActionFn<T>
): WrappedServerSocket<T> {
  const callback = action || broadcast(event);
  return { event, callback };
}

createHandler<{}>('join_server', () => {

})
*/

interface SocketListener {
  path: string;
  listener: {
    handleConnection: (client: io.Socket) => void;
    middlewareImplementation?: (client: io.Socket, next: any) => void;
  };
}

class Socket extends io.Server {
  private static io: Socket;

  private constructor(httpServer: http.Server) {
    super(httpServer, { cors: { origin: `http://localhost:${port}` } });
  }

  public static getInstace(): Socket {
    if (!Socket.io) {
      Socket.io = new Socket(httpServer);
    }
    return Socket.io;
  }

  public initListeners(listeners: SocketListener[]) {
    listeners.forEach((value) => {});
  }
}
