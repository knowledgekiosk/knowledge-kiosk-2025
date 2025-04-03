require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { SerialPort } = require('serialport');
const { MongoClient, ServerApiVersion } = require('mongodb');
const multer = require('multer');
const path = require('path');
const cookieParser = require("cookie-parser");
const fs = require('fs');

// Initialize the Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.FRONTEND_URL || "*" } });

// Set up constants from environment variables
const port = process.env.PORT || 5000;
const dbUri = process.env.DB_URL;
const serialPortPath = process.env.SERIAL_PORT || '/dev/ttyACM0'; // Use environment variable for serial port path

let client;

// Middleware Setup
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true, // Allow cookies & authentication
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Static file serving setup
app.use(express.static("public", {
    setHeaders: (res, path) => {
        if (path.endsWith(".js")) {
            res.setHeader("Content-Type", "application/javascript");
        }
    }
}));

// Serve PDF files with correct MIME type
app.use("/files", express.static(path.join(__dirname, "files"), {
    setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/pdf"); // Ensures correct MIME type
    }
}));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = process.env.FILE_STORAGE_PATH || './files';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Connect to MongoDB database
async function connectDB() {
    try {
        client = new MongoClient(dbUri, {
            serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
        });
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Database Connection Error:", error);
        process.exit(1); 
    }
}

// Initialize SerialPort for card scanner
async function initSerialPort() {
    try {
        const portReader = new SerialPort({
            path: serialPortPath,
            baudRate: 9600
        });

        portReader.on("data", async (data) => {
            const cardNumber = data.toString().trim();
            console.log(`Card Data Received: "${cardNumber}"`);

            const userCollection = client.db('knowledge-kiosk').collection('users');
            const user = await userCollection.findOne({ cardId: cardNumber });

            if (user) {
                console.log(`User Found: ${user.name}`);
                const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
                io.emit("card_scanned", { user, token });
            } else {
                console.log(`New Card Detected: ${cardNumber} - Prompt Registration`);
                io.emit("card_scanned", { cardNumber, needsRegistration: true });
            }
        });

        console.log(`SerialPort initialized on ${serialPortPath}`);
    } catch (error) {
        console.error("SerialPort Initialization Error:", error);
    }
}

// Verify Admin Middleware
async function verifyAdmin(req, res, next) {
    const email = req.user.email; // Make sure req.user is set after JWT verification
    const userCollection = client.db('knowledge-kiosk').collection('users');
    const user = await userCollection.findOne({ email: email });

    if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden access" });
    }

    next();
}

// Verify Token Middleware
function verifyToken(req, res, next) {
    const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send({ message: "Unauthorized access" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" });
        }
        req.user = decoded;
        next();
    });
}

// User Registration API
app.post('/register', async (req, res) => {
    const { name, cardNumber } = req.body;
    if (!name || !cardNumber) {
        return res.status(400).json({ message: "Name and card number are required" });
    }

    const userCollection = client.db('knowledge-kiosk').collection('users');
    const existingUser = await userCollection.findOne({ cardId: cardNumber });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const newUser = { name, cardId: cardNumber };
    await userCollection.insertOne(newUser);

    const token = jwt.sign({ id: newUser._id, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "User registered successfully", token, user: newUser });
});

// File Upload API
app.post('/upload', upload.single("file"), async (req, res) => {
    try {
        const pdfCollection = client.db('knowledge-kiosk').collection('pdf');
        const { title } = req.body;
        const { filename, size, originalname: name } = req.file;

        const data = {
            title,
            filename,
            size,
            name,
            url: `/files/${filename}`
        };

        await pdfCollection.insertOne(data);

        res.status(200).json({ success: true, message: "File uploaded successfully", pdfUrl: data.url });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error uploading file", error });
    }
});

// Get All PDFs API
app.get('/pdfCollection', async (req, res) => {
    try {
        const pdfCollection = client.db('knowledge-kiosk').collection('pdf');
        const result = await pdfCollection.find().toArray();
        res.json(result);
    } catch (err) {
        console.error("Error fetching PDFs:", err);
        res.status(500).json({ message: "Error fetching PDFs" });
    }
});

// WebSocket Connection
io.on("connection", (socket) => {
    console.log("Frontend connected to WebSocket!");
});

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log("Server shutting down...");
    if (client) await client.close();
    process.exit(0);
});

// Initialize everything
(async function init() {
    await connectDB();
    await initSerialPort();
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})();
