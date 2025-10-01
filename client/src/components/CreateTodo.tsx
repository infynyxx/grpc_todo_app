import React, { useState } from 'react';

import { createToDo, TodoProp, todoProtobufToTodoProp } from '../services/todo-service';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AlertSnackBar } from './Alert';
import Box from '@mui/material/Box';

export interface CreateTodoState {
  content: string
}

const StyledForm = styled(Box)(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(1),
    width: 200,
  },
}));

interface CreateTodoProps {
  onTodoCreated: ((todo: TodoProp) => void)
}

export const CreateTodo: React.FC<CreateTodoProps> = (props) => {
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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
      props.onTodoCreated(todoProtobufToTodoProp(todo));
    }).catch(error => {
      setErrorMessage(error.message);
    })
  };

  return (
    <StyledForm component="form" noValidate autoComplete="off" onSubmit={onFormSubmit}>
      <TextField
        id="standard-basic"
        label="Create New"
        value={content}
        onChange={onContentChange}
        variant="outlined"
        size="small"
      />
      <AlertSnackBar errorMessage={errorMessage} />
    </StyledForm>
  );
};
