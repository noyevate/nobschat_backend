// src/controllers/authControllers.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/db";
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10;

const JWT_SECRET = "sj4i3yhfu43ef34bfhf348bf394"

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, SALT_ROUNDS);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.json({ status: false, message: 'Email already exists. Login instead.' });
      return
    }

    const user = new User({ username, email, password: hashPass });
    await user.save();

    res.status(201).json(user);
    return
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    return
  }
};

export const login = async (req: Request, res: Response): Promise<void>  => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email: email})
    if(!user || !user.password) {
      res.status(404).json({status: false, message: "User not found"})
      return
    } else{
      const isPassValid = await bcrypt.compare(password, user.password);
      if (!isPassValid) {
        res.status(400).json({status: false, message: "wrong was password"})
        return
      }
      const token = jwt.sign({ id: user._id}, JWT_SECRET, { expiresIn: '50d' });
      res.status(201).json(token)
    }

    
    
  } catch (error) {
    
  }
};
