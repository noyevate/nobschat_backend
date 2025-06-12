import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from 'http';
import {Server} from 'socket.io';
// import cors from "cors";

import authRoutes from "./routes/authRoutes";
import conversatioRoutes from "./routes/conversationRoutes";
import messageRoutes from "./routes/messageRoutes";
import { createMessage, saveMessage } from "./controllers/messagesController";
 

dotenv.config();

const app = express();
app.use(express.json());

// Socket io server
const server = http.createServer(app) 
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

 
mongoose.connect(process.env.MONGOURL!)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Mount routes
app.use("/auth", authRoutes);

app.use("/conversations", conversatioRoutes);
app.use("/messages", messageRoutes);


// io.on('connection', (socket) =>{
//   console.log('a user connected', socket.id)

  
//   socket.on('joinCoversation', (conversationId) => {
//     socket.join(conversationId);
//     console.log("user joined conversation: ", conversationId)
//   })

//   socket.on('sendMessage', async(message) => {
//     const {conversation_id, sender_id, content} = message;

//     try {
//       const savedMessage = await saveMessage(conversation_id, sender_id, content);
//       console.log("SendMessage: ");
//       console.log(savedMessage);
//       io.to(conversation_id).emit('newMessage', saveMessage)
//     } catch (error) {
//       console.log(error) 
//     }

//   });

//   socket.on('disconnect', () => {
//     console.log("user disconnected", socket.id)
//   })
// })


// Socket.IO connection handling
io.on('connection', (socket) =>{ console.log('a user connected', socket.id);
 socket.on('joinCoversation', (conversationId) => { socket.join(conversationId); console.log("user joined conversation: ", conversationId);
});

 socket.on('sendMessage', async(message) => {
 const {conversation_id, sender_id, content} = message;

 try {
 const savedMessage = await saveMessage(conversation_id, sender_id, content);
 console.log("SendMessage: ");
  console.log(savedMessage);
 // Make sure you're emitting the actual saved message, not the function itself
 io.to(conversation_id).emit('newMessage', savedMessage); 
 } catch (error) {
 console.log(error); 
 }
 });

 socket.on('disconnect', () => {
 console.log("user disconnected", socket.id); });
});


const PORT = process.env.PORT || 3500;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
