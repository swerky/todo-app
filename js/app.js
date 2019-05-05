/* HELPER - TARGET ANY DOM ELEMENT (jQuery style)
======================================================*/
//#region DOM HELPER FUNCTION
function $(elemStr, eventName, eventFunc) {


	if (eventName !== undefined && eventFunc !== undefined) {

		var domElements = document.querySelectorAll(elemStr);

		for (let i = 0; i < domElements.length; i++) {
			domElements[i].addEventListener(eventName, eventFunc);
		}

	}


	else {
		return document.querySelector(elemStr);;
	}

	
}
//Usage:
/*
$('.myclass', 'click', function() {
	console.log("TADA !");
});
*/
//console.log($('.filter'));
//$('.filter').classList.add("test"); //will add "test" ONLY on the first matched element

//#endregion



/* TODO LIST OBJECT
======================================================*/
//#region TODO LIST
var todoList = {


	/* TODO ARRAY (of objects)
	----------------------------------------------*/
	todos: [],


	/* ADD SAMPLE TODOs (ONLY IF EMPTY !)
	----------------------------------------------*/
	addSampleData: function () {

		//IF LIST IS EMPTY
		if (this.todos.length === 0) {

			this.todos = [
				{
					"todoText": 'First',
					"completed": false
				},
				{
					"todoText": 'Second',
					"completed": true
				},
				{
					"todoText": 'Third',
					"completed": false
				},
				{
					"todoText": 'Forth',
					"completed": false
				}
			];

			view.displayTodos();

		}

		//IF LIST IS NOT EMPTY (...and the button "Add Sample data" is visible)
		else {
			console.log("Cannot add data, Todo List is not empty it contains " + this.todos.length + " elements");
		}

	},


	/* ADD TODO
	----------------------------------------------*/
	addTodo: function (todoText) {
		this.todos.push({
			todoText: todoText,
			completed: false
		});
	},


	/* CHANGE TODO
	----------------------------------------------*/
	changeTodo: function (position, todoText) {
		this.todos[position].todoText = todoText;
	},


	/* DELETE TODO
	----------------------------------------------*/
	deleteTodo: function (position) {
		this.todos.splice(position, 1);
	},


	/* TOGGLE (ITEM) COMPLETED STATUS
	----------------------------------------------*/
	toggleCompleted: function (position) {
		var todo = this.todos[position]; //console.log(position);
		todo.completed = !todo.completed;
	},


	/* TOGGLE ALL TODOs COMPLETED STATUS
	----------------------------------------------*/
	toggleAll: function () {

		var totalTodos = this.todos.length;
		var completedTodos = 0;

		//Get the number of completed todos
		this.todos.forEach(function(todo) {
			if(todo.completed === true) {
				completedTodos++;
			}
		});

		//LOOP into todos
		this.todos.forEach(function(todo) {

			//If everything's true, make everything false.
			if(completedTodos === totalTodos) {
				todo.completed = false;
			}

			//Otherwise, make everything true.
			else {
				todo.completed = true;
			}

		});

	}


};
//#endregion



