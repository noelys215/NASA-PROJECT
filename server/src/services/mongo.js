const mongoose = require('mongoose');

const MONGO_URL =
	'mongodb+srv://nasa-api:8iU0bhyXfkuAnjb0@nasacluster.zuup6l0.mongodb.net/nasa?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
	console.log('MongoDB connection ready');
});

mongoose.connection.on('error', (err) => {
	console.error(err.message);
});

async function mongoConnect() {
	await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
	await mongoose.disconnect();
}

module.exports = {
	mongoConnect,
	mongoDisconnect,
};
