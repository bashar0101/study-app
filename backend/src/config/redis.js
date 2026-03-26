const { createClient } = require('redis');
const config = require('./env');

const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('Could not connect to Redis', error);
  }
};

module.exports = { redisClient, connectRedis };
