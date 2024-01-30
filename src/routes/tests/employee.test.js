import path from 'path';
import request from 'supertest';
import HttpStatus from 'http-status-codes';

import { app } from '../../app.js';

import { ENDPOINTS, getEndpoint } from '../endpoints.js';
import { envs } from '../../helpers/envs.js';

const __dirname = path.resolve();
const IMAGE_FILE_PATH = path.join(__dirname, '/src/testing/sample_img.png');

const {
  TESTING: { ACCESS_TOKEN },
} = envs;
const EMPLOYEE_ID = '018d3b85-ad41-7cca-94c9-0cf50325d9a4';
const FAMILY_MEMBER_ID = '018d5a99-9686-7b77-b151-eb3cfaefd72c';
const FAMILY_MEMBER_DNI = '17860733';

const getEndpoints = [
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_DOCS,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_HISTORY,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_ABSENCES,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_LICENSES,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_VACATIONS,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_TRAININGS,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FORMAL_WARNINGS,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_EXTRA_HOURS,
  ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_LATE_ARRIVALS,
];

describe('2. EMPLOYEE Testing', () => {
  describe.skip('-- GET ENDPOINTS -- ', () => {
    describe(`a. GET ${ENDPOINTS.EMPLOYEES.GET_EMPLOYEES}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_EMPLOYEES))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
      });

      it('No token - 401', async () => {
        await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_EMPLOYEES))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`b. GET ${ENDPOINTS.EMPLOYEES.GET_EMPLOYEE}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE,
              EMPLOYEE_ID,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.OK);

        const { data } = response.body;

        expect(data).toBeDefined();
        expect(data).toEqual(expect.any(Object));
        expect(data).toHaveProperty('id');
      });

      it('No token - 401', async () => {
        await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_EMPLOYEE))
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No id - 400', async () => {
        await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_EMPLOYEE))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Wrong id - 404', async () => {
        await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE,
              '018d3b85-ad41-7cca-94c9-0cf50325d9a5',
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    getEndpoints.forEach((endpoint, index) => {
      const letter = String.fromCharCode(99 + index);
      describe(`${letter}. GET ${endpoint}`, () => {
        it('Get correct data - 200', async () => {
          const response = await request(app)
            .get(getEndpoint('EMPLOYEES', endpoint, EMPLOYEE_ID))
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .expect(HttpStatus.OK);

          expect(response.body.data).toBeDefined();
          expect(response.body.data).toEqual(expect.any(Array));
        });

        it('No token - 401', async () => {
          await request(app)
            .get(getEndpoint('EMPLOYEES', endpoint))
            .expect(HttpStatus.UNAUTHORIZED);
        });

        it('No id - 400', async () => {
          await request(app)
            .get(getEndpoint('EMPLOYEES', endpoint))
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .expect(HttpStatus.BAD_REQUEST);
        });

        it('Wrong id - 404', async () => {
          await request(app)
            .get(
              getEndpoint(
                'EMPLOYEES',
                endpoint,
                '018d3b85-ad41-7cca-94c9-0cf50325d9a5',
              ),
            )
            .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
            .expect(HttpStatus.NOT_FOUND);
        });
      });
    });

    describe(`l. GET ${ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
              EMPLOYEE_ID,
              FAMILY_MEMBER_ID,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Object));
        expect(response.body.data.dni).toEqual(FAMILY_MEMBER_DNI);
      });

      it('No token - 401', async () => {
        await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
              EMPLOYEE_ID,
              FAMILY_MEMBER_ID,
            ),
          )
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('No employee id - 400', async () => {
        await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
              '_',
              FAMILY_MEMBER_ID,
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('No family id - 400', async () => {
        await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
              EMPLOYEE_ID,
              '_',
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('Wrong family id - 404', async () => {
        await request(app)
          .get(
            getEndpoint(
              'EMPLOYEES',
              ENDPOINTS.EMPLOYEES.GET_EMPLOYEE_FAMILY_MEMBER,
              EMPLOYEE_ID,
              '018d3b85-ad41-7cca-94c9-0cf50325d9a5',
            ),
          )
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.NOT_FOUND);
      });
    });

    describe(`m. GET ${ENDPOINTS.EMPLOYEES.GET_LICENSES_TYPES}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_LICENSES_TYPES))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(0);
      });

      it('No token - 401', async () => {
        await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_LICENSES_TYPES))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`n. GET ${ENDPOINTS.EMPLOYEES.GET_LICENSE_TYPE}`, () => {
      // No tests because there isn't any license preloaded in db
    });

    describe(`o. GET ${ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPES}`, () => {
      it('Get correct data - 200', async () => {
        const response = await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPES))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .expect(HttpStatus.OK);

        expect(response.body.data).toBeDefined();
        expect(response.body.data).toEqual(expect.any(Array));
        expect(response.body.data).toHaveLength(0);
      });

      it('No token - 401', async () => {
        await request(app)
          .get(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPES))
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });

    describe(`p. GET ${ENDPOINTS.EMPLOYEES.GET_TRAINING_TYPE}`, () => {
      // No tests because there isn't any license preloaded in db
    });
  });

  describe('-- POST ENDPOINTS -- ', () => {
    describe(`a. POST ${ENDPOINTS.EMPLOYEES.POST_EMPLOYEE}`, () => {
      it('Correct post - 201', async () => {
        await request(app)
          .post(getEndpoint('EMPLOYEES', ENDPOINTS.EMPLOYEES.POST_EMPLOYEE))
          .set('Authorization', `Bearer ${ACCESS_TOKEN}`)
          .set('Content-Type', 'multipart/form-data')
          .attach('imgFile', IMAGE_FILE_PATH)
          .field('name', 'John')
          .field('lastname', 'Doe')
          .field('birthdate', '1980-01-01T00:00:00.000Z')
          .field('genderId', '018d3b85-ad41-71c2-a317-95f3fa1a632d')
          .field('dni', '12345678')
          .field('email', 'johndoe@mail.com')
          .field('startDate', '1990-01-01T00:00:00.000Z')
          .field('position', 'Prueba')
          .field('fileNumber', '1002')
          .field('areaId', '018d3b85-ad41-77e2-aaa7-4fcc12ba0132')
          .expect(HttpStatus.CREATED);
      });
    });
  });

  describe('-- PUT ENDPOINTS -- ', () => {});

  describe('-- DELETE ENDPOINTS -- ', () => {});
});
