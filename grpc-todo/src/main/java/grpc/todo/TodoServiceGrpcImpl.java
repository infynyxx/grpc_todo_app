package grpc.todo;

import grpc.todo.dao.TodoDao;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;

import todos.v1.TodoServiceGrpc;
import todos.v1.Todos.DeleteTodoRequest;
import todos.v1.Todos.DeleteTodoResponse;
import todos.v1.Todos.GetTodoRequest;
import todos.v1.Todos.ListTodoRequest;
import todos.v1.Todos.Todo;

public class TodoServiceGrpcImpl extends TodoServiceGrpc.TodoServiceImplBase {

  private final TodoDao todoDao;

  public TodoServiceGrpcImpl(TodoDao todoDao) {
    this.todoDao = todoDao;
  }

  @Override
  public void getTodoById(GetTodoRequest request, StreamObserver<Todo> responseObserver) {
    final grpc.todo.dao.Todo todo = todoDao.getTodo(request.getId());
    if (todo == null) {
      responseObserver.onError(
          Status.NOT_FOUND.withDescription("id not present").asRuntimeException());
    } else {
      final Todo todoProto = Todo
              .newBuilder()
              .setId(todo.id())
              .setTouchedTs(todo.touchedTimestamp())
              .setContent(todo.content())
              .setFinished(todo.finished())
              .build();
      responseObserver.onNext(todoProto);
    }
    responseObserver.onCompleted();
  }

  @Override
  public void updateTodo(Todo request, StreamObserver<Todo> responseObserver) {
    if (request.getId() <= 0) {
      responseObserver.onError(
          Status.NOT_FOUND
              .withDescription(String.format("id=%d not present for updating", request.getId()))
              .asRuntimeException());
    } else {
      final long ts = System.currentTimeMillis() / 1000;
      todoDao.update(request.getId(), request.getContent(), ts, request.getFinished());
      responseObserver.onNext(request
              .toBuilder()
              .setTouchedTs(ts)
              .build());
    }
    responseObserver.onCompleted();
  }

  @Override
  public void createTodo(Todo request, StreamObserver<Todo> responseObserver) {
    // todo: check content value
    final long ts = System.currentTimeMillis() / 1000;
    final int id = todoDao.insert(request.getContent(), ts);
    final Todo todoWithId = request
            .toBuilder()
            .setId(id)
            .setTouchedTs(ts)
            .build();
    responseObserver.onNext(todoWithId);
    responseObserver.onCompleted();
  }

  @Override
  public void deleteTodo(DeleteTodoRequest request,
          StreamObserver<DeleteTodoResponse> responseObserver) {
    int rs = todoDao.deleteById(request.getId());
    DeleteTodoResponse.Builder responseBuilder = DeleteTodoResponse.newBuilder().setId(request.getId());
    responseBuilder.setDeleted(rs == 1);
    responseObserver.onNext(responseBuilder.build());
    responseObserver.onCompleted();
  }

  @Override
  public void listTodos(ListTodoRequest request,
          StreamObserver<Todo> responseObserver) {
    todoDao.listTodos().forEach(x -> {
      final Todo todoProto = Todo
              .newBuilder()
              .setId(x.id())
              .setContent(x.content())
              .setFinished(x.finished())
              .setTouchedTs(x.touchedTimestamp())
              .build();
      responseObserver.onNext(todoProto);
    });
    responseObserver.onCompleted();
  }
}
