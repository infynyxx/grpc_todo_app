import React, { useState, MouseEvent } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

import formatRelative from 'date-fns/formatRelative';

import { AlertSnackBar } from './Alert';

import { updateToDo, TodoProp, todoProtobufToTodoProp, todoPropToProtobuf } from '../services/todo-service';

const StyledTextField = styled(TextField)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledDeleteCell = styled(TableCell)(({ theme }) => ({
  width: '20px',
  paddingRight: '1px',
}));

interface TodoProps {
  todoProp: TodoProp,
  onTodoDelete: ((todo: TodoProp) => void),
}

const TodoSingle: React.FC<TodoProps> = (props) => {
  const { todoProp } = props;

  const [todo, setTodo] = useState<TodoProp>(todoProp);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const todoPb = todoPropToProtobuf(todo);
    todoPb.setFinished(event.target.checked);

    updateToDo(todoPb).then(newTodo => {
      setTodo(todoProtobufToTodoProp(newTodo));
    }).catch(error => setErrorMessage(error.message));
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === '') {
      return;
    }
    const todoCopy = { ...todo };
    todoCopy.content = event.target.value;
    setTodo(todoCopy);
  };

  const handleContentUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todo.content.trim() === '') {
      return;
    }
    updateToDo(todoPropToProtobuf(todo)).then(newTodo => {
      setTodo(todoProtobufToTodoProp(newTodo));
    }).catch(error => setErrorMessage(error.message));
  };

  const handleContentDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.onTodoDelete(todo);
  };

  const todoFormKey = `todo-single-form-${todo.id}`;

  return (
    <TableRow key={todo.id}>
      <TableCell component="th" scope="row">
        {formatRelative(todo.touchedTimestamp * 1000, new Date())}
      </TableCell>
      <TableCell>
        <form noValidate autoComplete="off" onSubmit={handleContentUpdate} key={todoFormKey}>
          <TextField
            required
            size="small"
            value={todo.content}
            onChange={handleContentChange}
          />
        </form>
      </TableCell>
      <StyledDeleteCell>
        <Checkbox
          checked={todo.finished}
          onChange={handleCheckboxChange}
          value="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </StyledDeleteCell>
      <StyledDeleteCell align="right" size="small">
        <IconButton aria-label="delete" sx={{ margin: 1 }} onClick={handleContentDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </StyledDeleteCell>
      <AlertSnackBar errorMessage={errorMessage} />
    </TableRow>
  );
}

export default TodoSingle;
