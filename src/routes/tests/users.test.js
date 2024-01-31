import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app.js';

import { ENDPOINTS, getEndpoint } from '../endpoints.js';
import { envs } from '../../helpers/envs.js';
import { prisma } from '../../helpers/prisma.js';

const {
  TESTING: { ACCESS_TOKEN_ADMIN, ACCESS_TOKEN_EMPLOYEE },
} = envs;
const TEST_NEW_USER_EMPLOYEE_ID = '018d5f7e-0a00-7913-87ef-c43edb396158';
const TEST_NEW_USER_PERSON_ID = '018d5f79-eb05-7563-b721-497393e1ee8a';
const TEST_NEW_USER_DNI = '30000000';

describe('5. USERS Testing', () => {
  describe('-- GET ENDPOINTS -- ', () => {
    describe(`a. GET ${ENDPOINTS.USERS.GET_USERS}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(1);
      });

      it('Get filtered data (empty results) - 200', async () => {
        const response = await request(app)
          .get(`${getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS)}?query=hola`)
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(0);
      });

      it('Get filtered data (DNI - 1 result) - 200', async () => {
        const response = await request(app)
          .get(
            `${getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS)}?query=40000000`,
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(1);
      });

      it('Get filtered data (Name - 1 result) - 200', async () => {
        const response = await request(app)
          .get(`${getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS)}?query=joh`)
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(1);
      });

      it('Get filtered data (Role - 1 result) - 200', async () => {
        const response = await request(app)
          .get(`${getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS)}?role=ADMIN`)
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(1);
      });

      it('Get filtered data (Role - 0 result) - 200', async () => {
        const response = await request(app)
          .get(
            `${getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS)}?role=THIRD_PARTY`,
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(0);
      });

      it('Get filtered data (Incorrect Role) - 400', async () => {
        await request(app)
          .get(
            `${getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS)}?role=ANYTHING`,
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('No token - 401', async () => {
        await request(app)
          .get(getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`b. GET ${ENDPOINTS.USERS.GET_LOGIN_LOGS}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(getEndpoint('USERS', ENDPOINTS.USERS.GET_LOGIN_LOGS))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
      });

      it('Get filtered data (Incorrect query) - 400', async () => {
        await request(app)
          .get(
            `${getEndpoint('USERS', ENDPOINTS.USERS.GET_LOGIN_LOGS)}?role=ANYTHING`,
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('No token - 401', async () => {
        await request(app)
          .get(getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS))
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No admin token - 403', async () => {
        await request(app)
          .get(getEndpoint('USERS', ENDPOINTS.USERS.GET_USERS))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_EMPLOYEE}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('-- POST ENDPOINTS -- ', () => {
    describe(`a. POST ${ENDPOINTS.USERS.POST_USER}`, () => {
      it('Create user - 201', async () => {
        const response = await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            employeeId: TEST_NEW_USER_EMPLOYEE_ID,
          })
          .expect(HttpStatus.CREATED);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Object));
        expect(response.body.data.username).toBeDefined();
        expect(response.body.data.password).toBeDefined();
        expect(response.body.data.username).toEqual(expect.any(String));
        expect(response.body.data.password).toEqual(expect.any(String));

        // Clean up
        await prisma.user.delete({
          where: {
            username: response.body.data.username,
          },
        });
      });

      it('Create user (Incorrect employeeId) - 400', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            employeeId: 999,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Create user (Non-existent employeeId) - 404', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            employeeId: '61eeb9f5-897b-4af2-b26f-e3fc5fc1dd48',
          })
          .expect(HttpStatus.NOT_FOUND);
      });

      it('No token - 401', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_USER))
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No admin token - 403', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_EMPLOYEE}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`b. POST ${ENDPOINTS.USERS.POST_READ_ONLY_USER}`, () => {
      it('Create read-only user - 201', async () => {
        const response = await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            name: 'Test',
            lastname: 'Test',
            dni: '60000000',
            email: 'test@test.com',
            description: 'Test',
          })
          .expect(HttpStatus.CREATED);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Object));
        expect(response.body.data.username).toBeDefined();
        expect(response.body.data.password).toBeDefined();
        expect(response.body.data.username).toEqual(expect.any(String));
        expect(response.body.data.password).toEqual(expect.any(String));

        // Clean up
        await prisma.user.delete({
          where: {
            username: response.body.data.username,
          },
        });
      });

      it('Create read-only user (Incorrect email) - 400', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            name: 'Test',
            lastname: 'Test',
            dni: '60000000',
            email: 'testtest.com', // Incorrect email
            description: 'Test',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Create read-only user (Incorrect dni) - 400', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            name: 'Test',
            lastname: 'Test',
            dni: '600a0000',
            email: 'test@test.com', // Incorrect email
            description: 'Test',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Create read-only user (Missing field) - 400', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            name: 'Test',
            lastname: 'Test',
            dni: '60000000',
            description: 'Test',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Create read-only user (Extra field) - 400', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .send({
            name: 'Test',
            lastname: 'Test',
            dni: '60000000',
            email: 'test@test.com',
            description: 'Test',
            extra: 'Extra',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('No token - 401', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No admin token - 403', async () => {
        await request(app)
          .post(getEndpoint('USERS', ENDPOINTS.USERS.POST_READ_ONLY_USER))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_EMPLOYEE}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('-- PUT ENDPOINTS -- ', () => {
    describe(`a. PUT ${ENDPOINTS.USERS.PUT_CREATE_ADMIN}`, () => {
      // Create user for test employee
      let userId = null;
      beforeAll(async () => {
        const data = await prisma.user.create({
          data: {
            username: TEST_NEW_USER_DNI,
            password: '123456789',
            user_type: {
              connect: {
                user_type: 'employee',
              },
            },
            employee: {
              connect: {
                id_employee: TEST_NEW_USER_EMPLOYEE_ID,
              },
            },
          },
        });

        userId = data.id_user;
      });

      afterAll(async () => {
        await prisma.user.delete({
          where: {
            id_user: userId,
          },
        });
      });

      it('Create admin - 200', async () => {
        await request(app)
          .put(getEndpoint('USERS', ENDPOINTS.USERS.PUT_CREATE_ADMIN, userId))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        const res = await prisma.user.findUnique({
          where: {
            id_user: userId,
          },
          include: {
            user_type: true,
          },
        });

        expect(res).toBeDefined();
        expect(res.user_type.user_type).toEqual('admin');

        // Clean up
        await prisma.user.update({
          where: {
            id_user: userId,
          },
          data: {
            user_type: {
              connect: {
                user_type: 'employee',
              },
            },
          },
        });
      });

      it('Create admin (Incorrect userId) - 400', async () => {
        const incorrectUserId = '018d5faa-7e6f-e3995e944af5';
        await request(app)
          .put(
            getEndpoint(
              'USERS',
              ENDPOINTS.USERS.PUT_CREATE_ADMIN,
              incorrectUserId,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Create admin (Non-existent userId) - 404', async () => {
        const wrongUserId = '018d5faa-97d7-7e6f-8ccc-e3995e944af5';
        await request(app)
          .put(
            getEndpoint('USERS', ENDPOINTS.USERS.PUT_CREATE_ADMIN, wrongUserId),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('No token - 401', async () => {
        await request(app)
          .put(getEndpoint('USERS', ENDPOINTS.USERS.PUT_CREATE_ADMIN, userId))
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No admin token - 403', async () => {
        await request(app)
          .put(getEndpoint('USERS', ENDPOINTS.USERS.PUT_CREATE_ADMIN, userId))
          .set('Authorization', `Bearer ${ACCESS_TOKEN_EMPLOYEE}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });

  describe('-- DELETE ENDPOINTS -- ', () => {
    describe(`a. DELETE ${ENDPOINTS.USERS.DELETE_ADMIN_USER}`, () => {
      let userId = null;
      beforeAll(async () => {
        const data = await prisma.user.create({
          data: {
            username: TEST_NEW_USER_DNI,
            password: '123456789',
            user_type: {
              connect: {
                user_type: 'admin',
              },
            },
            employee: {
              connect: {
                id_employee: TEST_NEW_USER_EMPLOYEE_ID,
              },
            },
          },
        });

        userId = data.id_user;
      });

      afterAll(async () => {
        await prisma.user.delete({
          where: {
            id_user: userId,
          },
        });
      });

      it('Delete admin - 200', async () => {
        await request(app)
          .delete(
            getEndpoint('USERS', ENDPOINTS.USERS.DELETE_ADMIN_USER, userId),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        const res = await prisma.user.findUnique({
          where: {
            id_user: userId,
          },
          include: {
            user_type: true,
          },
        });

        expect(res).toBeDefined();
        expect(res.user_type.user_type).toEqual('employee');

        // Clean up
        await prisma.user.update({
          where: {
            id_user: userId,
          },
          data: {
            user_type: {
              connect: {
                user_type: 'admin',
              },
            },
          },
        });
      });

      it('Delete admin (Incorrect userId) - 400', async () => {
        const incorrectUserId = '018d5faa-7e6f-e3995e944af5';
        await request(app)
          .delete(
            getEndpoint(
              'USERS',
              ENDPOINTS.USERS.DELETE_ADMIN_USER,
              incorrectUserId,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Delete admin (Non-existent userId) - 404', async () => {
        const wrongUserId = '018d5faa-97d7-7e6f-8ccc-e3995e944af5';
        await request(app)
          .delete(
            getEndpoint(
              'USERS',
              ENDPOINTS.USERS.DELETE_ADMIN_USER,
              wrongUserId,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('No token - 401', async () => {
        await request(app)
          .delete(
            getEndpoint('USERS', ENDPOINTS.USERS.DELETE_ADMIN_USER, userId),
          )
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No admin token - 403', async () => {
        await request(app)
          .delete(
            getEndpoint('USERS', ENDPOINTS.USERS.DELETE_ADMIN_USER, userId),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_EMPLOYEE}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });

    describe(`b. DELETE ${ENDPOINTS.USERS.DELETE_READ_ONLY_USER}`, () => {
      let userId = null;
      beforeAll(async () => {
        const data = await prisma.user.create({
          data: {
            username: TEST_NEW_USER_DNI,
            password: '123456789',
            user_type: {
              connect: {
                user_type: 'third_party',
              },
            },
            third_party: {
              create: {
                id_person: TEST_NEW_USER_PERSON_ID,
                email: 'test123@test.com',
              },
            },
          },
        });

        userId = data.id_user;
      });

      afterAll(async () => {
        await prisma.user.delete({
          where: {
            id_user: userId,
          },
        });
      });

      it('Delete read only - 200', async () => {
        await request(app)
          .delete(
            getEndpoint('USERS', ENDPOINTS.USERS.DELETE_READ_ONLY_USER, userId),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.OK);

        const res = await prisma.user.findUnique({
          where: {
            id_user: userId,
          },
          include: {
            third_party: true,
          },
        });

        expect(res).toBeDefined();
        expect(res.user_isactive).toBeFalsy();
        expect(res.third_party.third_party_isactive).toBeFalsy();

        // Clean up
        await prisma.user.update({
          where: {
            id_user: userId,
          },
          data: {
            user_isactive: true,
            third_party: {
              update: {
                third_party_isactive: true,
              },
            },
          },
        });
      });

      it('Delete read only (Incorrect userId) - 400', async () => {
        const incorrectUserId = '018d5faa-7e6f-e3995e944af5';
        await request(app)
          .delete(
            getEndpoint(
              'USERS',
              ENDPOINTS.USERS.DELETE_READ_ONLY_USER,
              incorrectUserId,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Delete read only (Non-existent userId) - 404', async () => {
        const wrongUserId = '018d5faa-97d7-7e6f-8ccc-e3995e944af5';
        await request(app)
          .delete(
            getEndpoint(
              'USERS',
              ENDPOINTS.USERS.DELETE_READ_ONLY_USER,
              wrongUserId,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_ADMIN}`)
          .expect(HttpStatus.NOT_FOUND);
      });

      it('No token - 401', async () => {
        await request(app)
          .delete(
            getEndpoint('USERS', ENDPOINTS.USERS.DELETE_READ_ONLY_USER, userId),
          )
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No admin token - 403', async () => {
        await request(app)
          .delete(
            getEndpoint('USERS', ENDPOINTS.USERS.DELETE_READ_ONLY_USER, userId),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN_EMPLOYEE}`)
          .expect(HttpStatus.FORBIDDEN);
      });
    });
  });
});
