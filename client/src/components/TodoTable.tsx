import React, { useState, useEffect } from 'react';

import { getToDos } from '../services/todo-service';
import { Todo } from '../pb_generated/todos/todos_pb';
import TodoSingle from './TodoSingle';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface TodoTableProps {
  newTodoCreated: Todo | null
}

const TodoTable: React.FC<TodoTableProps> = (props) => {
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
        <TodoSingle key={todo.getId()} todoProp={todo} />
        );
      });

  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="a dense table">
        <TableBody>
          { rows }
          { props.newTodoCreated &&
            <TodoSingle key={props.newTodoCreated.getId()} todoProp={props.newTodoCreated} />
          }
         </TableBody>
      </Table>
    </TableContainer>
    );
}

export default TodoTable;
