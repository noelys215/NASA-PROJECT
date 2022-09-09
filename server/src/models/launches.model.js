const launches = new Map();

let latestFlightNumber = 100;

const launch = {
	flightNumber: 100,
	mission: 'NERV Exploration X',
	rocket: 'AAA Wunder',
	launchDate: new Date('December 25th, 2030'),
	destination: 'Kepler-442b',
	customers: ['NERV', 'NASA'],
	upcoming: true,
	success: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
	return Array.from(launches.values());
}

function addNewLaunch(launch) {
	latestFlightNumber++;
	launches.set(
		latestFlightNumber,
		Object.assign(launch, {
			success: true,
			upcoming: true,
			customers: ['NERV', 'NASA'],
			flightNumber: latestFlightNumber,
		})
	);
}

module.exports = {
	getAllLaunches,
	addNewLaunch,
};
