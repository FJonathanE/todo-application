const userid = "6b2b5953-9a70-4eae-b5da-a41776d39420";

window.addEventListener("load", (event) => {
  console.log("Window loaded...");

  var todos = [];

  getRequest(`http://localhost:3000/api/todos/${userid}`, (responseText) => {
    console.log(responseText);
    console.log(JSON.parse(responseText).todos);

    todos = JSON.parse(responseText).todos.split("|");

    for (i = 0; i < todos.length; i++) {
      console.log(id + " " + todo);

      var id = todos[i].split(";")[0];
      var todo = todos[i].split(";")[1];

      addTodoManual(id, todo);
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
  if (document.getElementById("text-input").value == "") {
    return;
  }

  getRequest("http://localhost:3000/api/randomuuid", (response) => {
    addTodoManual(response, document.getElementById("text-input").value);
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

  console.log("Removed todo with the id:" + id);
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
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      callback(xmlhttp.responseText);
  };

  xmlhttp.open("POST", url, true);
  xmlhttp.send(body);
}

function deleteRequest(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
      callback(xmlhttp.responseText);
  };

  xmlhttp.open("DELETE", url, true);
  xmlhttp.send(null);
}
