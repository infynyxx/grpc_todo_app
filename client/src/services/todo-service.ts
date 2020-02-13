import { grpc } from "@improbable-eng/grpc-web";
import { TodoServiceClient, Status } from '../pb_generated/todos/todos_pb_service';
import { ListTodoRequest, Todo } from '../pb_generated/todos/todos_pb';

export const client = new TodoServiceClient('http://localhost:8080');

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
                    reject(new Error(status.details));
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
                const errorMessage = `code=${error.code} message=${error.message}`;
                reject(new Error(errorMessage));
            } else {
                resolve(responseMessage as Todo);
            }
        });
    });
}
