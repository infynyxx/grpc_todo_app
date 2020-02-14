import React, { useState, MouseEvent } from 'react';

import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import formatRelative from 'date-fns/formatRelative';

import { updateToDo } from '../services/todo-service';
import { Todo } from '../pb_generated/todos/todos_pb';

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
  todoProp: Todo,
  onTodoDelete: ((todo: Todo) => void),
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

  const handleContentDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    props.onTodoDelete(todo);
  };

  const todoFormKey = `todo-single-form-${todo.getId()}`;
  const classes = useStyles();

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
      <TableCell className={classes.deleteCell}>
        <Checkbox
          checked={todo.getFinished()}
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
    </TableRow>
  );
}

export default TodoSingle;
