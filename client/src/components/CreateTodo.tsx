import React from 'react';

import { createToDo } from '../services/todo-service';

export interface CreateTodoState {
  content: string
}

export class CreateTodo extends React.Component<{}, CreateTodoState> {
  constructor() {
    super({});
    this.state = {
      content: ''
    };
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { content } = this.state;
    if (content.trim() === '') {
      return;
    }
    createToDo(content).then(todo => {
      console.log('created new todo');
      console.log(todo);
      this.setState({ content: ''});
    }).catch(error => {
      alert(error);
    })
  }

  onContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: e.target.value });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input
              type="text"
              placeholder="Create New.."
              onChange={this.onContentChange}
              value={this.state.content} />
          </label>
        </form>
      </div>
      );
  }
}
