// services/socket.js
import { io } from 'socket.io-client';

const socket = io('https://one2onebackend.onrender.com', {
    withCredentials: true,
    autoConnect: false // importante — no conecta solo, espera el socket.connect()
});

export default socket;