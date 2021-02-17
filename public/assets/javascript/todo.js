const userid = "6b2b5953-9a70-4eae-b5da-a41776d39420";

window.addEventListener("load", (event) => {
  console.log("Window loaded...");

  var todos = [];

  getRequest(`http://localhost:3000/api/todos/${userid}`, (responseText) => {
    todos = JSON.parse(responseText).todos.split("|");

    for (i = 0; i < todos.length; i++) {
      var id = todos[i].split(";")[0];
      var todo = todos[i].split(";")[1];

      if (
        !(todo == "" || id == "" || todo == "undefined" || id == "undefined")
      ) {
        addTodoManual(id, todo);
      }
    }
  });
});

/*document.getElementById('text-input').addEventListener('onkeypress', (event) => {
    if (event.keyCode === 13){
        event.preventDefault();

        addTodo();
    }
});*/

function enterPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault();

    addTodo();
  }
}

function addTodo() {
  var textinput = document.getElementById("text-input").value;

  if (textinput == "") {
    return;
  }

  getRequest("http://localhost:3000/api/randomuuid", (response) => {
    addTodoManual(response, textinput);

    let todo = {
      todo: textinput,
      todoid: response,
    };

    console.log("Todo " + todo);
    postRequest(
      `http://localhost:3000/api/todos/${userid}`,
      JSON.stringify(todo),
      function() {
        console.log(`Saved todo "${textinput}" with id "${response}"`);
      }
    );

    document.getElementById("text-input").value = "";
  });
}

function addTodoManual(id, inputtext) {
  var todoList = document.getElementById("todo-list");

  var todo = document.createElement("div");
  todo.setAttribute("id", "todo " + id);
  todo.setAttribute("class", "todo-box");

  var text = document.createTextNode(inputtext);
  var field = document.createElement("p");
  field.setAttribute("class", "todo-text");

  var buttonText = document.createTextNode("Remove");
  var button = document.createElement("button");
  button.setAttribute("class", "remove-todo");
  button.setAttribute("onclick", `removeFromTodo("${id}");`);
  button.appendChild(buttonText);

  field.appendChild(text);
  todo.appendChild(field);
  todo.appendChild(button);
  todoList.appendChild(todo);

  console.log("Added todo with the id: " + id);
}

function removeFromTodo(id) {
  var todo = document.getElementById("todo " + id);
  todo.remove();

  deleteRequest(
    `http://localhost:3000/api/todos/${userid}/${id}`,
    (response) => {
      console.log("Removed todo with the id:" + id);
    }
  );
}

function getRequest(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      callback(xmlhttp.responseText);
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send(null);
}

function postRequest(url, body, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", url, true);

  xmlhttp.onreadystatechange = function() {
    console.log("onready handler");
    if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
      callback(xmlhttp.responseText);
    }
  };
  console.log(body);

  xmlhttp.setRequestHeader("Content-Type", "application/json");

  xmlhttp.send(body);
}

function deleteRequest(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      callback(xmlhttp.responseText);
  };

  xmlhttp.open("DELETE", url, true);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlhttp.send(null);
}
