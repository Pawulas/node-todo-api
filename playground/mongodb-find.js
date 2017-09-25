const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connecto to server');
  }
  console.log('Database connected');

  // db.collection('Todos')
  //   .find({
  //     "_id" : new ObjectID("59c17b84ca803305802eeba0")
  //   })
  //   .toArray()
  //   .then((docs) => {
  //     console.log('Todos');
  //     console.log(JSON.stringify(docs, undefined, 2));
  //   }, (err) => {
  //     console.log('Unable to fetch todos', err);
  //   });

  db.collection('Todos').find().count()
  .then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  db.close();
});