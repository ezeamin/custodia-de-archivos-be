import HttpStatus from 'http-status-codes';
import UAParser from 'ua-parser-js';

import { prisma } from '../../../helpers/prisma.js';

import { registerError } from '../../../helpers/registering/registerError.js';

const DEFAULT_IMAGE_URL =
  'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg';

export class GetController {
  static async users(req, res) {
    const {
      query: { page = 0, entries = 10, query = '', role = '' },
      user: { id: userId },
    } = req;

    let roles = [];
    if (role.includes(',')) {
      roles = role.split(',');
    } else {
      roles.push(role);
    }

    const searchFilters = {
      user_isactive: true,
      NOT: {
        id_user: userId,
      },
      user_type: {
        user_type: {
          in: roles,
          mode: 'insensitive',
        },
      },
      OR: [
        {
          third_party: {
            OR: [
              {
                person: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                person: {
                  surname: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                person: {
                  identification_number: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        },
        {
          employee: {
            OR: [
              {
                person: {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                person: {
                  surname: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
              {
                person: {
                  identification_number: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          },
        },
      ],
    };

    try {
      const countPromise = prisma.user.count({
        where: searchFilters,
      });
      const dataPromise = prisma.user.findMany({
        skip: page * entries,
        take: +entries,
        include: {
          employee: {
            include: {
              person: true,
            },
          },
          third_party: {
            include: {
              person: true,
            },
          },
          user_type: true,
        },
        where: searchFilters,
      });

      const [count, data] = await Promise.all([countPromise, dataPromise]);

      const formattedData = data.map((user) => ({
        id: user.id_user,
        username: user.username,
        imgSrc: user.employee ? user.employee.picture_url : DEFAULT_IMAGE_URL,
        firstname: user.employee
          ? user.employee.person.name
          : user.third_party.person.name,
        lastname: user.employee
          ? user.employee.person.surname
          : user.third_party.person.surname,
        role: {
          id: user.user_type.id_user_type,
          description: user.user_type.user_type.toUpperCase(),
        },
        description: user.third_party
          ? user.third_party.description
          : undefined,
      }));

      res.json({
        data: formattedData,
        totalElements: count,
        message: 'Usuarios obtenidos exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener los usuarios',
      });
    }
  }

  static async loginLogs(req, res) {
    const {
      query: { page = 0, entries = 10, query = '' },
    } = req;

    try {
      const logsPromise = prisma.login.findMany({
        skip: page * entries,
        take: +entries,
        orderBy: {
          log_created_at: 'desc',
        },
        include: {
          user: true,
        },
        where: {
          user: {
            username: {
              contains: query,
            },
          },
        },
      });

      const totalPromise = prisma.login.count({
        where: {
          user: {
            username: {
              contains: query,
            },
          },
        },
      });

      const [logs, total] = await Promise.all([logsPromise, totalPromise]);

      const formattedData = logs.map((log) => {
        const parser = new UAParser(log.user_agent);

        return {
          id: log.id_log,
          username: log.user.username,
          date: log.log_created_at,
          ipAddress: log.ip_address,
          userAgent: `${parser.getBrowser().name} ${parser.getBrowser().version} - ${parser.getOS().name} ${parser.getOS().version}`,
        };
      });

      res.json({
        data: formattedData,
        totalElements: total,
        message: 'Logs de inicio de sesión obtenidos exitosamente',
      });
    } catch (e) {
      registerError(e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener los logs de inicio de sesión',
      });
    }
  }
}
