import HttpStatus from 'http-status-codes';

import { prisma } from '../../../helpers/prisma.js';
import { toLocalTz } from '../../../helpers/helpers.js';

export class GetController {
  static async users(req, res) {}

  static async loginLogs(req, res) {
    const {
      query: { page = 0, entries = 10 },
    } = req;

    const logsPromise = prisma.login.findMany({
      skip: page * entries,
      take: +entries,
      orderBy: {
        log_created_at: 'desc',
      },
      include: {
        user: true,
      },
    });

    const totalPromise = prisma.login.count();

    const [logs, total] = await Promise.all([logsPromise, totalPromise]);

    const formattedData = logs.map((log) => ({
      id: log.id_log,
      username: log.user.username,
      date: toLocalTz(log.log_created_at),
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
    }));

    res.json({
      data: formattedData,
      totalElements: total,
      message: 'Logs de inicio de sesión obtenidos exitosamente',
    });
  }
}
