import HttpStatus from 'http-status-codes';
import UAParser from 'ua-parser-js';

import { prisma } from '../../../helpers/prisma.js';

export class GetController {
  static async users(req, res) {
    const {
      query: { page = 0, entries = 10, query = '', role = '' },
      user: { id: userId },
    } = req;

    try {
      const countPromise = prisma.user.count();
      const dataPromise = prisma.user.findMany({
        skip: page * entries,
        take: +entries,
        include: {
          employee: {
            include: {
              person: true,
            },
          },
          user_type: true,
        },
        where: {
          NOT: {
            id_user: userId,
          },
          user_type: {
            user_type: {
              contains: role,
              mode: 'insensitive',
            },
          },
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
      });

      const [count, data] = await Promise.all([countPromise, dataPromise]);

      const formattedData = data.map((user) => ({
        id: user.id_user,
        username: user.username,
        imgSrc: user.employee.picture_url,
        firstname: user.employee.person.name,
        lastname: user.employee.person.surname,
        role: {
          id: user.user_type.id_user_type,
          description: user.user_type.user_type.toUpperCase(),
        },
      }));

      res.json({
        data: formattedData,
        totalElements: count,
        message: 'Usuarios obtenidos exitosamente',
      });
    } catch (e) {
      console.error('🟥', e);
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

      const totalPromise = prisma.login.count();

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
      console.error('🟥', e);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        message: 'Error al obtener los logs de inicio de sesión',
      });
    }
  }
}
