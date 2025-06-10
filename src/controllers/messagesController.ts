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

export const getAllMessagesByConversationId = async (req: Request, res: Response): Promise<void> => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversation_id: conversationId })
      .sort({ createdAt: 1 }) // Use -1 for newest first
      .populate('sender_id', 'username') // Optional: get sender username
      .exec();

    res.status(200).json({ status: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ status: false, message: 'Failed to fetch messages' });
  }
};


export const saveMessage = async (
  senderId: string,
  conversationId: string,
  content: string
) => {
  try {
    // Optional: Ensure conversation exists (if needed)
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Save the message
    const newMessage = await Message.create({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    });

    return newMessage;
  } catch (error) {
    console.error("Failed to save message:", error);
    throw new Error('Failed to save message');
  }
};

