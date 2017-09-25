const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connecto to server');
  }
  console.log('Database connected');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to inster Todo', err);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'max',
  //   age: 30,
  //   location: "Żory"
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('unable to insert new user');
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.close();
});