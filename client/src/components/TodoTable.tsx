import React from 'react';

import { grpc } from "@improbable-eng/grpc-web";
import { getToDos } from '../services/todo-service';
import { Todo } from '../pb_generated/todos/todos_pb';
import { Status } from '../pb_generated/todos/todos_pb_service';
import formatRelative from 'date-fns/formatRelative';

export interface TodoProps {
    ts: number,
    content: string,
    finished: boolean
}

export class TodoRow extends React.Component<TodoProps, {}> {
    render() {
        const done = this.props.finished ? "FINISHED" : "NOT FINISHED";
        return (
            <tr>
                <td>{ formatRelative(this.props.ts * 1000, new Date()) }</td>
                <td>{ this.props.content }</td>
                <td>{ done }</td>
            </tr>
            );
    }
}

export interface TodoTableState {
    todos: Array<Todo>
}

export class TodoTable extends React.Component<{}, TodoTableState> {
    constructor() {
        super({});
        this.state = {
            todos: []
        };
    }

    componentDidMount() {
        getToDos()
            .then((todos) => this.setState({ todos: todos }))
            .catch(error => {
                alert(error);
            });
    }

    render() {
        const todos = this.state.todos;
        const rows = todos.map(todo => {
            return (
                <TodoRow key={todo.getId()} ts={todo.getTouchedTs()} content={todo.getContent()} finished={todo.getFinished()} />
                );
        });
        return (
            <table>
                <thead>
                    <tr>
                        <td>Time</td>
                        <td>content</td>
                        <td>done?</td>
                    </tr>
                </thead>
                <tbody>
                    { rows }
                </tbody>
            </table>
            );
    }
}
