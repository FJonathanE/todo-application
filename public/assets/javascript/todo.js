window.addEventListener('load', (event) => {
    console.log('Window loaded...')
});

document.addEventListener('readystatechange', (event) => {
    console.log(`readystate: ${document.readyState}`);
});

/*document.getElementById('text-input').addEventListener('onkeypress', (event) => {
    if (event.keyCode === 13){
        event.preventDefault();

        addTodo();
    }
});*/

function enterPress(event) {
    if (event.keyCode === 13){
        event.preventDefault();

        addTodo();
    }
}

function addTodo(){
    if (document.getElementById('text-input').value == ''){
        return;
    }

    get('http://localhost:3000/api/randomuuid', (response) => {
        addTodoManual(response, document.getElementById('text-input').value);
        document.getElementById('text-input').value = '';
    });
}

function addTodoManual(id, inputtext){

    var todoList = document.getElementById('todo-list');

    var todo = document.createElement('div');
    todo.setAttribute('id', 'todo ' + id);
    todo.setAttribute('class', 'todo-box');

    var text = document.createTextNode(inputtext);
    var field = document.createElement('p');
    field.setAttribute('class', 'todo-text');

    var buttonText = document.createTextNode('Remove');
    var button = document.createElement('button');
    button.setAttribute('class', 'remove-todo');
    button.setAttribute('onclick', `removeFromTodo("${id}");`);
    button.appendChild(buttonText);


    field.appendChild(text);
    todo.appendChild(field);
    todo.appendChild(button);
    todoList.appendChild(todo);

    console.log('Added todo with the id: ' + id);
}

function removeFromTodo(id){
    var todo = document.getElementById('todo ' + id);
    todo.remove();

    console.log('Removed todo with the id:' + id);
}


function get(url, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            callback(xmlhttp.responseText);
        
    }
        xmlhttp.open('GET', url, true);
        xmlhttp.send(null);
        
    
}



