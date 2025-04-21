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
const { ObjectId } = require("mongodb");
const { error } = require('console');

// Initialization of Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: process.env.FRONTEND_URL || "*" } });

// constants from environment variables
const port = process.env.PORT || 5000;
const dbUri = process.env.DB_URL;
const serialPortPath = process.env.SERIAL_PORT || '/dev/ttyACM0'; // environment variable for serial port path

let client;

// Middleware Setup
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", 
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log("→ Incoming:", req.method, req.url);
    next();
  });
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
    setHeaders: (res, filePath) => {
      // If the file has ".pdf" extension, set PDF content type
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");
      }
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  }));
  

// Configuration of Multer for file uploads
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



// Initialization of SerialPort for card scanner
async function initSerialPort() {
    try {
      const portReader = new SerialPort({
        path: serialPortPath,
        baudRate: 9600,
      });
  
      portReader.on("data", async (data) => {
        const raw      = data.toString().trim();
        const cardNum  = raw;
        const EXPECTED = 16;
  
        console.log(`Card Data Received: "${cardNum}"`);
  
        // ── 1) validate full length ───────────────────────────────────────────
        if (cardNum.length !== EXPECTED) {
          console.warn(`Incomplete card read (${cardNum.length}/${EXPECTED}): "${cardNum}"`);
          
          return io.emit("card_scanned", {
            error:           "incomplete_data",
            receivedLength:  cardNum.length,
            expectedLength:  EXPECTED,
            cardNumber:      cardNum,
          });
        }
  
        // normal lookup & emit ───────────────────────────────────────────
        const users = client.db("knowledge-kiosk").collection("users");
        const user  = await users.findOne({ cardId: cardNum });
  
        if (user) {
          console.log(`User Found: ${user.userEmail}`);
          const token = jwt.sign(
            { id: user._id, name: user.userName },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          io.emit("card_scanned", { user, token });
        } else {
          console.log(`New Card Detected: ${cardNum} → prompt registration`);
          io.emit("card_scanned", { cardNumber: cardNum, needsRegistration: true });
        }
      });
  
      console.log(`SerialPort initialized on ${serialPortPath}`);
    } catch (error) {
      console.error("SerialPort Initialization Error:", error);
    }
  }
  

// User Registration API
app.post('/register', async (req, res) => {
    console.log(req.body);
    const { userName, userEmail, cardId, role, cardStatus, userStatus, createdAt } = req.body;

    if (!userName || !cardId || !userEmail) {
        return res.status(400).json({ message: "Name, card number, and email are required" });
    }

    const userCollection = client.db('knowledge-kiosk').collection('users');
    
    // Check if user already exists in the database
    const existingUser = await userCollection.findOne({ cardId });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

   
    const newUser = { 
        userName, 
        userEmail, 
        cardId, 
        role, 
        cardStatus, 
        userStatus: 'pending',  
        createdAt: new Date().toISOString()
    };

    try {
        // Insert the new user into the database
        const result = await userCollection.insertOne(newUser);
        // console.log(result.insertedId)
        // console.log(result)
        
        if (result.insertedId) {
            
            return res.json({
                message: "User registered successfully. Your registration is under review.",
                insertedId: result.insertedId,
                user: {
                    userName: newUser.userName,
                    userEmail: newUser.userEmail,
                    cardId: newUser.cardId,
                    role: newUser.role,
                    cardStatus: newUser.cardStatus,
                    userStatus: newUser.userStatus, 
                    createdAt: newUser.createdAt
                }
            });
        } else {
            return res.status(500).json({ message: "Error occurred during registration. Please try again." });
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ message: "Error occurred during registration. Please try again." });
    }
});
//get users 

