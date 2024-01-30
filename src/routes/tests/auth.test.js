import request from 'supertest';
import jest from 'jest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app.js';

import { ENDPOINTS, getEndpoint } from '../endpoints.js';
import { envs } from '../../helpers/envs.js';

const {
  TESTING: { ACCESS_TOKEN, REFRESH_TOKEN },
} = envs;

describe('1. AUTH Testing', () => {
  describe(`a. POST ${ENDPOINTS.AUTH.POST_LOGIN}`, () => {
    it('Login OK - 200', async () => {
      await request(app)
        .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
        .send({
          username: '43706393',
          password: '1234Abcd',
        })
        .expect(HttpStatus.OK);
    });

    it('Incorrect data - 401', async () => {
      await request(app)
        .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
        .send({
          username: '43706392',
          password: '1234Abcd',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Incorrect password - 401', async () => {
      await request(app)
        .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
        .send({
          username: '43706393',
          password: '1234Abc',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Missing data - 400', async () => {
      await request(app)
        .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_LOGIN))
        .send({
          username: '43706393',
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
          username: '43706393',
        })
        .expect(HttpStatus.OK);

      expect(response.type).toEqual('application/json');
      expect(response.body?.data?.email).toBeDefined();
    });

    it('Incorrect data - 400', async () => {
      await request(app)
        .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_RECOVER_PASSWORD))
        .send({
          username: '43706392',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Missing data - 400', async () => {
      await request(app)
        .post(getEndpoint('AUTH', ENDPOINTS.AUTH.POST_RECOVER_PASSWORD))
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe(`e. PUT ${ENDPOINTS.AUTH.PUT_RESET_PASSWORD}`, () => {
    it('Reset password OK - 200', async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: 'Abcd1234',
        })
        .expect(HttpStatus.OK);
    });

    it('Same password - 400', async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: 'Abcd1234',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Incorrect data (short length) - 400', async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: '12Abc',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Incorrect data (missing uppercase) - 400', async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: '1234abcd',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Incorrect data (missing numbers) - 400', async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: 'Abcdefghi',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Incorrect data (missing letters) - 400', async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: '12345678',
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
          password: '1234Abcd',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    afterAll(async () => {
      await request(app)
        .put(getEndpoint('AUTH', ENDPOINTS.AUTH.PUT_RESET_PASSWORD))
        .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
        .send({
          password: '1234Abcd',
        });
      console.log('Reset password OK');
    });
  });
});
