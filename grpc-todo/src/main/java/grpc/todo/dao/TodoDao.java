package grpc.todo.dao;

import java.util.List;
import org.jdbi.v3.sqlobject.config.RegisterRowMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

public interface TodoDao {
  @SqlUpdate("create table todos (id int primary key auto_increment, "
          + "content TEXT not null, touched_ts long not null, "
          + "finished boolean default false not null)")
  void createTable();

  @SqlUpdate("insert into todos (content, touched_ts) values (:content, :touched_ts)")
  @GetGeneratedKeys({"id"})
  int insert(@Bind("content") String content, @Bind("touched_ts") long touchedTimestamp);

  @SqlUpdate("update todos set content = :content, touched_ts = :touched_ts, "
          + "finished = :finished where id = :id")
  void update(@Bind("id") int id,
          @Bind("content") String content,
          @Bind("touched_ts") long touchedTimestamp,
          @Bind("finished") boolean finished);

  @SqlQuery("select id, content, touched_ts, finished from todos order by touched_ts desc")
  @RegisterRowMapper(TodoMapper.class)
  List<Todo> listTodos();

  @SqlQuery("select id, content, touched_ts, finished from todos where id = ?")
  Todo getTodo(int id);
}
