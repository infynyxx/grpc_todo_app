import React from 'react';

import './App.css';
import TodoTable from './components/TodoTable';
import { CreateTodo } from './components/CreateTodo';

import withStyles from '@material-ui/core/styles/withStyles';
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
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 500,
      color: theme.palette.text.secondary,
    },
  }),
);

const styles = {
  root: {
    flexGrow: 1,
    backgroundColor: variables.white,
    height: '100%',
    minHeight: '600px',
    width: '100%',
    overflowX: 'unset' as 'unset',
    marginLeft: '10px',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  headerOffset: {
    marginTop: '64px',
  },
};

const App: React.FC<{}> = () => {
  const classes = useStyles();
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
            <CreateTodo />
            <TodoTable />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default withRoot(withStyles(styles)(App));
