import { reactive } from "vue";
import { invoke } from "@tauri-apps/api/core";
const sqlite = reactive({
  exec: function (sql, ..._params) {
    return invoke("sqlite_exec", {
      sql: sql,
      params: _params == null || _params.length <= 0 ? [] : _params,
    });
  },
  query: function (sql, ..._params) {
    return invoke("sqlite_query", {
      sql: sql,
      params: _params == null || _params.length <= 0 ? [] : _params,
    });
  },
  migrate: function (sql) {
    return invoke("sqlite_migrate", {
      sql: sql,
      params: [],
    });
  },
});

export default sqlite;
