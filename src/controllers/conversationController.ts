import { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import mongoose from 'mongoose'



export const getUserConversations = async (req: Request, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId((req as any).user.id);
    console.log('Decoded User ID:', (req as any).user?.id);

    console.log("starting...")
    const results = await Conversation.aggregate([
  {
    $match: {
      $or: [
        { participant_one: userId.toString() },
        { participant_two: userId.toString() }
      ]
    }
  },
  {
    $addFields: {
      otherParticipant: {
        $cond: {
          if: { $eq: ['$participant_one', userId.toString()] },
          then: '$participant_two',
          else: '$participant_one'
        }
      },
      otherParticipantObjectId: {
        $toObjectId: {
          $cond: {
            if: { $eq: ['$participant_one', userId.toString()] },
            then: '$participant_two',
            else: '$participant_one'
          }
        }
      }
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'otherParticipantObjectId',
      foreignField: '_id',
      as: 'participantUser'
    }
  },
  { $unwind: '$participantUser' },
  {
    $lookup: {
      from: 'messages',
      let: { convId: { $toString: '$_id' } },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$conversation_id', '$$convId'] }
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: 1 }
      ],
      as: 'lastMessage'
    }
  },
  { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
  {
    $project: {
        _id: 0,
      conversation_id: '$_id',
      participant_name: '$participantUser.username',
      last_message: '$lastMessage.content',
      last_message_time: '$lastMessage.createdAt'
    }
  },
  { $sort: { last_message_time: -1 } }
]);


    console.log("starting1...")

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching conversations:", err);
res.status(500).json({ message: 'Server error', error: err });

  }
};






// 

`   
    Select c.id AS conversation_id, u.username AS participant_name, m.content AS last_message, m.created_at As last_messag_time
    from converstions c
    JOIN User u ON (u.id = c.participant_two AND u.id !=$1)
    LEFT JOIN LATERAL (
        SELECT content, created_at
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
    
    ) m ON true
     WHERE c.particpant_one = $1 OR c.participant_two = $1
     Order BY m.created_at Desc
`