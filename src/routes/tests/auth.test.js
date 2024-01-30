import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app.js';

import { ENDPOINTS, getEndpoint } from '../endpoints.js';
import { envs } from '../../helpers/envs.js';

const {
  TESTING: {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    USER: { USERNAME, PASSWORD },
  },
} = envs;

describe.skip('1. AUTH Testing', () => {
  describe('-- POST ENDPOINTS -- ', () => {
    describe(`a. POST ${ENDPOINTS.AUTH.POST_LOGIN}`, () => {
      it('Login OK - 200', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
          .send({
            username: USERNAME,
            password: PASSWORD,
          })
          .expect(HttpStatus.OK);
      });

      it('Incorrect data - 401', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
          .send({
            username: `${USERNAME.slice(0, -1)}2`,
            password: PASSWORD,
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Incorrect password - 401', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
          .send({
            username: USERNAME,
            password: PASSWORD.slice(0, -1),
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Missing data - 400', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
          .send({
            username: USERNAME,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`b. POST ${ENDPOINTS.AUTH.POST_LOGOUT}`, () => {
      it('Logout OK - 200', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGOUT))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .set('Cookie', [`refresh_token=${REFRESH_TOKEN}`])
          .expect(HttpStatus.OK);
      });

      it('Missing auth token - 401', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGOUT))
          .set('Cookie', [`refresh_token=${REFRESH_TOKEN}`])
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Missing auth cookie - 400', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGOUT))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`c. POST ${ENDPOINTS.AUTH.POST_REFRESH_TOKEN}`, () => {
      it('Refresh token OK - 200', async () => {
        const response = await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_REFRESH_TOKEN))
          .set('Cookie', [`refresh_token=${REFRESH_TOKEN}`])
          .expect(HttpStatus.OK);

        expect(response.body?.data?.token).toBeDefined();
      });

      it('Missing token - 400', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_REFRESH_TOKEN))
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe(`d. POST ${ENDPOINTS.AUTH.POST_RECOVER_PASSWORD}`, () => {
      it('Recover password OK - 200', async () => {
        const response = await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_RECOVER_PASSWORD))
          .send({
            username: USERNAME,
          })
          .expect(HttpStatus.OK);

        expect(response.type).toEqual('application/json');
        expect(response.body?.data?.email).toBeDefined();
      });

      it('Incorrect data (wrong username) - 400', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_RECOVER_PASSWORD))
          .send({
            username: `${USERNAME.slice(0, -1)}2`,
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Missing data - 400', async () => {
        await request(app)
          .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_RECOVER_PASSWORD))
          .expect(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe('-- PUT ENDPOINTS -- ', () => {
    describe(`a. PUT ${ENDPOINTS.AUTH.PUT_RESET_PASSWORD}`, () => {
      it('Reset password OK - 200', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: '9876Wxyz',
          })
          .expect(HttpStatus.OK);
      });

      it('Same password - 400', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: '9876Wxyz',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Incorrect data (short length) - 400', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: '98Wxy',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Incorrect data (missing uppercase) - 400', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: '9876wxyz',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Incorrect data (missing numbers) - 400', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: 'Pqrstuvwxyz',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Incorrect data (missing letters) - 400', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: '987654321',
          })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Missing data - 400', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Missing auth token - 401', async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .send({
            password: PASSWORD,
          })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      afterAll(async () => {
        await request(app)
          .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .send({
            password: PASSWORD,
          });
      });
    });
  });
});
