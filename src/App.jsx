import React from 'react';
import axios from 'axios';
import Header from './components/Header';
import Todo from './components/Todo';
import Form from './components/Form';

let urls = {
  todos: '/api/todos'
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: []
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  handleError(error) {
    console.error(error.message);
  }

  componentDidMount() {
    axios.get(urls.todos)
      .then(response => response.data)
      .then(todos => this.setState({todos}))
      .catch(this.handleError)
  }

  handleAdd(title) {
    axios.post(urls.todos, {title})
      .then(res => {
        let todo = res.data;
        const todos = [...this.state.todos, todo];
        this.setState({todos});
      })
      .catch(this.handleError)
  }

  handleDelete(id) {
    axios.delete(`${urls.todos}/${id}`)
      .then(() => {
        const todos = this.state.todos.filter(todo => todo.id !== id);
        this.setState({todos});
      })
      .catch(this.handleError);
  }

  handleToggle(id) {
    let completed = !this.state.todos.find(todo => id === todo.id).completed;
    axios.patch(`${urls.todos}/${id}`, {completed})
      .then(res => {
        const todos = this.state.todos.map(todo => {
          if(todo.id === id){
            todo = res.data
          }
          return todo;
        });
        this.setState({todos});
      })
      .catch(this.handleError)
  }

  handleEdit(id, title) {
    axios.put(`${urls.todos}/${id}`, {title})
      .then(res => {
        const todos = this.state.todos.map(todo => {
          if(todo.id === id){
            todo = res.data;
          }
          return todo;
        });
        this.setState({todos});
      })
      .catch(this.handleError)
  }

  render() {
    return (
      <main>
        <Header todos={this.state.todos}/>

        <section className="todo-list">
          {this.state.todos.map(todo =>
            <Todo
              key={todo.id}
              id={todo.id}
              title={todo.title}
              completed={todo.completed}
              onDelete={this.handleDelete}
              onToggle={this.handleToggle}
              onEdit={this.handleEdit}
            />)
          }
        </section>

        <Form onAdd={this.handleAdd}/>
      </main>
    );
  }
}

export default App;