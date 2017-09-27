const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');
const { User } = require('./../server/models/user');

const id = "59cbe40f42b080842c14c6b0";
const userId = "6z9ca8fc3967ef854030bc87c";

if (!ObjectID.isValid(id)) {
  return console.log('ID not valid!');
}

User.findById(userId)
  .then((user) => {
    if (!user) {
      return console.log('User not found!');
    }

    console.log(user);
  }).catch((err) => {
    console.log(err);
  });

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log(todos);
// });

// Todo.findOne({
//   _id: id
// }).then((doc) => {
//   console.log(doc);
// });

// Todo.findById(id).then((doc) => {
//   if (!doc) {
//     return console.log('ID not found');
//   }
//   console.log('findById: ', doc);
// })