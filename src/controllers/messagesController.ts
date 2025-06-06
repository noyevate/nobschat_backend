import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { Message } from "../models/message";

export const createMessage = async (req: Request, res: Response): Promise<void> => {
  const { senderId, receiverId, content } = req.body;

  if (!senderId || !receiverId || !content) {
    res.status(400).json({ success: false, message: "Missing required fields" });
    return;
  }

  try {
    // Step 1: Find existing conversation
    let conversation = await Conversation.findOne({
      $or: [
        { participant_one: senderId, participant_two: receiverId },
        { participant_one: receiverId, participant_two: senderId },
      ]
    });

    // Step 2: Create conversation if not found
    if (!conversation) {
      conversation = await Conversation.create({
        participant_one: senderId,
        participant_two: receiverId
      });
    }

    // Step 3: Create the message
    const message = await Message.create({
      conversation_id: conversation._id,
      sender_id: senderId,
      content: content
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Message creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
