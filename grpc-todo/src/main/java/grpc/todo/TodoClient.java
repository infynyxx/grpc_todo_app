package grpc.todo;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;

import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

import todos.TodoServiceGrpc;
import todos.Todos.GetTodoRequest;
import todos.Todos.Todo;

public class TodoClient {
    final String host;
    final int port;
    final ManagedChannel managedChannel;
    final TodoServiceGrpc.TodoServiceBlockingStub blockingStub;

    private static final Logger logger = Logger.getLogger(TodoClient.class.getName());

    public TodoClient(String host, int port) {
        this.host = host;
        this.port = port;
        managedChannel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
        blockingStub = TodoServiceGrpc.newBlockingStub(managedChannel);
    }

    void shutdown() throws InterruptedException {
        managedChannel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    public void getToDoById(int id) {
        GetTodoRequest request = GetTodoRequest
                .newBuilder()
                .setId(id)
                .build();
        try {
            final Todo response = blockingStub.getTodoById(request);
            logger.info(String.format("response: content=%s finished=%s", response.getContent(), response.getFinished()));
        } catch (StatusRuntimeException e) {
            logger.warning("RPC failure " + e.getMessage());
            e.printStackTrace();
        }
    }

    public int createToDo(String content, boolean finished) {
        final Todo todoNew = Todo.newBuilder().setContent(content).setFinished(finished).build();
        try {
            final Todo todoWithId = blockingStub.createTodo(todoNew);
            logger.info(String.format("created new todo with id=%d", todoWithId.getId()));
            return todoWithId.getId();
        } catch (StatusRuntimeException e) {
            logger.warning("RPC failure " + e.getMessage());
            throw e;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        final TodoClient client = new TodoClient("localhost", 5001);
        try {
            int id = client.createToDo("Hello Unix", false);
            client.getToDoById(id);
            client.blockingStub.updateTodo(
                    client.blockingStub.getTodoById(GetTodoRequest.newBuilder().setId(id).build())
                            .toBuilder().setContent("Prajwal").build());
            client.getToDoById(id);
            client.blockingStub.updateTodo(Todo.newBuilder().setContent("hola").setId(randomUnsignedInt()).build());
        } finally {
            client.shutdown();
        }
    }

    static int randomUnsignedInt() {
        return ThreadLocalRandom.current().nextInt(0, Integer.MAX_VALUE);
    }
}
