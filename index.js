const cookieParser = require("cookie-parser");
const express = require("express");
const { object } = require("joi");
const Joi = require("joi");
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
app.use(cookieParser());

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
    `SELECT * FROM userdata WHERE userid = '${req.params.userid}'`,
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
  var todo = req.body.todoid + ";" + req.body.todo;

  connection.query(
    `SELECT * FROM userdata WHERE userid = '${req.params.userid}'`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }

      var todos = results[0].todos;

      if (todos != "") {
        todos = todos + "|" + todo;
      } else {
        todos = todos + todo;
      }

      res.send(results[0]);

      connection.query(
        `UPDATE userdata SET todos='${todos}' WHERE userid='${req.params.userid}'`,
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
    `SELECT * FROM userdata WHERE userid = '${req.params.userid}'`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }

      todos = results[0].todos.split("|");

      newTodos = "";

      for (i = 0; i < todos.length; i++) {
        if (!(todos[i].split(";")[0] == req.params.todoid)) {
          newTodos = todos[i] + "|" + newTodos;
        }
      }

      res.send(newTodos);

      connection.query(
        `UPDATE userdata SET todos='${newTodos}' WHERE userid='${req.params.userid}'`,
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
  console.log(req.cookies);

  console.log(req.cookies.userid + " " + req.cookies.logged_in);

  if (req.cookies.logged_in == "true" && req.cookies.userid != null) {
    res.render("todo", { userid: req.cookies.userid });
    return;
  } else {
    res.redirect("/login");
  }
});

app.get("/createaccount", (req, res) => {
  const shema = Joi.object({
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(50),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),

    repeat_password: Joi.ref("password"),
  });

  let object = {};

  if (
    !req.query.username ||
    !req.query.password ||
    !req.query.repeat_password
  ) {
    object.tried_login = false;
    res.render("createaccount", object);
    return;
  }

  let username = req.query.username;
  let password = req.query.password;
  let repeat_password = req.query.repeat_password;

  let result_username = shema.validate({ username });
  let result_password = shema.validate({ password });
  let result_repeat_password = shema.validate({ repeat_password });
  let result_all = shema.validate({ username, password, repeat_password });

  console.log(result_all);

  res.render("createaccount", object);
});

app.get("/logout", (req, res) => {
  res.cookie("logged_in", "false");
  res.cookie("userid", "");
  res.redirect("http://localhost:3000/login");
});

app.get("/login", (req, res) => {
  let object = {};

  console.log("Signed: " + JSON.stringify(req.signedCookies));
  console.log("Unsigned: " + JSON.stringify(req.cookies));

  if (!(req.query.username && req.query.password)) {
    object.tried_login = false;
    res.render("login", object);

    console.log("No login tried or fields emty");

    return;
  }

  console.log("Tried login");

  object.tried_login = true;

  object.username = req.query.username;
  object.password = req.query.password;

  connection.query(
    `SELECT * FROM userdata WHERE username='${req.query.username}'`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }

      if (results == []) {
        object.account_exists = false;
      } else {
        object.account_exists = true;

        if (results[0].password === req.query.password) {
          object.password_right = true;
          object.success = true;
          object.userid = results[0].userid;
          res.cookie("userid", results[0].userid);
          res.cookie("logged_in", "true");
          res.redirect("/todo");
          return;
        } else {
          object.password_right = false;
        }
      }

      console.log(object);
      res.render("login", object);
    }
  );
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

// \/ --------------- UTILS --------------- \/

function addCoockie(req, name, value) {
  if ((req.cookies = null)) req.cookies = req.cookies + `; ${name}=${value}`;
}

// /\ --------------- UTILS --------------- /\