app.post('/login', async (req, res) => {
    const { email } = req.body; 
  
    // Check if the user exists in the database
    const userCollection = client.db('knowledge-kiosk').collection('users');
    const user = await userCollection.findOne({ userEmail: email });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    // Check if the user's status is approved
    if (user.userStatus !== 'approved') {
      return res.status(400).json({
        message: `Your registration is ${user.userStatus}. Please wait for approval.`,
      });
    }
  
    // If user is approved, generate a JWT token
    const token = jwt.sign(
      { id: user._id, name: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  
    // Send the token to the frontend
    res.json({
      message: 'Login successful',
      token: token,  
      user: user,    
    });
  });
  
//check user registration status
app.get('/user-status', async (req, res) => {
    const { cardId } = req.query;  

    if (!cardId) {
        return res.status(400).json({ message: "Card ID is required" });
    }

    const userCollection = client.db('knowledge-kiosk').collection('users');

    try {
        const user = await userCollection.findOne({ cardId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        
        return res.json({
            userStatus: user.userStatus,  // Return current user status
        });
    } catch (error) {
        console.error("Error fetching user status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



// File Upload API
app.post('/upload', upload.single("file"), async (req, res) => {
    try {
      const slidesCollection = client.db('knowledge-kiosk').collection('slides');
      
      const { title, date: expirationDate, visibility, publish, userEmail } = req.body;
      const { filename, size, originalname } = req.file;
  
      // Capture the current time as the upload date (ISO string)
      const uploadDate = new Date().toISOString();
    
      const slideData = {
        title,
        expirationDate,
        visibility,
        publish,
        filename,
        size,
        originalName: originalname,
        url: `/files/${filename}`,
        userEmail,
        uploadDate
      };
  
      // Check if a file with the same original name already exists
      const checkIfExist = await slidesCollection.findOne({ originalName: originalname });
      if (checkIfExist) {
        return res.status(400).json({
          message: "File already exists"
        });
      }
    
      // Save the data object to the DB.
      const result = await slidesCollection.insertOne(slideData);
    
      // Respond with success and include the file URL and uploadDate.
      res.status(200).json({ 
        success: true, 
        insertedId: result.insertedId,
        message: "File uploaded successfully", 
        fileUrl: slideData.url,
        uploadDate: slideData.uploadDate 
      });
    } catch (error) {
      console.error("Error during file upload:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error uploading file", 
        error 
      });
    }
  });
  
// get all pdfs 
app.get('/pdfCollection', async (req, res) => {
    try {
        const pdfCollection = client.db('knowledge-kiosk').collection('slides');
        const result = await pdfCollection.find().toArray();
        res.json(result);
    } catch (err) {
        console.error("Error fetching PDFs:", err);
        res.status(500).json({ message: "Error fetching PDFs" });
    }
});
// get single pdf
app.get("/pdfCollection/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pdfCollection = client.db("knowledge-kiosk").collection("slides");
      // important: must convert id to ObjectId if using Mongo _id
      const result = await pdfCollection.findOne({ _id: new ObjectId(id) });
      if (!result) {
        return res.status(404).json({ message: "PDF not found" });
      }
      res.json(result);
    } catch (err) {
      console.error("Error fetching single PDF:", err);
      res.status(500).json({ message: "Error fetching single PDF" });
    }
  });
  

// Get public pdfs
app.get('/pdfPublicCollection', async (req, res) => {
    try {
        const pdfCollection = client.db('knowledge-kiosk').collection('slides');
        const query = {
            publish : "yes",
            visibility : "public"
        }
        const result = await pdfCollection.find(query).toArray();
        res.json(result);
    } catch (err) {
        console.error("Error fetching PDFs:", err);
        res.status(500).json({ message: "Error fetching PDFs" });
    }
});
// get all users 
app.get('/users', async(req,res)=>{
    try{
        const userCollection = client.db('knowledge-kiosk').collection('users');
        const result = await userCollection.find().toArray()
        res.send(result)
    }catch(err){
        console.log(err)
        res.status(400).json({
            success : false,
            message : "Error fetching user data",
            error : err
        })
    }
})
// approve user 
app.patch("/users/:id/approve", async (req, res) => {
    const { id } = req.params;
    const userCollection = client.db('knowledge-kiosk').collection('users');
  
    try {
      const { value } = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { userStatus: "approved" } },
        { returnDocument: "after" }
      );
      if (!value) return res.status(404).json({ message: "User not found" });
      res.json(value);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// upgrade user to admin 
app.patch("/users/:id/make-admin", async (req, res) => {
    const { id } = req.params;
    const userCollection = client.db('knowledge-kiosk').collection('users');
  
    try {
      const { value } = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { role: "admin" } },
        { returnDocument: "after" }
      );
      if (!value) return res.status(404).json({ message: "User not found" });
      res.json(value);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
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
