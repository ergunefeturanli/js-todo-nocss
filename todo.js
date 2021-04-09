// NON FEFACTORED VERSION OF TODO PROJECT 27.07.20

let todos = []

let filters = {
    searchText: '',
    searchCompleted: false
}

// Getting Todos from LocalStorage 'todos' key
const todoJSON = localStorage.getItem('todos')
if (todoJSON !== null) {
    todos = JSON.parse(todoJSON)
}


const renderTodos = function (todos, filters) {
    // Filtering Todos
    const filteredTodos = todos.filter(function (todo) {
        const matchedText = todo.text.toLowerCase().includes(filters.searchText.toLowerCase())
        const matchedCompleted = !filters.searchCompleted || !todo.completed
        return matchedText && matchedCompleted
    })

    const incompleteTodos = filteredTodos.filter(function (todo) {
        return !todo.completed
    })
    // Preventing repetitive todos
    document.querySelector('#todo-area').innerHTML = ''
    // Todo Summary
    const summary = document.createElement('h3')
    summary.textContent = `You have ${incompleteTodos.length} todos left!`
    document.querySelector('#todo-area').appendChild(summary)

    // Showing Filtering Todos
    filteredTodos.forEach(function (todo) {

        // Creating Todo Div that includes checkbox-text-button
        const todoEl = document.createElement('div')

        const checkBox = document.createElement('input')
        checkBox.setAttribute('type', 'checkbox')
        checkBox.checked = todo.completed //This line will fix checkbox eventlistener bug , if this not exist checkbox property would not change
        todoEl.appendChild(checkBox)        // even if would change (line:72)

        const p = document.createElement('span')
        p.textContent = todo.text
        todoEl.appendChild(p)

        const removeButton = document.createElement('button')
        removeButton.textContent = 'x'
        todoEl.appendChild(removeButton)


        document.querySelector('#todo-area').appendChild(todoEl)

        // Removing Todo
        let knownid = todo.id
        removeButton.addEventListener('click', function () {

            const todoIndex = todos.findIndex(function (todo) {
                return todo.id === knownid
            })

            if (todoIndex > -1) {
                todos.splice(todoIndex, 1)
            }
            localStorage.setItem('todos', JSON.stringify(todos))
            renderTodos(todos, filters)
        })

        //Checkbox that check todo if completed
        checkBox.addEventListener('change', function (e) {   //Line 41 fix the bug 
            todo.completed = e.target.checked
            localStorage.setItem('todos', JSON.stringify(todos))
            renderTodos(todos,filters)
        })
    })
}
renderTodos(todos, filters)

//Creating todo from text input with button and saving it to LocalStorage 'todos' key
document.querySelector('#create-todo').addEventListener('submit', function (e) {
    e.preventDefault()
    if (e.target.elements.text.value) {  //Falsy Values
        todos.push({
            text: e.target.elements.text.value,
            completed: false,
            id: uuidv4()
        })
        localStorage.setItem('todos', JSON.stringify(todos))
        renderTodos(todos, filters)
        e.target.elements.text.value = ''
    } else {
        window.alert('Please add a valid todo!')
    }
})

//Checkbox that hides completed todos
document.querySelector('#hide-completed').addEventListener('change', function (e) {
    filters.searchCompleted = e.target.checked
    renderTodos(todos, filters)
})
//Filter input that filter todos with text
document.querySelector('#filter-text').addEventListener('input', function (e) {
    filters.searchText = e.target.value
    renderTodos(todos, filters)
})
//Removing all todos from locas storage and todos array
document.querySelector('#remove-all').addEventListener('click', function (e) {
    localStorage.clear()
    location.reload()
    renderTodos(todos, filters)
})

