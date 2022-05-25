let root = 'http://localhost:9000';
let NEW = "NEW";
let DONE = "DONE";
let EMPTYBOX = "🗸";
let TICKEDBOX = "\u2713";

function addNewTodoItem() {
    let todoValue = document.getElementById("newItemDescription").value.trim();
    if (todoValue === "") {
        alert("Please enter a value for your item");
    } else {
        createTodoItem(todoValue);
        document.getElementById("newItemDescription").value = "";
    }
}

function createTodoItem(listItemDescription) {
    const newItem = {
        "description": listItemDescription,
        "status": NEW
    };
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newItem)
    };
    fetch(root +'/notes', requestOptions)
        .then((response) => {
            if (!response.ok) {
                alert("An error has occurred.  Unable to create the TODO item")
                throw response.status;
            } else return response.json();
        })
        .then(item => addTodoItemToDisplay(item));
}

function readTodoItems() {
    clearTodos();
    fetch(root + '/notes')
        .then((response) => {
            if (!response.ok) {
                alert("An error has occurred.  Unable to read the TODO list")
                throw response.status;
            } else return response.json();
        })
        .then(items => items.map((item, index) => addTodoItemToDisplay(item, index)));
}

function addTodoItemToDisplay(item, index) {
    let todoItemNode = document.createElement("li");
    createListItems(todoItemNode, index);
    addTickboxOption(todoItemNode, index);
    addDescription(todoItemNode, item, index);
    addRemoveOption(todoItemNode, item);
    flipStatusIcon(item, todoItemNode, index);
}



function createListItems(todoItemNode, index){
    todoItemNode.id = "listItem:" + index;
    document.getElementById("todoList").appendChild(todoItemNode);
}

function addDescription(todoItemNode, item, index){
    let descriptionSpanNode = document.createElement("SPAN");
    let descriptionTextNode = document.createTextNode(item["description"]);
    descriptionSpanNode.className = "listItemDescription";
    descriptionSpanNode.appendChild(descriptionTextNode);
    descriptionSpanNode.id = "listItemDescription" + index;
    todoItemNode.appendChild(descriptionSpanNode);
}

function addTickboxOption(todoItemNode, index){
    let tickSpanNode = document.createElement("SPAN");
    let tickText = document.createTextNode(EMPTYBOX);
    tickSpanNode.className = "tickIconStyle";
    tickSpanNode.appendChild(tickText);
    tickSpanNode.id = "tick" + index;
    todoItemNode.appendChild(tickSpanNode);
}

function addRemoveOption(todoItemNode, item){
    let closeSpanNode = document.createElement("SPAN");
    let closeText = document.createTextNode("X");
    closeSpanNode.className = "closeIconStyle";
    closeSpanNode.appendChild(closeText);
    todoItemNode.appendChild(closeSpanNode);
    removeTodoItem(closeSpanNode, todoItemNode, item);
}

function removeTodoItem(closeSpanNode, todoItemNode, item){
    closeSpanNode.onclick = function (event) {
        event.stopPropagation();
        if (confirm("Are you sure that you want to delete " + item.description + "?")) {
            deleteTodoItem(item["id"]);
            todoItemNode.remove();
        }
    }
}

function flipStatusIcon(item, itemNode, index){
    let CHECKED = "checked";
    let STATUS = "status";
    let tickElement = document.getElementById("tick" + index);
    itemNode.onclick = function () {
        console.log(item);
        if (item[STATUS] === NEW) {
            item[STATUS] = DONE
            itemNode.classList.toggle(CHECKED);
            tickElement.textContent = TICKEDBOX;
        } else {
            item[STATUS] = NEW
            itemNode.classList.toggle(CHECKED);
            tickElement.textContent = EMPTYBOX;
        }
        updateTodoItem(item["id"], item);
    }
    if (item.status === DONE) {
        itemNode.classList.toggle(CHECKED);
        tickElement.textContent = TICKEDBOX;
    }
}

function updateTodoItem(todoItemId, item) {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(item)
    };
    fetch(root + '/notes/' + todoItemId, requestOptions)
        .then((response) => {
            if (!response.ok) {
                alert("An error has occurred.  Unable to UPDATE the TODO item")
                throw response.status;
            } else return response.json();
        })
}

function deleteTodoItem(todoItemId) {
    fetch(root + '/notes/' + todoItemId, {method: 'DELETE'})
        .then((response) => {
            if (!response.ok) {
                alert("An error has occurred.  Unable to DELETE the TODO item")
                throw response.status;
            } else return response.json();
        })
}

function searchTodos() {
    let todoValue = document.getElementById("todoSearch").value.trim();
    if (todoValue === "") {
        readTodoItems();
    }
    clearTodos();
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    fetch(root + '/notes/searchByKey/' + todoValue, requestOptions)
        .then((response) => {
            if (!response.ok) {
                location.reload();
            } else return response.json();
        })
        .then(items => items.map((item, index) => addTodoItemToDisplay(item, index)));
}

function clearTodos() {
    let todoListElement = document.getElementById("todoList");
    todoListElement.innerHTML = "";
}

function getTodosByStatus(status) {
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    fetch(root + '/notes/searchByStatus/' + status, requestOptions)
        .then((response) => {
            if (!response.ok) {
                location.reload();
            } else return response.json();
        })
        .then(items => items.map((item, index) => addTodoItemToDisplay(item, index)));
}