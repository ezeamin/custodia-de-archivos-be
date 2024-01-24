import HttpStatus from 'http-status-codes';
import UAParser from 'ua-parser-js';

import { prisma } from '../../../helpers/prisma.js';
import { toLocalTz } from '../../../helpers/helpers.js';

export class GetController {
  static async users(req, res) {
    res.sendStatus(500);
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
          date: toLocalTz(log.log_created_at),
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