/* VIEW TODOs
======================================================*/
//#region VIEW
var view = {


	/* INIT - Do stuff (ONCE) when loading 
	----------------------------------------------*/
	init: function () {

		//Use data from localStorage ?
		if (storage.useStorage === true) {
			todoList.todos = storage.getData();
		}

		//Check if hash is present and apply filter
		utilities.filterToHashValue();

		//Attach events to chosen DOM elements
		this.setUpEventListeners();

		//Finally, display Todos !
		this.displayTodos();

	},


	/* DISPLAY TODOs
	----------------------------------------------*/
	displayTodos: function () {

		//debugger;

		//CALL TODOs UTILITIES
		utilities.checkStatus();

		//CREATE ITEMS
		this.createListItems();

	}, //END displayTodos


	/* CREATE LIST ITEMS
	----------------------------------------------*/
	createListItems: function () {

		//debugger;

		//LIST DOM ELEMENT
		const todoUl = document.querySelector('#todo-list');

		//TODO ARRAY
		const listTodos = todoList.todos;


		//BE SURE TO EMPTY THE LIST BEFORE ADDING ELEMENTS !
		todoUl.innerHTML = '';


		//LOOP into todos List
		for(let i = 0; i < listTodos.length; i++) {


			let todo = listTodos[i];


			//SKIP HERE DEPENDING ON FILTERS
			const currentFilter = utilities.currentFilter; //console.log(currentFilter);

			if(currentFilter !== 'all') {

				if(currentFilter === 'active' && todo.completed === true) {
					continue;
				}
				else if(currentFilter === 'completed' && todo.completed === false) {
					continue;
				}

			}


			//CREATE LI (FOR EACH TODOs ITEM)
			const ulLi = document.createElement('li');
			ulLi.setAttribute('id', 'item-' + i);
			ulLi.setAttribute('data-id', i);


			/* CREATE LI CONTENT
			---------------------------------------*/
			//#region LI content
			//DIV container
			const liDiv = document.createElement("div");
			liDiv.setAttribute('class', 'view');

			//INPUT - hidden, will show on DblClick
			const divInput = document.createElement("input");
			//divInput.setAttribute('id', 'toggle-' + i);
			divInput.setAttribute('class', 'toggle');
			divInput.setAttribute('type', 'checkbox');

			//LABEL
			const divLabel = document.createElement("label");
			//divLabel.setAttribute('for', 'toggle-' + i);
			divLabel.className = "item-label";
			divLabel.textContent = todo.todoText;

			//BUTTON delete/destroy
			const divButton = document.createElement("button");
			divButton.setAttribute('data-id', i);
			divButton.setAttribute('class', 'destroy');
			//#endregion


			/* COMPLETED CLASS AND CHECKED ATTRIBUTE
			---------------------------------------*/
			//#region completed and checked
			if (todo.completed === true) {
				ulLi.setAttribute('class', 'completed');
				divInput.setAttribute('checked', '');
			}
			else {
				ulLi.removeAttribute('class');
				divInput.removeAttribute('checked');
			}
			//#endregion


			/* APPEND ELEMENTS
			---------------------------------------*/
			//#region append
			todoUl.appendChild(ulLi);
			ulLi.appendChild(liDiv);
			liDiv.appendChild(divInput);
			liDiv.appendChild(divLabel);
			liDiv.appendChild(divButton);
			//#endregion


		} //End Loop


		/**
		 * LOOP forEach Method
		 * In Gordon's course you'll see this "forEach" method
		 * Not good in our case because we want to use "continue" to skip items
		 * forEach DO NOT WORK with "continue" and "break" statements
		*/
		/*
		listTodos.forEach(function(todo, index) {
			//the same code as above
		});
		*/


	}, //END createListItems


	/* EVENT LISTENERS
	----------------------------------------------*/
	setUpEventListeners: function () {


		/* DOM ELEMENTS TO "LISTEN"
		***************************************/
		const todosUl = document.querySelector('#todo-list');
		const newTodo = document.querySelector('#add-todo');
		const todosUtilities = document.querySelector('#utilities');


		/* LIST EVENTS
		***************************************/
		//CLICK EVENT
		todosUl.addEventListener('click', function (e) {

			//debugger;

			//GET CLICKED ELEMENT
			const clickedElem = e.target; //console.log('dataId from Event:', dataId);

			//GET DATA ID FROM PARENT LI
			const dataId = parseInt(clickedElem.closest("li").dataset.id); //console.log('Event dataId:', dataId);


			//IF CLIECKED ELEMENT IS DELETE BUTTON
			if(clickedElem.className === "destroy") {
				handlers.deleteTodo(dataId);
			}

			//IF CLIECKED ELEMENT IS TOGGLE INPUT
			if(clickedElem.className === "toggle") {
				handlers.toggleCompleted(dataId);
			}



		});


		//DBLCLICK EVENT
		todosUl.addEventListener('dblclick', function (e) {


			//REMOVE ALL EDIT INPUTS (if any)
			var editElement = document.querySelector('input.edit'); //console.log(editElement);

			if(editElement !== null) {
				editElement.parentNode.classList.remove("editing");
				editElement.remove();
			}

			//GET CLICKED ELEMENT
			const clickedElem = e.target; //console.log("dbclick on: ", clickedElem);

			// IF CLICKED ELEMENT IS A LABEL
			if(clickedElem.className === "item-label") {

				var closestLi = clickedElem.closest('li'); //variante: clickedElem.parentNode
				var labelText = clickedElem.textContent; //console.log(labelText);
				var dataId = parseInt(closestLi.dataset.id); //console.log(dataId);

				closestLi.classList.add('editing');


				//Create an Input to edit label...
				var inputEdit = document.createElement('input');
				inputEdit.className = 'edit'; //setAttribute() variante

				closestLi.appendChild(inputEdit);
				inputEdit.focus();
				inputEdit.value = labelText;


				//ON Input Keypress ENTER
				inputEdit.addEventListener('keypress', function (e) {

					var key = e.which || e.keyCode;

					if(key === 13) { // 13 is enter

						handlers.changeTodo(dataId, inputEdit.value);

						closestLi.classList.remove("editing");
						inputEdit.remove();

						//view.displayTodos(); //refresh the view of the list
					}

				}); //End inputEdit KEYPRESS

			} //End IF clickedElem

		});



		/* TOP INPUT (#add-todo) EVENTS
		***************************************/
		//KEYPRESS EVENT
		newTodo.addEventListener('keypress', function (e) {

			var key = e.which || e.keyCode;

			if (key === 13) { // 13 is enter

				const clickedElem = e.target; //console.log(clickedElem);
				handlers.addTodo(clickedElem);
			}

		});



		/* UTILITIES EVENTS
		***************************************/
		//CLICK EVENT
		todosUtilities.addEventListener('click', function (e) {

			// Get the element that was clicked on.
			const clickedElem = e.target; //console.log(clickedElem);

			// When clickedElem is a FILTER.
			if (clickedElem.classList.contains("filter")) {
				utilities.selectedOnFilter(clickedElem);
			}

			// When clickedElem is SAVE.
			if (clickedElem.id === "save-list") {
				storage.saveData();
			}

		});


	} //END setUpEventListeners


};
//#endregion



