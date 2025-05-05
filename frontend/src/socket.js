// socket.js
import { io } from "socket.io-client";

// Initialize socket instance
const socket = io(process.env.REACT_APP_API_URL); // Use your server URL

export default socket;