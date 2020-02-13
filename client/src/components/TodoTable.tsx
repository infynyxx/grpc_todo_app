import React, { useState, useEffect } from 'react';

import { getToDos } from '../services/todo-service';
import { Todo } from '../pb_generated/todos/todos_pb';
import formatRelative from 'date-fns/formatRelative';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});

const TodoTable: React.FC<{}> = () => {
  const [todosList, setTodos] = useState<Array<Todo>>([]);
  useEffect(() => {
    getToDos()
      .then((todos) => setTodos(todos))
      .catch(error => {
           alert(error);
       });
  }, []);

  const rows = todosList.map(todo => {
      return (
        <TableRow key={todo.getId()}>
          <TableCell component="th" scope="row">
            {formatRelative(todo.getTouchedTs() * 1000, new Date())}
          </TableCell>
          <TableCell>{todo.getContent()}</TableCell>
          <TableCell>{todo.getFinished() ? 'Finished' : 'Not Finished'}</TableCell>
        </TableRow>
        );
      });
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Done?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{ rows }</TableBody>
      </Table>
    </TableContainer>
    );
}

export default TodoTable;
