import React, { useState } from 'react';

import { createToDo } from '../services/todo-service';
import { Todo } from '../pb_generated/todos/todos_pb';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { AlertSnackBar } from './Alert';

export interface CreateTodoState {
  content: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: 200,
      },
    },
  }),
);

interface CreateTodoProps {
  onTodoCreated: ((todo: Todo) => void)
}

export const CreateTodo: React.FC<CreateTodoProps> = (props) => {
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const classes = useStyles();
  const onContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content.trim() === '') {
      return;
    }
    createToDo(content).then(todo => {
      setContent('')
      props.onTodoCreated(todo);
    }).catch(error => {
      setErrorMessage(error.message);
    })
  };

  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>
      <TextField
        error
        id="standard-basic"
        label="Create New"
        value={content}
        onChange={onContentChange}
      />
      <AlertSnackBar errorMessage={errorMessage} />
    </form>
  );
};
