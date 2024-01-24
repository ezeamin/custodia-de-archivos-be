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

export const toUTC = (date) => {
  if (date === undefined) return undefined;
  if (date === null) return null;

  // if (typeof date === 'string' && date.includes('Z')) {
  //   return date;
  // }

  // const utcDate = dayjs(date).subtract(3, 'hour');
  // return utcDate.format();

  return new Date(date).toISOString();
};
