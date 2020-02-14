package grpc.todo;

import grpc.todo.dao.TodoDao;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.h2.jdbcx.JdbcConnectionPool;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;

public class TodoServer {
  private static final Logger logger = Logger.getLogger(TodoServer.class.getName());

  final int port;

  final Jdbi jdbi;

  public TodoServer(int port, Jdbi jdbi) {
    this.port = port;
    this.jdbi = jdbi;
  }

  void start() throws IOException, InterruptedException {
    final Server server = ServerBuilder
            .forPort(port)
            .addService(new TodoServiceGrpcImpl(jdbi.onDemand(TodoDao.class)))
            .build()
            .start();
    logger.info(String.format("Started server at port=%d", port));
    Runtime.getRuntime()
        .addShutdownHook(
            new Thread(
                () -> {
                  try {
                    server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
                  } catch (Exception e) {
                    logger.log(Level.WARNING, "Unable to shutdown server", e);
                  }
                }));
    server.awaitTermination();
  }

  public void createTable() {
    jdbi.useExtension(TodoDao.class, TodoDao::createTable);
  }

  public static void main(String[] args) throws IOException, InterruptedException {
    final int port = Integer.parseInt(args[0]);
    final JdbcConnectionPool connectionPool = JdbcConnectionPool
            .create("jdbc:h2:mem:todo_app", "user", "****");
    Jdbi jdbi = Jdbi.create(connectionPool);
    jdbi.installPlugin(new SqlObjectPlugin());
    Runtime.getRuntime()
            .addShutdownHook(new Thread(connectionPool::dispose));

    final TodoServer server = new TodoServer(port, jdbi);
    server.createTable();
    server.start();
  }
}
