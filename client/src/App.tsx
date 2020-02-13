import React from 'react';

import './App.css';
import { TodoTable } from './components/TodoTable';
import { CreateTodo } from './components/CreateTodo';

const App: React.FC = () => {
  return (
    <div className="App">
      <CreateTodo />
      <TodoTable />
    </div>
  );
}

export default App;
