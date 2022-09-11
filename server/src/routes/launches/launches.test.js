const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test GET /launches', () => {
		test('Should respond with 200', async () => {
			const response = await request(app)
				.get('/launches')
				.expect('Content-Type', /json/)
				.expect(200);
		});
	});

	describe('Test POST /launch', () => {
		const completeLaunchData = {
			mission: 'NERV',
			rocket: 'TEST-TYPE-01',
			target: 'Kepler-1652 b',
			launchDate: 'January 4, 2028',
		};
		const launchDataWithoutDate = {
			mission: 'NERV',
			rocket: 'TEST-TYPE-01',
			target: 'Kepler-1652 b',
		};
		const launchDataWithInvalidDate = {
			mission: 'NERV',
			rocket: 'TEST-TYPE-01',
			target: 'Kepler-1652 b',
			launchDate: 'baka',
		};

		test('Response with 201 created', async () => {
			const response = await request(app)
				.post('/launches')
				.send(completeLaunchData)
				.expect('Content-Type', /json/)
				.expect(201);

			const requestDate = new Date(completeLaunchData.launchDate).valueOf();
			const responseDate = new Date(response.body.launchDate).valueOf();

			expect(responseDate).toBe(requestDate);

			expect(response.body).toMatchObject(launchDataWithoutDate);
		});

		test('Should catch missing required properties', async () => {
			const response = await request(app)
				.post('/launches')
				.send(launchDataWithoutDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: 'Missing required launch properties',
			});
		});

		test('Should catch invalid dates', async () => {
			const response = await request(app)
				.post('/launches')
				.send(launchDataWithInvalidDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toStrictEqual({
				error: 'Invalid launch date',
			});
		});
	});
});