/* HANDLERS
======================================================*/
//#region HANDLERS
var handlers = {


	/* ADD TODO
	----------------------------------------------*/
	addTodo: function (inputElem) {
		todoList.addTodo(inputElem.value);
		inputElem.value = '';
		view.displayTodos();
	},


	/* CHANGE TODO
	----------------------------------------------*/
	changeTodo: function (position, value) {
		todoList.changeTodo(position, value);
		view.displayTodos();
	},


	/* DELETE TODO
	----------------------------------------------*/
	deleteTodo: function (position) {
		todoList.deleteTodo(position);
		view.displayTodos();
	},


	/* TOGGLE (ITEM) COMPLETED STATUS
	----------------------------------------------*/
	toggleCompleted: function (position) {
		todoList.toggleCompleted(position);
		view.displayTodos();
	},


	/* TOGGLE ALL TODOs COMPLETED STATUS
	----------------------------------------------*/
	toggleAll: function () {
		todoList.toggleAll();
		view.displayTodos();
	}


};
//#endregion



/* HANDLERS VARIANTE (manual input)
======================================================*/
//#region HANDLERS VARIANTE
var handlersVariante = {


	/* ADD TODO
	----------------------------------------------*/
	addTodo: function () {

		var addTodoTextInput = document.getElementById('addTodoTextInput');
		todoList.addTodo(addTodoTextInput.value);
		addTodoTextInput.value = '';

		view.displayTodos();

	},


	/* CHANGE TODO
	----------------------------------------------*/
	changeTodo: function () {

		var changeTodoPositionInput = document.getElementById('changeTodoPositionInput');
		var changeTodoTextInput = document.getElementById('changeTodoTextInput');
		todoList.changeTodo(changeTodoPositionInput.valueAsNumber, changeTodoTextInput.value);
		changeTodoPositionInput.value = "";
		changeTodoTextInput.value = '';

		view.displayTodos();

	},


	/* DELETE TODO
	----------------------------------------------*/
	deleteTodo: function (position) {

		var deleteTodoPositionInput = document.getElementById('deleteTodoPositionInput');
		todoList.deleteTodo(deleteTodoPositionInput.valueAsNumber);
		deleteTodoPositionInput.value = '';

		view.displayTodos();

	},


	/* TOGGLE (ITEM) COMPLETED STATUS
	----------------------------------------------*/
	toggleCompleted: function () {

		var toggleCompletedPositionInput = document.getElementById('toggleCompletedPositionInput');
		todoList.toggleCompleted(toggleCompletedPositionInput.valueAsNumber);
		toggleCompletedPositionInput = '';

		view.displayTodos();

	},


	/* TOGGLE ALL TODOs COMPLETED STATUS
	----------------------------------------------*/
	toggleAll: function () {

		todoList.toggleAll();
		view.displayTodos();

	}


};
//#endregion



