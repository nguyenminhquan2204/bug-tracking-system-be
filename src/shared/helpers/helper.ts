import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const generateRandomFileName = (fileName: string) => {
   const ext = path.extname(fileName);
   return `${uuidv4()}${ext}`
}

export const generateRoomUserId = (userId: number) => {
   return `userId-${userId}`;
}