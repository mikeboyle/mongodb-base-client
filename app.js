const { closeDb, connectDb, getDb } = require('./db/db');

async function main() {
  await connectDb((err) => console.log(`Error connecting to db: ${err}`));
  
  const db = getDb();
  const collection = db.collection('myFirstCollection');

  const res = await collection.find({}).toArray();
  console.log({ res }, res.length);

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    console.log('Closing db...');
    closeDb();
  });
