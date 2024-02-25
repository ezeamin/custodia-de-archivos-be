import dayjs from 'dayjs';

export const generateRandomId = () => self.crypto.randomUUID();

export const calculateDateDiffInAges = (date) => {
  const startDate = dayjs(date);
  const endDate = dayjs();

  const diff = endDate.diff(startDate, 'year');
  return diff;
};

export const generateFirstPassword = () => {
  const password = Math.random().toString(36).slice(-8);
  return password.toString();
};

export const generateRandomUsername = () => {
  // 8 digits long - only numbers
  const username = Math.floor(10000000 + Math.random() * 90000000);
  return username.toString();
};

export const uppercaseName = (name) => {
  // make the first letter of every word uppercase, and the rest lowercase
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

export const formatPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return phone;

  // if phone starts with 381, add "549" in front of it
  if (phone.startsWith('381')) {
    return `549${phone}`;
  }

  if (phone.startsWith('0384')) {
    return phone.replace('0381', '549381');
  }

  return phone;
};
