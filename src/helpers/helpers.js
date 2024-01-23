import dayjs from 'dayjs';

export const generateRandomId = () => self.crypto.randomUUID();

export const calculateDateDiffInAges = (date) => {
  const startDate = dayjs(date);
  const endDate = dayjs();

  const diff = endDate.diff(startDate, 'year');
  return diff;
};
