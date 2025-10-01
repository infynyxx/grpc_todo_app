import React, { useState, useEffect } from 'react';

import { getToDos, deleteTodo, TodoProp, todoPropToProtobuf, todoProtobufToTodoProp } from '../services/todo-service';
import { Todo, DeleteTodoResponse } from '../pb_generated/todos/todos_pb';
import TodoSingle from './TodoSingle';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { AlertSnackBar } from './Alert';

const StyledTable = styled(Table)({
  minWidth: 650,
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

  return (
    <TableContainer component={Paper}>
      <StyledTable aria-label="a dense table">
        <TableBody>
          {rows}
        </TableBody>
      </StyledTable>
      <AlertSnackBar errorMessage={errorMessage} />
    </TableContainer>
  );
}

export default TodoTable;
