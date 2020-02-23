import React, { useState, MouseEvent } from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import formatRelative from 'date-fns/formatRelative';

import { AlertSnackBar } from './Alert';

import { updateToDo, TodoProp, todoProtobufToTodoProp, todoPropToProtobuf } from '../services/todo-service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    deleteCell: {
      width: '20px',
      paddingRight: '1px',
    },
  }),
);

interface TodoProps {
  todoProp: TodoProp,
  onTodoDelete: ((todo: TodoProp) => void),
}

const TodoSingle: React.FC<TodoProps> = (props) => {
  const { todoProp } = props;

  const [todo, setTodo] = useState<TodoProp>(todoProp);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    todo.content = event.target.value;
    setTodo(todo);
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
  const classes = useStyles();

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
      <TableCell className={classes.deleteCell}>
        <Checkbox
          checked={todo.finished}
          onChange={handleCheckboxChange}
          value="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </TableCell>
      <TableCell align="right" size="small" className={classes.deleteCell}>
        <IconButton aria-label="delete" className={classes.margin} onClick={handleContentDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </TableCell>
      <AlertSnackBar errorMessage={errorMessage} />
    </TableRow>
  );
}

export default TodoSingle;
