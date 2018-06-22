'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./model');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/react-basics');
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/todos', (req, res) => {
  Todo.find({})
    .then(data => res.send(data.map(todo => {
      let {title, completed} = todo;
      let id = todo._id;
      return {id, title, completed}
    })));
});

let toFrontTodo = todoModel => {
  let {title, completed} = todoModel;
  let id = todoModel._id;
  return {id, title, completed};
};

let updateTodo = (id, fields, res) => {
  return Todo.findByIdAndUpdate(id, fields, {new: true})
    .then(todo => {
      if (!todo) return res.sendStatus(404);
      res.json(toFrontTodo(todo));
    });
};

app.post('/api/todos', (req, res) => {
  Todo.create({title: req.body.title, completed: false})
    .then(todo => {
      res.json(toFrontTodo(todo));
    });
});


app.put('/api/todos/:id', (req, res) => {
  let {id} = req.params;
  let {title} = req.body;
  updateTodo(id, {title}, res);
});

app.patch('/api/todos/:id', (req, res) => {
  let {id} = req.params;
  let {completed} = req.body;
  updateTodo(id, {completed}, res);
});

app.delete('/api/todos/:id', (req, res) => {
  Todo.deleteOne({_id: req.params.id})
    .then(() => {
      res.sendStatus(204);
    });
});

app.listen(5000, 'localhost')
  .once('listening', () => {
    console.log('Server started on 5000');
  });
