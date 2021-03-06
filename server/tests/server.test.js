const expect = require('expect');
const request = require('supertest');

const { ObjectID } = require('mongodb');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create new Todo', (done) => {
    var text = 'test todo text 2';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        })
        .catch((err) => done(err));

      });
  });

  it('sholud not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        })
        .catch((err) => done(err));
      });
  });

});

describe('GET /todo', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)      
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('sholud get todo by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token) 
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);

      })
      .end(done);
  });

  it('sholud not get todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token) 
      .expect(404)
      .end(done);
  });

  it('sholud return 404 if todo not found', (done) => {
    var id = new ObjectID();

    request(app)
      .get(`/todos/${id}}`)
      .set('x-auth', users[0].tokens[0].token) 
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  })

});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) 
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err) );
      });
  });

  it('Should not remove other user todo ', (done) => {
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token) 
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((err) => done(err) );
      });
  });

  it('should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    
    request(app)
      .delete(`/todos/${id}}`)
      .set('x-auth', users[1].tokens[0].token) 
      .expect(404)
      .end(done);
  });

  it('should return 404 if object ID is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[1].tokens[0].token) 
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {

  it('Sholud update todo', (done) => {
    let item = todos[0];

    item.text = "Updated text property";
    item.completed = true;

    request(app)
      .patch(`/todos/${item._id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(item)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(item.text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('Sholud update other user todo', (done) => {
    let item = todos[0];

    item.text = "Updated text property";
    item.completed = true;

    request(app)
      .patch(`/todos/${item._id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(item)
      .expect(404)
      .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    let item = todos[1];

    item.text = "Updated text";
    item.completed = false;

    request(app)
      .patch(`/todos/${item._id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(item)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(item.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});

describe('GET /usres/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example17@example.com';
    var password = 'abc12345';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotEqual(password);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('sholud return validation errors if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: "lala",
      password: "t2"
    })
    .expect(400)
    .end(done);
  });

  it('sholud not create user if email in use', (done) => {
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: "abc1234"
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: "users[1].password"
    })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });
});