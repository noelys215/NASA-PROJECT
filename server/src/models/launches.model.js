const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
	flightNumber: 100,
	mission: 'NERV Exploration X',
	rocket: 'AAA Wunder',
	launchDate: new Date('December 25, 2030'),
	target: 'Kepler-442b',
	customers: ['NERV', 'NASA'],
	upcoming: true,
	success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
	return await launchesDatabase.findOne({
		flightNumber: launchId,
	});
}

async function getLatestFlightNumber() {
	const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}

async function getAllLaunches() {
	return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
	await launchesDatabase.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{
			upsert: true,
		}
	);
}

async function scheduleNewLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No matching planet found');
	}

	const newFlightNumber = (await getLatestFlightNumber()) + 1;
	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ['NERV', 'NASA'],
		flightNumber: newFlightNumber,
	});

	await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
	const aborted = await launchesDatabase.updateOne(
		{
			flightNumber: launchId,
		},
		{
			upcoming: false,
			success: false,
		}
	);

	return aborted.modifiedCount === 1;
}

module.exports = {
	existsLaunchWithId,
	getAllLaunches,
	abortLaunchById,
	scheduleNewLaunch,
};
