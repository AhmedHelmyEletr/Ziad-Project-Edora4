import { v4 as uuidv4 } from 'uuid';

export const generateTeacherEmail = (teacherName: string): string => {
  const cleanName = teacherName.toLowerCase().replace(/\s+/g, '');
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  return `${cleanName}${randomNumbers}@teacher.Edoura`;
};

export const generatePassword = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateStudentId = (): string => {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000); // 8 random digits
  return `ST-${randomDigits}`;
};

export const generateId = (): string => {
  return uuidv4();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
