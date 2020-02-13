import React, { useState } from 'react';

import { createToDo } from '../services/todo-service';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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

export const CreateTodo: React.FC<{}> = () => {
  const [content, setContent] = useState<string>('');
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
      console.log('created new todo');
      console.log(todo);
      setContent('');
    }).catch(error => {
      alert(error);
    })
  };
  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={onFormSubmit}>
      <TextField error id="standard-basic" label="Create New" defaultValue={content} value={content} onChange={onContentChange} />
    </form>
  );
};
