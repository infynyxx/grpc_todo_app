import React, { useState, useEffect } from 'react';

import { getToDos, deleteTodo } from '../services/todo-service';
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

// better not to use protobuf objects
export interface TodoProp {
  id: number,
  content: string,
  finished: boolean,
  touchedTimestamp: number
}

interface TodoTableProps {
  newTodoCreated: Todo | null
}


const TodoTable: React.FC<TodoTableProps> = (props) => {
  const [todosList, setTodos] = useState<Array<Todo>>([]);
  const [deletedTodoId, setDeleteTodoId] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTodoDelete = (todo: Todo) => {
    deleteTodo(todo)
      .then((response: DeleteTodoResponse) => {
        console.log('DeleteTodoResponse');
        console.log(response.getDeleted() + " " + response.getId());
        console.log('deletedTodoId=' + deletedTodoId);
        if (response.getDeleted() === true) {
          setDeleteTodoId(response.getId());
        } else {
          setErrorMessage('Unable to delete todo item.');
        }
      }).catch(error => setErrorMessage(error.message));
  }

  useEffect(() => {
    console.log('caling getToDos deletedTodoId=' + deletedTodoId);
    getToDos()
      .then((todos) => setTodos(todos))
      .catch(error => {
           setErrorMessage(error.message);
       });
  }, [deletedTodoId]);

  const rows = todosList.map(todo => {
      return (
        <TodoSingle key={todo.getId()} todoProp={todo} onTodoDelete={handleTodoDelete} />
        );
      });

  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="a dense table">
        <TableBody>
          { rows }
          { props.newTodoCreated &&
            <TodoSingle
              key={props.newTodoCreated.getId()}
              todoProp={props.newTodoCreated}
              onTodoDelete={handleTodoDelete}
            />
          }
         </TableBody>
      </Table>
      <AlertSnackBar errorMessage={errorMessage} />
    </TableContainer>
    );
}

export default TodoTable;
