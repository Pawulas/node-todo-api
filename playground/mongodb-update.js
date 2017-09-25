const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/todoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connecto to server');
  }

  console.log('Database connected');

  // db.collection('Todos').findOneAndUpdate({
  //   _id : new ObjectID('59c94139db66c57875d2755b')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // })

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59c943d1db66c57875d27602')
  }, {
    $set: {
      name: "Pawcio"
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });
 
  // db.close();
});