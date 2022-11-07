"use strict"
let todoList = []; //declares a new array for Your todo list

let initList = function () {
    $.ajax({
        url: 'https://api.jsonbin.io/v3/b/634a8ddd65b57a31e69723fc/latest?meta=false',
        type: 'GET',

        success: (data) => {
            console.log(data)
            todoList = data;
            updateTodoList();
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

window.onload = initList;

let updateJSONbin = function () {
    $.ajax({
        url: 'https://api.jsonbin.io/v3/b/634a8ddd65b57a31e69723fc',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data)
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
}

let updateTodoList = function () {
    const todoListDiv = $("#tableDiv");
    const $table = $("#resultTable");

    //remove all elements
    $table.empty();
    todoListDiv.empty();
    // searchDiv.empty();

    //add table header
    let $thead = $('<thead></thead>');
    $thead.append('<tr><th>Title</th><th>Description</th><th>Place</th><th>Due Date</th><th>Actions</th></tr>');
    $table.append($thead);

    let filterInput = $('#inputSearch');
    const filterDateFrom = $("#filterDateFrom");
    const filterDateTo = $("#filterDateTo");

    let startTime = new Date(filterDateFrom.val());
    let endTime = new Date(filterDateTo.val());


    //add all elements
    let $tbody = $('<tbody></tbody>');
    for (let i = 0; i < todoList.length; i++) {
        let todo = todoList[i];
        let currentTime = new Date(todo.dueDate);

        if (
            ((filterInput.val() === "") ||
            (todo.title.includes(filterInput.val())) ||
            (todo.description.includes(filterInput.val()))) &&
            ((!filterDateFrom.val()) ||
            (!filterDateTo.val()) ||
            (currentTime > startTime && currentTime < endTime))
        ) {

            let $tr = $('<tr></tr>');
            $tr.append('<td>' + todo.title + '</td>');
            $tr.append('<td>' + todo.description + '</td>');
            $tr.append('<td>' + todo.place + '</td>');
            $tr.append('<td>' + new Date(todo.dueDate).toLocaleString() + '</td>');
            $tr.append('<td><button class="btn btn-outline-danger" onclick="deleteTodo(' + i + ')">Delete</button></td>');
            $tbody.append($tr);
        }

    }
    $table.append($tbody);
    $table.appendTo(todoListDiv);

}

let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONbin();
    updateTodoList();
}

let addTodo = function () {
    let inputTitle = $('#inputTitle');
    let inputDescription = $('#inputDescription');
    let inputPlace = $('#inputPlace');
    let inputDate = $('#inputDate');

    let newTitle = inputTitle.val();
    let newDescription = inputDescription.val();
    let newPlace = inputPlace.val();
    let newDate = new Date(inputDate.val());

    if (newTitle === undefined || newDescription === undefined ||
    newPlace === undefined || isNaN(newDate)) {
        window.alert("invalid input")
    } else {
        let newTodo = {
            title: newTitle,
            description: newDescription,
            place: newPlace,
            dueDate: newDate
        };
        todoList.push(newTodo);
    }

    updateJSONbin();
    updateTodoList();
}
