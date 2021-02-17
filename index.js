const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "todo_application",
});
connection.connect((err) => {
  if (err) {
    throw err;
  }
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// /\ --------------- SETUP --------------- /\

// \/ --------------- API --------------- \/

app.get("/api/randomuuid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { v4: uuidv4 } = require("uuid");
  res.send("" + uuidv4());
});

app.get("/api/todos/:userid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  connection.query(
    `SELECT * FROM todos WHERE userid = '${req.params.userid}'`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }
      res.send(results[0]);
    }
  );
});

app.post("/api/todos/:userid", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");

  console.log("req.body");
  console.debug(req.body);
  var todo = req.body.todoid + ";" + req.body.todo;

  console.log(todo);

  connection.query(
    `SELECT * FROM todos WHERE userid = '${req.params.userid}'`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }

      console.log("OLD: " + results[0].todos);

      var todos = results[0].todos;

      todos = todos + "|" + todo;

      console.log("NEW: " + todos);

      res.send(results[0]);

      connection.query(
        `UPDATE todos SET todos='${todos}' WHERE userid='${req.params.userid}'`,
        (error1, results1, fields1) => {
          if (error1) {
            throw error;
          }
        }
      );
    }
  );
});

app.delete("/api/todos/:userid/:todoid", (req, res) => {
  connection.query(
    `SELECT * FROM todos WHERE userid = '${req.params.userid}'`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }

      todos = results[0].todos.split("|");

      newTodos = "";

      for (i = 0; i < todos.length; i++) {
        if (!(todos[i].split(";")[0] == req.params.todoid)) {
          if (newTodos !== "") {
            newTodos = todos[i] + "|" + newTodos;
          }
        }
      }

      console.log("OLD: " + todos);
      console.log("NEW: " + newTodos);

      res.send(newTodos);

      connection.query(
        `UPDATE todos SET todos='${newTodos}' WHERE userid='${req.params.userid}'`,
        (error1, results1, fields1) => {
          if (error1) {
            throw error1;
          }
        }
      );
    }
  );
});

// /\ --------------- API --------------- /\

// \/ --------------- PAGES --------------- \/

app.get("/todo", (req, res) => {
  res.render("todo");
});

app.get("/", (req, res) => {
  res.redirect("/todo");
});
// /\ --------------- PAGES --------------- /\

// \/----------------- Have to be last -------------------\/
app.use((req, res, next) => {
  res.render("404", { res: res });
});

app.listen(port, () => {
  console.log("Listening on port " + port + "...");
});
// /\----------------- Have to be last -------------------/\
