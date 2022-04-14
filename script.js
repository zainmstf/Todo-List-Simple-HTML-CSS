const taskInput = document.querySelector(".task-input input");
const taskBox = document.querySelector(".task-box");
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
let todos = JSON.parse(localStorage.getItem("todo-list"));
let editId;
let isEditedTask = false;

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let isComplete = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `
        <li class="task">
          <label for="${id}">
            <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isComplete}/>
            <p class="${isComplete}">${todo.name}</p>
          </label>
          <div class="settings">
            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
            <ul class="task-menu">
              <li onclick="editTask(${id},'${todo.name}')">
                <i class="uil uil-pen"></i>Edit
              </li>
              <li onclick="deleteTask(${id})">
                <i class="uil uil-trash"></i>Delete
              </li>
            </ul>
          </div>
        </li>`;
      }
    });
  }
  taskBox.innerHTML = li || '<span>"Kamu belum mempunyai tugas"</span>';
}
showTodo("all");

function showMenu(selectedTask) {
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != selectedTask) {
      taskMenu.classList.remove("show");
    }
  });
}

function deleteTask(taskId) {
  todos.splice(taskId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
}
function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  showTodo("all");
}
clearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});
function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditedTask) {
      if (!todos) {
        todos = [];
      }
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
      document.querySelector(".filters span.active").classList.remove("active");
      document.querySelector("#all").classList.add("active");
    } else {
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});
