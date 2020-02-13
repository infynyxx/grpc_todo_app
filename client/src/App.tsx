import React from 'react';

import './App.css';
import TodoTable from './components/TodoTable';
import { CreateTodo } from './components/CreateTodo';

import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import variables from './styles/variables';
import withRoot from './withRoot';

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

const App: React.FC<WithStyles<typeof styles>> = () => {
  return (
    <div className="App">
      <CreateTodo />
      <TodoTable />
    </div>
  );
}

export default withRoot(withStyles(styles)(App));
