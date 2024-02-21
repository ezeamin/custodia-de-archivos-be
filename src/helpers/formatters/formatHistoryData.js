import dayjs from 'dayjs';
import { ISODateRegex, uuidRegex } from '../regex.js';
import { prisma } from '../prisma.js';
import { getDownloadLink } from '../cloudinary.js';

const optionsMap = {
  phone: {
    id_phone: true,
    phone_no: true,
  },
  province: {
    id_province: true,
    province: true,
  },
  locality: {
    id_locality: true,
    locality: true,
  },
  street: {
    id_street: true,
    street: true,
  },
  gender: {
    id_gender: true,
    gender: true,
  },
  area: {
    id_area: true,
    area: true,
  },
  employee_status: {
    id_status: true,
    status: true,
  },
  user_type: {
    id_user_type: true,
    user_type: true,
  },
  civil_status: {
    id_civil_status: true,
    civil_status: true,
  },
};

const getTableInformation = async (data) => {
  const names = Array.from(
    new Set(
      data.map((record) => {
        if (
          uuidRegex.test(record.previous_value) ||
          uuidRegex.test(record.current_value)
        )
          return record.modified_table;
        return null;
      }),
    ),
  ).filter(Boolean);
  const tables = {};
  const promises = [];

  for (let i = 0; i < names.length; i += 1) {
    const tableName = names[i];

    const dbDataPromise = prisma[tableName].findMany({
      select: optionsMap[tableName],
    });
    promises.push(dbDataPromise);
  }

  const dbData = await Promise.all(promises);

  for (let i = 0; i < names.length; i += 1) {
    const tableName = names[i];
    tables[tableName] = dbData[i];
  }

  // map all "id_something" fields to "id"
  for (let i = 0; i < names.length; i += 1) {
    const tableName = names[i];
    const options = tables[tableName];

    const idFieldName = Object.keys(options[0]).find((el) =>
      el.includes('id_'),
    );
    const nameFieldName = Object.keys(options[0]).find(
      (el) => !el.includes('id_') && !el.includes('api_'),
    );

    tables[tableName] = options.map((el) => ({
      id: el[idFieldName],
      description: el[nameFieldName],
    }));
  }

  return tables;
};

const isDate = (value) => {
  return (
    value &&
    typeof value === 'string' &&
    ISODateRegex.test(value) &&
    dayjs(value).isValid()
  );
};

const getDateFormat = (value) => {
  if (value.includes('03:00:00') || value.includes('00:00:00'))
    return 'DD/MM/YYYY';
  return 'DD/MM/YYYY - HH:mm:ss';
};

export const formatHistoryData = async (data) => {
  const tables = await getTableInformation(data);

  return data.map(async (record) => {
    let prev = record.previous_value;
    let curr = record.current_value;

    const isPrevDate = isDate(prev);
    const isCurrDate = isDate(curr);

    if (isPrevDate) {
      const format = getDateFormat(prev);
      prev = dayjs(prev).format(format);
    }

    if (isCurrDate) {
      const format = getDateFormat(curr);
      curr = dayjs(curr).format(format);
    }

    if (!isPrevDate && !isCurrDate) {
      const isPrevUUID = uuidRegex.test(prev);
      const isCurrUUID = uuidRegex.test(curr);

      const tableName = record.modified_table;
      const options = tables[tableName];

      if (options) {
        if (prev && isPrevUUID)
          prev = options.find((el) => el.id === prev)?.description || prev;
        if (curr && isCurrUUID)
          curr = options.find((el) => el.id === curr)?.description || curr;
      }
    }

    if (!isPrevDate && !isCurrDate) {
      const isPrevPrivateLink =
        typeof prev === 'string' &&
        prev.includes('http') &&
        prev.includes('private');
      const isCurrPrivateLink =
        typeof curr === 'string' &&
        curr.includes('http') &&
        curr.includes('private');

      if (isPrevPrivateLink) prev = await getDownloadLink(prev);
      if (isCurrPrivateLink) curr = await getDownloadLink(curr);
    }

    return {
      id: record.id_history,
      date: record.modification_date,
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
