import React, { useState } from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import formatRelative from 'date-fns/formatRelative';

import { updateToDo } from '../services/todo-service';
import { Todo } from '../pb_generated/todos/todos_pb';

interface TodoProps {
  todoProp: Todo
}

const createTodo = (todo: Todo) => {
  const newTodo = new Todo();
  newTodo.setId(todo.getId());
  newTodo.setContent(todo.getContent());
  newTodo.setTouchedTs(todo.getTouchedTs());
  newTodo.setFinished(todo.getFinished());
  return newTodo;
};

const TodoSingle: React.FC<TodoProps> = (props) => {
  const { todoProp } = props;

  const [todo, setTodo] = useState<Todo>(todoProp);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("updating todo " + todo.getId());
    todo.setFinished(event.target.checked);

    updateToDo(todo).then(newTodo => {
      setTodo(newTodo);
    }).catch(error => alert(error));
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === '') {
      return;
    }
    todo.setContent(event.target.value);
    setTodo(createTodo(todo));
  };

  const handleContentUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(todo.getContent());
    if (todo.getContent().trim() === '') {
      return;
    }
    updateToDo(todo).then(newTodo => {
      setTodo(newTodo);
    }).catch(error => alert(error));
  };

  const todoFormKey = `todo-single-form-${todo.getId()}`;

  return (
    <TableRow key={todo.getId()}>
      <TableCell component="th" scope="row">
        {formatRelative(todo.getTouchedTs() * 1000, new Date())}
      </TableCell>
      <TableCell>
        <form noValidate autoComplete="off" onSubmit={handleContentUpdate} key={todoFormKey}>
          <TextField
            required
            size="small"
            value={todo.getContent()}
            onChange={handleContentChange}
          />
        </form>
      </TableCell>
      <TableCell>
        <Checkbox
          checked={todo.getFinished()}
          onChange={handleCheckboxChange}
          value="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </TableCell>
    </TableRow>
  );
}

export default TodoSingle;
