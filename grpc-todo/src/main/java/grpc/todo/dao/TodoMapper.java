package grpc.todo.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import org.jdbi.v3.core.mapper.RowMapper;
import org.jdbi.v3.core.statement.StatementContext;

public class TodoMapper implements RowMapper<Todo> {

  @Override
  public Todo map(ResultSet resultSet, StatementContext statementContext) throws SQLException {
    return Todo.create(resultSet.getInt("id"),
            resultSet.getString("content"),
            resultSet.getBoolean("finished"),
            resultSet.getLong("touched_ts"));
  }
}
