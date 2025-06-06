import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = "sj4i3yhfu43ef34bfhf348bf394"

interface JwtPayload {
  id: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {

    const token =  req.headers.authorization?.split(' ')[1]
    

  if (!token) {
    res.status(403).json({ message: 'No token provided' });
    return; 
  }

  

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded as {id: string};

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return 
  }
};
