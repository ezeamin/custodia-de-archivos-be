import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app.js';

import { ENDPOINTS, getEndpoint } from '../endpoints.js';
import { envs } from '../../helpers/envs.js';

const {
  TESTING: { ACCESS_TOKEN_ADMIN: ACCESS_TOKEN },
} = envs;

const getEndpoints = [
  {
    endpoint: ENDPOINTS.PARAMS.GET_AREAS,
    total: 11,
  },
  {
    endpoint: ENDPOINTS.PARAMS.GET_CIVIL_STATUS,
    total: 4,
  },
  {
    endpoint: ENDPOINTS.PARAMS.GET_GENDERS,
    total: 3,
  },
  {
    endpoint: ENDPOINTS.PARAMS.GET_RELATIONSHIPS,
    total: 11,
  },
  {
    endpoint: ENDPOINTS.PARAMS.GET_ROLES,
    total: 3,
  },
  {
    endpoint: ENDPOINTS.PARAMS.GET_STATUS,
    total: 4,
  },
];

describe('4. PARAMS Testing', () => {
  describe('-- GET ENDPOINTS -- ', () => {
    getEndpoints.forEach((endpoint, index) => {
      const letter = String.fromCharCode(97 + index);
      describe(`${letter}. GET ${endpoint.endpoint}`, () => {
        it('Get correct data - 200', async () => {
          const response = await request(app)
            .get(getEndpoint('PARAMS', endpoint.endpoint))
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .expect(HttpStatus.OK);

          expect(response.body.data).toBeDefined();
          expect(response.body.data).toEqual(expect.any(Array));
          expect(response.body.data).toHaveLength(endpoint.total);
        });

        it('No token - 401', async () => {
          await request(app)
            .get(getEndpoint('PARAMS', endpoint.endpoint))
            .expect(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });
});
