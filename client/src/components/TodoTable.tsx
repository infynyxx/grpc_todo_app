import React, { useState, useEffect } from 'react';

import { getToDos, deleteTodo, TodoProp, todoPropToProtobuf, todoProtobufToTodoProp } from '../services/todo-service';
import { Todo, DeleteTodoResponse } from '../pb_generated/todos/todos_pb';
import TodoSingle from './TodoSingle';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { AlertSnackBar } from './Alert';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface TodoTableProps {
  newTodoCreated?: TodoProp
}

const TodoTable: React.FC<TodoTableProps> = (props) => {
  const [todosList, setTodos] = useState<Array<Todo>>([]);
  const [deletedTodoId, setDeleteTodoId] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleTodoDelete = (todoProp: TodoProp) => {
    deleteTodo(todoPropToProtobuf(todoProp))
      .then((response: DeleteTodoResponse) => {
        if (response.getDeleted() === true) {
          setDeleteTodoId(response.getId());
        } else {
          setErrorMessage('Unable to delete todo item.');
        }
      }).catch(error => setErrorMessage(error.message));
  }

  useEffect(() => {
    getToDos()
      .then((todos) => setTodos(todos))
      .catch(error => {
           setErrorMessage(error.message);
       });
  }, [deletedTodoId, props.newTodoCreated]);

  const rows = todosList.map(todo => {
      return (
        <TodoSingle
          key={todo.getId()}
          todoProp={todoProtobufToTodoProp(todo)}
          onTodoDelete={handleTodoDelete}
        />
        );
      });

  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="a dense table">
        <TableBody>
          { rows }
         </TableBody>
      </Table>
      <AlertSnackBar errorMessage={errorMessage} />
    </TableContainer>
    );
}

export default TodoTable;
