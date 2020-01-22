package grpc.todo;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

public class TodoServer {
    private static final Logger logger = Logger.getLogger(TodoServer.class.getName());

    final int port;

    public TodoServer(int port) {
        this.port = port;
    }

    void start() throws IOException, InterruptedException {
        final Server server = ServerBuilder
                .forPort(port)
                .addService(new TodoServiceGrpcImpl()).build().start();
        logger.info(String.format("Started server at port=%d", port));
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
            } catch (Exception e) {
                System.err.println("Unable to shutdown server");
                e.printStackTrace();
            }
        }));
        server.awaitTermination();
    }

    public static void main(String[] args) throws IOException, InterruptedException {
        final TodoServer server = new TodoServer(5001);
        server.start();
    }
}
