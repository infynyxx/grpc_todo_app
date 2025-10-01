import React, { useState, StrictMode } from 'react';

import TodoTable from './components/TodoTable';
import { CreateTodo } from './components/CreateTodo';
import { TodoProp } from './services/todo-service';
import variables from './styles/variables';
import withRoot from './withRoot';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const RootContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: variables.white,
  overflowX: 'unset',
  marginLeft: '10px',
  height: '100%',
  minHeight: '600px',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: 'auto',
  maxWidth: 800,
  color: theme.palette.text.secondary,
}));

const App: React.FC<{}> = () => {
  const [todo, setTodo] = useState<TodoProp>();

  const handleTodoCreated = (todo: TodoProp) => {
    setTodo(todo);
  }
  return (
    <RootContainer>
      <StrictMode>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h3" component="h3">
                GRPC Todo App
              </Typography>
            </StyledPaper>
          </Grid>
          <Grid item xs={12}>
            <StyledPaper>
              <CreateTodo onTodoCreated={handleTodoCreated} />
              <TodoTable newTodoCreated={todo} />
            </StyledPaper>
          </Grid>
        </Grid>
      </StrictMode>
    </RootContainer>
  );
}

export default withRoot(App);