/* TODOs UTILITIES
======================================================*/
//#region UTILITIES
var utilities = {


	/* CURRENT FILTER
	----------------------------------------------*/
	currentFilter: 'all',


	/* CHECK ITEMS STATUS
	----------------------------------------------*/
	checkStatus: function() {


		/* COMMON DOM ELEMENTS
		***********************************/
		const sampleDataLink = document.querySelector("#sample-data");


		/* IF LIST IS NOT EMPTY
		***********************************/
		if (todoList.todos.length > 0) {


			//DOM ELEMENTS
			const countCompleted = document.querySelector("#todo-count strong");
			const saveToStorageLink = document.querySelector("#save-list");


			//COUNT UNCOMPLETED ITEMS
			var uncompleted = 0;

			for (let i = 0; i < todoList.todos.length; i++) {
				let todo = todoList.todos[i];
				if (todo.completed === false) {
					uncompleted++;
				}
			}


			//DISPLAY UNCOMPLETED TEXT VALUE
			countCompleted.textContent = uncompleted;


			//CHANGE ITEMS TEXT IF uncompleted == 1 (items => item)
			if(uncompleted === 1) {
				$('#s').classList.add('hide');
			}
			else {
				$('#s').classList.remove('hide');
			}	


			//SHOW/HIDE FILTERS DEPENDING ON STATUS
			sampleDataLink.classList.add("hide");
			saveToStorageLink.classList.remove("hide");


		}


		/* IF LIST IS EMPTY
		***********************************/
		else {
			sampleDataLink.classList.remove("hide");
		}


	},


	/* SHOW ALL FILTER
	----------------------------------------------*/
	showAll: function() {
		this.currentFilter = 'all';
		view.displayTodos();
	},


	/* SHOW ACTIVE FILTER
	----------------------------------------------*/
	showActive: function() {
		this.currentFilter = 'active';
		view.displayTodos();
	},


	/* SHOW COMPLETED FILTER
	----------------------------------------------*/
	showCompleted: function() {
		this.currentFilter = 'completed';
		view.displayTodos();
	},


	/* SHOW COMPLETED FILTER
	----------------------------------------------*/
	filterToHashValue: function() {

		const hashValue = window.location.hash.substr(2); //remove 2 characters from begining of the hash

		//Don't bother with "all", is the default
		if (hashValue !== '' && hashValue !== 'all') {
			this.currentFilter = hashValue;
			this.selectedOnFilter(document.querySelector('#filter-' + hashValue));
		}

	},


	/* PUT SELECTED CLASS ON A FILTER
	----------------------------------------------*/
	selectedOnFilter: function(targetElem) {
		//Remove "selected" class on the active filter
		document.querySelector('a.selected').classList.remove('selected');

		//Put "selected" class on the target element (to be defined when calling the function)
		targetElem.classList.add('selected');
	}


};
//#endregion



/* TODOs LOCAL STORAGE
======================================================*/
//#region STORAGE
var storage = {


	//USE STORAGE - If you want to use storage when loading the window
	useStorage: true,


	// STORAGE ITEM NAME
	keyName: 'todosData',


	//GET STORAGE
	getData: function () {

		//debugger;
		const data = localStorage.getItem(this.keyName);

		if (data !== null && data !== undefined) {
			return JSON.parse(data);
		}

		return [];
	},


	//SET STORAGE
	saveData: function () {
		localStorage.setItem(this.keyName, JSON.stringify(todoList.todos));
	},


	//REMOVE STORAGE
	removeData: function () {
		localStorage.removeItem(this.keyName);
	},

}
//#endregion



//INIT THE VIEW OF THE APP
view.init();
