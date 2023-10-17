const { closeDb, connectDb, getDb } = require('./db/db');

async function main() {
  await connectDb((err) => console.log(`Error connecting to db: ${err}`));
  let total = 0;
  let numStrEvents = 0;
  let numObjEvents = 0;
  let numNullEvents = 0;
  let numOtherEvents = 0;
  let numParseableStrEvents = 0;
  let numUnParseableStrEvents = 0;

  const db = getDb();
  const cursor = await db
    .collection('omscsEdxClickStream')
    .find({})
    .forEach((element) => {
      total++;
      if (total % 10000 === 0) {
        process.stdout.write('.');
      }
      const { event, _id } = element;
      if (typeof event === 'string') {
        numStrEvents++;
        try {
          const obj = JSON.parse(event);
          numParseableStrEvents++;
        } catch (err) {
          numUnParseableStrEvents++;
        }
      } else if (event === null) {
        numNullEvents++;
      } else if (typeof event === 'object') {
        numObjEvents++;
      } else {
        numOtherEvents++;
      }
    });
  process.stdout.write('\n');
  console.log({
    total,
    numObjEvents,
    numNullEvents,
    numStrEvents,
    numParseableStrEvents,
    numUnParseableStrEvents,
    numOtherEvents,
  });

  return 'done.';
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    console.log('Closing db...');
    closeDb();
  });
