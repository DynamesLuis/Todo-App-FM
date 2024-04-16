const task_left = document.querySelector('.task-left');
const todo_input = document.querySelector('.add-todo-container>input');
const addBtn = document.querySelector('#add-todo');
const taskContainer = document.querySelector('.todo-list');
const clearBtn = document.querySelector('.counts-container button');
const actionsBtn = document.querySelectorAll('.actions-container button');
const activeBtn = document.querySelector('#Active');
const allBtn = document.querySelector('#All');
const completedBtn = document.querySelector('#Completed');
const themeBtn = document.querySelector('.switch-theme');

initEvents();
toggleCheckbox();

function initEvents() {
    addBtn.addEventListener('click', addTask);
    clearBtn.addEventListener('click', clearCompletedTask)
    task_left.textContent = `${getTasksLeft()} items left`;
    actionsBtn.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) {
                return
            } else {
                actionsBtn.forEach(btn => btn.classList.remove('active'));
                button.classList.toggle('active');
            }
        });
    });
    allBtn.addEventListener('click', showAllTask);
    activeBtn.addEventListener('click', showActiveTasks);
    completedBtn.addEventListener('click', showCompletedTasks);
    themeBtn.addEventListener('click', swithTheme);
    todo_input.addEventListener('input', toggleCheckbox);
}

function addTask() {
    const task = todo_input.value;
    if (task.trim()) {
        taskContainer.style.width = "";
        taskContainer.style.height = "";
        const taskElement = document.createElement('li');
        taskElement.innerHTML = `
            <label class="container-checkbox">
            <input type="checkbox">
            <span class="checkmark"></span>
          </label>
          <p>
            ${task}
          </p>
            `;

        taskContainer.appendChild(taskElement);
        task_left.textContent = `${getTasksLeft()} items left`;
        todo_input.value = "";
        setTimeout(() => addBtn.checked = false, 500)

        changeStatus(taskElement);
        dragElements();
    } else {
        addBtn.checked = false;
    }
}

function changeStatus(taskElement) {
    const checkbox = taskElement.querySelector('input[type="checkbox"]');

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }
        task_left.textContent = `${getTasksLeft()} items left`;
    });
}

function getTasksLeft() {
    return taskContainer.querySelectorAll('li:not(.completed)').length;
}

function clearCompletedTask() {
    const completedTask = document.querySelectorAll('li.completed');
    completedTask.forEach(task => taskContainer.removeChild(task));
}

function showActiveTasks() {
    const allTasks = document.querySelectorAll('li');
    allTasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.classList.add('hidden');
        } else {
            task.classList.remove('hidden')
        }
    });
}
function showCompletedTasks() {
    const allTasks = document.querySelectorAll('li');
    allTasks.forEach(task => {
        if (!task.classList.contains('completed')) {
            task.classList.add('hidden');
        } else {
            task.classList.remove('hidden')
        }
    });
}

function showAllTask() {
    const allTasks = document.querySelectorAll('li');
    allTasks.forEach(task => {
        task.classList.remove('hidden');
    });
}

function swithTheme() {
    const body = document.body;
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        themeBtn.classList.remove('light');
    } else {
        body.classList.add('light');
        themeBtn.classList.add('light');
    }
}

function toggleCheckbox() {
    if (todo_input.value.trim() === '') {
        addBtn.disabled = true;
    } else {
        addBtn.disabled = false;
    }
}

function dragElements() {
    let isDragging = false;
    let currentItem = null;
    let containerOffsetY = 0;
    let initY = 0;

    const taskContainer = document.querySelector('.todo-list');
    taskContainer.style.width = taskContainer.offsetWidth + "px";
    taskContainer.style.height = taskContainer.offsetHeight + "px";
    document.addEventListener('mousedown', e => {
        if (e.target.tagName === 'SPAN') {
            e.stopPropagation();
            return
        }

        const item = e.target.closest('li');
        if (item) {

            isDragging = true;
            currentItem = item;
            containerOffsetY = currentItem.offsetTop;
            currentItem.classList.add('dragging');
            currentItem.classList.add('item-animation')
            document.body.style.userSelect = "none";
            currentItem.style.top = containerOffsetY + 'px';
            initY = e.clientY;

        }
    });
    document.addEventListener('mousemove', e => {
        if (isDragging && currentItem) {
            currentItem.classList.remove('item-animation');
            let newTop = containerOffsetY - (initY - e.clientY);
            if (newTop < -50) {
                newTop = -50;
            } else if (newTop > taskContainer.offsetHeight - 30) {
                newTop = taskContainer.offsetHeight - 30;
            }
            currentItem.style.top = newTop + 'px';
            let itemsSiblings = [...document.querySelectorAll('li:not(.dragging)')];
            let nextItem = itemsSiblings.find(sibling => {
                return (e.clientY - taskContainer.getBoundingClientRect().top <= sibling.offsetTop + sibling.offsetHeight / 2)
            });
            itemsSiblings.forEach(item => {
                item.style.marginTop = "0";
            })
            if (nextItem) {
                nextItem.style.marginTop = currentItem.offsetHeight + 20 + "px";
            }
            taskContainer.insertBefore(currentItem, nextItem)
        }
    });
    document.addEventListener('mouseup', () => {
        if (currentItem) {
            currentItem.classList.remove('dragging');
            currentItem.style.top = 'auto';
            currentItem = null;
            isDragging = false;
            document.body.style.userSelect = "auto";
        }
        let itemsSiblings = [...document.querySelectorAll('li:not(.dragging)')];

        itemsSiblings.forEach(item => {
            item.style.marginTop = "0";
        })
        taskContainer.style.width = "";
        taskContainer.style.height = "";
    })
}

// corregir drag and drop


