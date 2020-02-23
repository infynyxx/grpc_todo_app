import React, { useState } from 'react';

import TodoTable from './components/TodoTable';
import { CreateTodo } from './components/CreateTodo';
import { TodoProp } from './services/todo-service';
import variables from './styles/variables';
import withRoot from './withRoot';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: variables.white,
      overflowX: 'unset' as 'unset',
      marginLeft: '10px',
      height: '100%',
      minHeight: '600px',
    },
    paper: {
      padding: theme.spacing(1),
      margin: 'auto',
      maxWidth: 800,
      color: theme.palette.text.secondary,
    },
  }),
);


const App: React.FC<{}> = () => {
  const classes = useStyles();
  const [todo, setTodo] = useState<TodoProp>();

  const handleTodoCreated = (todo: TodoProp) => {
    setTodo(todo);
    console.log("handleTodoCreated=" + JSON.stringify(todo));
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="h3" component="h3">
              GRPC Todo App
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <CreateTodo onTodoCreated={handleTodoCreated} />
            <TodoTable newTodoCreated={todo} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withRoot(App);
