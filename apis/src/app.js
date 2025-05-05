require('dotenv/config');
require('./util/functions');
require('./util/fileUpload');
require("./cron/cronJobs");

const express = require('express');
const cors = require('cors');
const http = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const { instrument } = require("@socket.io/admin-ui");
const { Blob } = require('buffer');  // Node.js buffer to support Blob

// Initialize Express app
const app = express();

const options = {
    key: fs.readFileSync('/etc/apache2/ssl/private.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/server.crt'),
};

// Create HTTP server
const server = http.createServer(options,app);


const allowedOrigins = [
    process.env.APP_URL,
    process.env.REACTAPP_URL,
    process.env.REACTAPP_URL2,
    process.env.SOCKET_IO_ADMIN,
    "https://admin.socket.io",
    "*"

    // Add more origins as needed
];

/* const corsOptions = {
    origin: function (origin, callback) {
        // Allow if the origin matches or is undefined (for same-origin requests)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            console.error(`CORS Error: Origin "${origin}" is not allowed`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,  // Allow cookies/auth headers
}; */

const corsOptions = {
    origin: '*',  // Allow all origins
    methods: 'GET,POST,DELETE,PATCH',  // Define allowed HTTP methods
    credentials: false,  // Credentials not allowed with wildcard
};
// Middleware
app.use(cors(corsOptions));

// Alternatively, if you're using the built-in express middleware for JSON parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Socket.IO
const io = socketIo(server, { cors: {
    origin: allowedOrigins,
    credentials: true
} });


// Import socket store
const socketStore = require('./socket'); // 👈 create this file

let onlineUsers = {}; // To track online users
let onlineUsersSocket = {}; // To track online users

io.on('connection', (socket) => {

    //console.log('a user connected');
    socket.on('joinRoom', (room) => {
        socket.join(room);
        //console.log(`User joined room: ${room}`);
    });

    socket.on('send-message', ({ to, message, template, fromSelf, room, images, originalname, date, sender }) => {
        socket.to(to).emit('receive-message', {
            from: socket.id,
            message,
            template,
            fromSelf,
            room:to,
            images,
            originalname,
            date,
            sender
        });
    });


    socket.on('send-files', ({ to, message, template, fromSelf, room, images, originalname, date, sender, mediatype }) => {
        socket.to(to).emit('receive-message', {
            from: socket.id,
            message: "",  // Send the Base64 string
            template:"",
            fromSelf,
            room: to,
            images:[],  // Include the Base64 string in the images array
            originalname,
            date,
            sender,
            mediatype
        });
    });

    // Store user status (you can use a userId instead of socket.id)
    socket.on('user_online', (userId) => {
        onlineUsers[userId] = true;
        onlineUsersSocket[userId] = socket.id;

        socketStore.connectedUsers.set(userId, socket.id);

        let updatedObj = {};
        for (let key in onlineUsers) {
            // Split the key at the colon and take the part before the colon
            let newKey = key.split(':')[0];
            // Assign the original value to the new key
            updatedObj[newKey] = onlineUsers[key];
        }
        io.emit('online_users', updatedObj); // Notify all clients about online users
    });

    // Handle user logout
    socket.on('user_logout', (userId) => {
        delete onlineUsers[userId];
        delete onlineUsersSocket[userId];
        socketStore.connectedUsers.delete(userId);
        let updatedObj = {};
        for (let key in onlineUsers) {
            // Split the key at the colon and take the part before the colon
            let newKey = key.split(':')[0];
            // Assign the original value to the new key
            updatedObj[newKey] = onlineUsers[key];
        }
        io.emit('online_users', updatedObj); // Notify all clients about online users
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        //console.log('A user disconnected:', socket.id);

        // Find the user by socket id and remove them from online users
        for (const userId in onlineUsers) {
            if (onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
                delete onlineUsersSocket[userId];
                socketStore.connectedUsers.delete(userId);
                break;
            }
        }

        io.emit('online_users', onlineUsers); // Notify all clients about online users
    });
});

socketStore.setIo(io); // 👈 Store io instance

instrument(io, {
    mode: "development",
    auth: {
        type: "basic",
        username: "admin",
        password: "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit" encrypted with bcrypt
    },
    readonly: true
});


// Load routes
const routes = require('./routes/router');
app.use('/', routes);

// Serve uploaded files
app.use('/media', express.static('uploads'));

// Start MongoDB connection
require('../config/database');

// Set view engine
app.set('view engine', 'ejs');

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


