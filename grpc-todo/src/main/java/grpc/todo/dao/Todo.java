package grpc.todo.dao;

import com.google.auto.value.AutoValue;

@AutoValue
public abstract class Todo {
  public abstract int id();

  public abstract String content();

  public abstract boolean finished();

  public abstract long touchedTimestamp();

  public static Todo create(int id, String content, boolean finished, long touchedTimestamp) {
    return new AutoValue_Todo(id, content, finished, touchedTimestamp);
  }
}
