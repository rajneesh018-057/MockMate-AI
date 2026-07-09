
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketUpdateSession } from '../features/sessions/sessionSlice';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const getCleanApiUrl = () => {
    let url = import.meta.env.VITE_API_URL || '';
    url = url.trim().replace(/\/+$/, '');
    if (url && !url.endsWith('/api')) {
        url += '/api';
    }
    return url;
};

const BACKEND_URL = getCleanApiUrl().replace('/api', '');

const useSocket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user && user._id) {
      
      const socket = io(BACKEND_URL, {
        query: { userId: user._id },
        transports: ['websocket'],
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('Socket.io connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket.io disconnected.');
      });

      socket.on('sessionUpdate', (payload) => {
        console.log('Real-time Session Update:', payload.status);
        
        dispatch(socketUpdateSession(payload));
        if (payload.status === 'QUESTIONS_READY') {
            navigate(`/interview/${payload.sessionId}`);
        }
      });

     
      return () => {
        socket.disconnect();
      };
    }
  }, [user, dispatch, navigate]); 

  return socketRef.current;
};

export default useSocket;