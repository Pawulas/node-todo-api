const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connecto to server');
  }

  console.log('Database connected');

  // delete many
  // db.collection('Todos').deleteMany({
  //   text: 'Eat lunch'
  // }).then((result) => {
  //   console.log('result');
  //   // console.log(JSON.stringify(result))
  // });

  // db.collection('Todos').deleteOne({
  //     text : "walk the dog 2"
  // }).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Todos').findOneAndDelete({
  //   completed: false
  // }).then((result) => {
  //   console.log(result);
  // })

  // db.collection('Users').deleteMany({
  //   name: 'max'
  // }).then((result) => {
  //   console.log(result);
  // })

  // db.collection('Users').deleteOne({
  //   name: 'max'
  // }).then((result) => {
  //   console.log(result);
  // })

  // db.collection('Users').findOneAndDelete({
  //   name: 'max 2'
  // }).then((result) => {
  //   console.log(result);
  // });
  // db.close();
});