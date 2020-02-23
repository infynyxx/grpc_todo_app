import { grpc } from "@improbable-eng/grpc-web";
import { TodoServiceClient, Status } from '../pb_generated/todos/todos_pb_service';
import { ListTodoRequest, Todo, DeleteTodoResponse, DeleteTodoRequest } from '../pb_generated/todos/todos_pb';

export const client = new TodoServiceClient(process.env.REACT_APP_TODO_SERVICE_CLIENT_URL);

// better not to use protobuf objects
export interface TodoProp {
  id: number,
  content: string,
  finished: boolean,
  touchedTimestamp: number
}

export const todoPropToProtobuf = (todoProp: TodoProp) => {
    const todo = new Todo();
    todo.setContent(todoProp.content);
    todo.setId(todoProp.id);
    todo.setFinished(todoProp.finished);
    todo.setTouchedTs(todoProp.touchedTimestamp);
    return todo;
}

export const todoProtobufToTodoProp = (todoPb: Todo) => {
    return {
        id: todoPb.getId(),
        content: todoPb.getContent(),
        finished: todoPb.getFinished(),
        touchedTimestamp: todoPb.getTouchedTs()
    };
}

export const getToDos = () => {
    return new Promise<Array<Todo>>((resolve, reject) => {
        const todos: Array<Todo> = [];
        client
            .listTodos(new ListTodoRequest())
            .on('data', (message: Todo) => {
                todos.push(message);
            })
            .on('status', (status: Status) => {
                if (status.code !== grpc.Code.OK) {
                    reject(new Error(`Error retrieving todo items. Error code=${status.code} ${status.details}`));
                }
            })
            .on('end', () => {
                resolve(todos);
            });
    });
}

export const createToDo = (content: string) => {
    const todo = new Todo();
    todo.setContent(content);
    todo.setFinished(false);
    return new Promise<Todo>((resolve, reject) => {
        client.createTodo(todo, (error, responseMessage) => {
            if (error) {
                const errorMessage = `Error creating todo item. Error code=${error.code} message=${error.message}`;
                reject(new Error(errorMessage));
            } else {
                resolve(responseMessage as Todo);
            }
        });
    });
}

export const updateToDo = (todo: Todo) => {
    return new Promise<Todo>((resolve, reject) => {
        client.updateTodo(todo, (error, responseMessage) => {
            if (error) {
                reject(new Error(`Error updating todo item. Error code=${error.code} message=${error.message}`));
            } else {
                resolve(responseMessage as Todo);
            }
        });
    });
};

export const deleteTodo = (todo: Todo) => {
    const deleteTodoRequest = new DeleteTodoRequest();
    deleteTodoRequest.setId(todo.getId());
    return new Promise<DeleteTodoResponse>((resolve, reject) => {
        client.deleteTodo(deleteTodoRequest, (error, responseMessage) => {
            if (error) {
                reject(new Error(`Error deleting todo item. Error code=${error.code} message=${error.message}`));
            } else {
                resolve(responseMessage as DeleteTodoResponse);
            }
        });
    });
};
