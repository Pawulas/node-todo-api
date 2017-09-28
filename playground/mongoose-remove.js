const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { ObjectID } = require('mongodb');
const { User } = require('./../server/models/user');


// Todo.remove({}).then((res) => {
//   console.log(res);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

// Todo.findByIdAndRemove('59cd3041db66c57875d2a89c').then((todo) => {
//   console.log(todo);
// });