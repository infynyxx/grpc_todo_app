import React from 'react';

export interface TodoProps {
    id: number,
    content: string,
    finished: boolean
}

export class TodoRow extends React.Component<TodoProps, {}> {
    render() {
        const done = this.props.finished ? "1" : "0";
        return (
            <tr>
                <td>{ this.props.content }</td>
                <td>{ done }</td>
            </tr>
            );
    }
}

export interface TodoTableProps {
    todos: Array<TodoProps>
}

export class TodoTable extends React.Component<TodoTableProps, {}> {
    render() {
        const todos = this.props.todos;
        const rows = todos.map(todo => {
            return (
                <TodoRow {...todo} />
                );
        });
        return (
            <table>
                <tbody>
                    { rows }
                </tbody>
            </table>
            );
    }
}