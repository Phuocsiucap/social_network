// src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { authStore } from '../store';
import { useWebSocketStore } from '../store';

import { websocketService } from '../services';

const useWebSocket = () => {
  const {user, token} = authStore();
  const {
    tabId,
    isConnected,
    connectionState,
    reconnectAttempts,
    setConnected,
    setConnectionState,
    setReconnectAttempts,

  } = useWebSocketStore();


  // const isInitialized = useRef(false);

  const connect = useCallback((token, tabId) => {
    try {
      websocketService.connect(token,tabId);
    } catch (error) {
      console.error('failed to connect to WebSocket:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    websocketService.disconnect();
  }, []);

  

  useEffect(() => {
    if (!token || !user || websocketService.isConnected) return;
    // if (!token || !user ) return;
   
    console.log('Initializing WebSocket connection...');
    // Connection events
    websocketService.on('connected', () => {
      setConnected(true);
      setConnectionState('CONNECTED');
      setReconnectAttempts(0);
      console.log("emmit connect calling");
    });

    websocketService.on('disconnected', () => {
      setConnected(false);
      setConnectionState('DISCONNECTED');
      console.log("emmit disconnect  calling");
    });

    websocketService.on('error', (error) => {
      console.error('WebSocket error:', error);
      setConnectionState('ERROR');
      console.log("emmit error calling");
    });

    websocketService.on('maxReconnectAttemptsReached', () => {
      setConnectionState('MAX_RECONNECT_ATTEMPTS_REACHED');
      console.log("emmit reconnect calling");
    });


    if (token && user && !websocketService.isConnected) {
      console.log('🔌 Connecting WebSocket after listeners setup...');
      websocketService.connect(token,tabId);
    }

    // Cleanup function
    return () => {
      websocketService.disconnect();
    };
  }, [
    token, user, tabId,
    setConnected, 
    setConnectionState, 
    setReconnectAttempts, 

  ]);

  return {
    isConnected,
    connectionState,
    reconnectAttempts,
    connect,
    disconnect,
  };
};

export default useWebSocket;