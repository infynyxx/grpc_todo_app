package grpc.todo;

import com.google.common.collect.Maps;

import io.grpc.Status;
import io.grpc.stub.StreamObserver;

import java.util.Map;

import todos.v1.TodoServiceGrpc;
import todos.v1.Todos.DeleteTodoRequest;
import todos.v1.Todos.DeleteTodoResponse;
import todos.v1.Todos.GetTodoRequest;
import todos.v1.Todos.Todo;

public class TodoServiceGrpcImpl extends TodoServiceGrpc.TodoServiceImplBase {

  private final Map<Integer, Todo> map = Maps.newHashMap();

  @Override
  public void getTodoById(GetTodoRequest request, StreamObserver<Todo> responseObserver) {
    final Todo todo = map.get(request.getId());
    if (todo == null) {
      responseObserver.onError(
          Status.NOT_FOUND.withDescription("id not present for updating").asRuntimeException());
    } else {
      responseObserver.onNext(todo);
    }
    responseObserver.onCompleted();
  }

  @Override
  public void updateTodo(Todo request, StreamObserver<Todo> responseObserver) {
    if (request.getId() <= 0 || !map.containsKey(request.getId())) {
      responseObserver.onError(
          Status.NOT_FOUND
              .withDescription(String.format("id=%d not present for updating", request.getId()))
              .asRuntimeException());
    } else {
      map.put(request.getId(), request);
      responseObserver.onNext(request);
    }
    responseObserver.onCompleted();
  }

  @Override
  public void createTodo(Todo request, StreamObserver<Todo> responseObserver) {
    final int id = TodoClient.randomUnsignedInt();
    final Todo todoWithId = request.toBuilder().setId(id).build();
    map.put(id, todoWithId);
    responseObserver.onNext(todoWithId);
    responseObserver.onCompleted();
  }

  @Override
  public void deleteTodo(DeleteTodoRequest request,
          StreamObserver<DeleteTodoResponse> responseObserver) {
    final boolean deleted = map.remove(request.getId()) != null;
    responseObserver.onNext(DeleteTodoResponse
            .newBuilder()
            .setDeleted(deleted)
            .setId(request.getId())
            .build());
    responseObserver.onCompleted();
  }
}
