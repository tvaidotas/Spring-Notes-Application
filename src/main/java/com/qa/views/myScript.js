let root = 'http://localhost:9000';
let NEW = "NEW";
let DONE = "DONE";
let EMPTYBOX = "🗸";
let TICKEDBOX = "\u2713";
let CHECKED = "checked";
let STATUS = "status";
let listOfNotes = [];

function readTodoItems() {
    clearTodos();
    fetch(root + '/notes')
        .then((response) => {
            if (!response.ok) {
                alert("An error has occurred.  Unable to read the TODO list")
                throw response.status;
            } else return response.json();
        })
        .then(displayFetchedItems());
}

function searchTodos() {
    let newTodoItem = document.getElementById("todoSearch").value.trim();
    if (newTodoItem === "") {
        readTodoItems();
    }
    clearTodos();
    const requestOptions = {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    };
    fetch(root + '/notes/searchByKey/' + newTodoItem, requestOptions)
        .then((response) => {
            if (!response.ok) {
                location.reload();
            } else return response.json();
        })
        .then(displayFetchedItems());
}

function displayFetchedItems() {
    return items => {
        listOfNotes = items;
        items.forEach((item, index) => renderTodoItem(item, index));
    };
}

function clearTodos() {
    let todoListElement = document.getElementById("todoList");
    todoListElement.innerHTML = "";
}

function addNewTodoItem() {
    let newTodoItem = document.getElementById("newItemDescription").value.trim();
    if (newTodoItem === "") {
        alert("Please enter a value for your item");
    } else {
        createTodoItem(newTodoItem);
        // Reset newTodoItem field
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
                alert("An error has occurred. Unable to create the TODO item")
                throw response.status;
            } else return response.json();
        })
        .then(item => {
            let index = listOfNotes.length;
            renderTodoItem(item, index);
            listOfNotes.push(item);
        });
}

function renderTodoItem(item, index) {
    let todoItemNode = document.createElement("li");
    
    addTickboxOption(todoItemNode, item, index);
    addDescription(todoItemNode, item, index);
    addRemoveOption(todoItemNode, item);
    addTodoItemNodeToTodoList(todoItemNode, index);
}

function addTickboxOption(todoItemNode, item, index){
    let tickSpanNode = document.createElement("SPAN");
    var tickText = document.createTextNode(EMPTYBOX);
    if (item.status === DONE) {
        todoItemNode.classList.toggle(CHECKED);
        tickText = document.createTextNode(TICKEDBOX);
    }
    tickSpanNode.className = "tickIconStyle";
    tickSpanNode.appendChild(tickText);
    tickSpanNode.id = "tick" + index;
    todoItemNode.onclick = function () {
        onTodoItemClicked(todoItemNode, tickSpanNode, item);
    }
    todoItemNode.appendChild(tickSpanNode);
}

function onTodoItemClicked(todoItemNode, tickSpanNode, item) {
    if (item[STATUS] === NEW) {
        item[STATUS] = DONE;
        todoItemNode.classList.toggle(CHECKED);
        tickSpanNode.textContent = TICKEDBOX;
    } else {
        item[STATUS] = NEW;
        todoItemNode.classList.toggle(CHECKED);
        tickSpanNode.textContent = EMPTYBOX;
    }
    updateTodoItem(item["id"], item);
}

function addDescription(todoItemNode, item, index){
    let descriptionSpanNode = document.createElement("SPAN");
    let descriptionTextNode = document.createTextNode(item["description"]);
    descriptionSpanNode.className = "listItemDescription";
    descriptionSpanNode.appendChild(descriptionTextNode);
    descriptionSpanNode.id = "listItemDescription" + index;
    todoItemNode.appendChild(descriptionSpanNode);
}

function addRemoveOption(todoItemNode, item){
    let closeSpanNode = document.createElement("SPAN");
    let closeText = document.createTextNode("X");
    closeSpanNode.className = "closeIconStyle";
    closeSpanNode.appendChild(closeText);
    todoItemNode.appendChild(closeSpanNode);
    
    closeSpanNode.onclick = function (event) {
        onRemoveItemClicked(event, todoItemNode, item);
    }
}

function addTodoItemNodeToTodoList(todoItemNode, index){
    todoItemNode.id = "listItem:" + index;
    document.getElementById("todoList").appendChild(todoItemNode);
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

function onRemoveItemClicked(event, todoItemNode, item){
    // stopPropagation() prevents events from bubbling up to parent elements
    event.stopPropagation();
    if (confirm("Are you sure that you want to delete " + item.description + "?")) {
        deleteTodoItem(item["id"]);
        todoItemNode.remove();
    }
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