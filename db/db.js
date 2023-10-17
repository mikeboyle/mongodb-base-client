require('dotenv').config();
const { MongoClient } = require('mongodb');

const { DB_USER, DB_PW, DB_NAME, DB_HOST } = process.env;

const url = `mongodb://${DB_USER}:${DB_PW}@${DB_HOST}:27017/${DB_NAME}`;
const client = new MongoClient(url);

let _db;

const connectDb = async (callback) => {
  try {
    await client.connect();
    _db = client.db(DB_NAME);
  } catch (err) {
    callback(err);
    throw err;
  }
};

const getDb = () => _db;
const closeDb = () => client.close();

module.exports = { closeDb, connectDb, getDb };
