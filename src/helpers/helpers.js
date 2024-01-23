import dayjs from 'dayjs';

export const generateRandomId = () => self.crypto.randomUUID();

export const calculateDateDiffInAges = (date) => {
  const startDate = dayjs(date);
  const endDate = dayjs();

  const diff = endDate.diff(startDate, 'year');
  return diff;
};

export const toLocalTz = (date) => {
  if (!date) return null;

  const localDate = dayjs(date).add(3, 'hour');
  return localDate.format();
};
