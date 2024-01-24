import dayjs from 'dayjs';
import { ISODateRegex } from './regex.js';
import { toLocalTz } from './helpers.js';

export const formatHistoryData = (data) => {
  return data.map((record) => {
    let prev = record.previous_value;
    let curr = record.current_value;

    const isPrevDate =
      prev &&
      typeof prev === 'string' &&
      ISODateRegex.test(prev) &&
      dayjs(prev).isValid();
    const isCurrDate =
      curr &&
      typeof curr === 'string' &&
      ISODateRegex.test(curr) &&
      dayjs(curr).isValid();

    if (isPrevDate) {
      const format = !prev.includes('00:00:00')
        ? 'DD/MM/YYYY - HH:mm:ss'
        : 'DD/MM/YYYY';
      prev = dayjs(toLocalTz(prev)).format(format);
    }

    if (isCurrDate) {
      const format = !curr.includes('00:00:00')
        ? 'DD/MM/YYYY - HH:mm:ss'
        : 'DD/MM/YYYY';
      curr = dayjs(toLocalTz(curr)).format(format);
    }

    return {
      id: record.id_history,
      date: toLocalTz(record.modification_date),
      field: record.modified_field_label,
      previousValue: prev,
      newValue: curr,
      user: {
        id: record.id_submitted_by,
        description: record.user.username,
      },
    };
  });
};
