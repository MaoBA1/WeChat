import { io } from 'socket.io-client';
import serverBaseUrl from './serverBaseUrl';
import { setSocket } from './src/store/actions';


const setNewSocket = (dispatch, socket) => {
    try {
        dispatch(setSocket(socket));
    }catch(error) {
        console.log(error.message + " test");
    }
}

export const setupSocket = async(token, dispatch) => {
    if (token) {
      const newSocket = io(serverBaseUrl.localServerSocketUrl, {
        query: {
          token: token
        },
      });

      newSocket.on("connect", () => {
        console.log("success", "Socket Connected!");
      });

      newSocket.on("disconnect", (reason) => {
        setNewSocket(dispatch, null);
        setTimeout(setupSocket, 3000);
        console.log("error", "Socket Disconnected due to: " + reason);
      });
      
      setNewSocket(dispatch, newSocket);
    }
}

