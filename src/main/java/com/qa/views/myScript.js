let root = 'http://localhost:9000';
let NEW = "NEW";
let DONE = "DONE";
let EMPTYBOX = "🗸";
let TICKEDBOX = "\u2713";

function addNewTodoItem() {
    let todoValue = document.getElementById("newTodoDescription").value.trim();
    if (todoValue === "") {
        alert("Please enter a value for your item");
    } else {
        createTodoItem(todoValue);
        document.getElementById("newTodoDescription").value = "";
    }
}

function createTodoItem(todoItemDescription) {
    const newItem = {
        "description": todoItemDescription,
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
    createListItems(todoItemNode, item, index);
    addTickboxOption(todoItemNode, index);
    addRemoveOption(todoItemNode, item);
    flipStatusIcon(item, todoItemNode, index);
}

function createListItems(todoItemNode, item, index){
    let descriptionTextNode = document.createTextNode(item["description"]);
    todoItemNode.id = "tickListItem:" + index;
    todoItemNode.appendChild(descriptionTextNode);
    document.getElementById("todoList").appendChild(todoItemNode);
}

function addTickboxOption(todoItemNode, index){
    let tickSpanNode = document.createElement("SPAN");
    let tickText = document.createTextNode(EMPTYBOX);
    tickSpanNode.classList.toggle("tickVisible");
    tickSpanNode.appendChild(tickText);
    tickSpanNode.id = "tick" + index;
    todoItemNode.appendChild(tickSpanNode);
}

function addRemoveOption(todoItemNode, item){
    let closeSpanNode = document.createElement("SPAN");
    let closeText = document.createTextNode("X");
    closeSpanNode.className = "close";
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
    let todoValue = document.getElementById("newTodoSearch").value.trim();
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

function searchTodayTodos() {
    clearTodos();
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    fetch(root + '/notes/searchByToday', requestOptions)
        .then((response) => {
            if (!response.ok) {
                location.reload();
            } else return response.json();
        })
        .then(items => items.map((item, index) => addTodoItemToDisplay(item, index)));
}

function sortCompletedItems() {
    let element = document.getElementById("completedDropdown");
    if (element.textContent === EMPTYBOX) {
        element.textContent = TICKEDBOX;
        clearTodos();
        getTodosByStatus(DONE);
    } else {
        element.textContent = EMPTYBOX;
        readTodoItems();
    }
}

function sortTodoItems() {
    let element = document.getElementById("todoDropdown");
    if (element.textContent === EMPTYBOX) {
        element.textContent = TICKEDBOX;
        clearTodos();
        getTodosByStatus(NEW);
    } else {
        element.textContent = EMPTYBOX;
        readTodoItems();
    }
}

function sortTodayItems() {
    let element = document.getElementById("todayDropdown");
    if (element.textContent === EMPTYBOX) {
        element.textContent = TICKEDBOX;
        searchTodayTodos();
    } else {
        element.textContent = EMPTYBOX;
        readTodoItems();
    }
}

function clearTodos2() {
    let mainContainerElement = document.getElementById("mainContainer");

    document.getElementById("todoList").remove();
    let unorderedList = document.createElement("ul");
    unorderedList.id = "todoList";
    mainContainerElement.append(unorderedList);
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