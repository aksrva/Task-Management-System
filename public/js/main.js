const status = ["todo", "doing", "done"];
const addBtn = document.querySelectorAll(".new-task");
const addForm = document.querySelectorAll(".add-task");
const editForm = document.querySelectorAll(".edit-task");
const taskForm = document.querySelectorAll("textarea[name='new-form'");
const taskTitle = document.querySelectorAll("input[name='title']");
const tasks = document.querySelectorAll(".tasks");
addBtn.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    addForm.forEach((form) => {
      form.style.display = "none";
    });
    addForm[idx].style.display = "block";
  });
});
const closeForm = document.querySelectorAll(".close-form");
closeForm.forEach((closebtn, idx) => {
  closebtn.addEventListener("click", () => {
    addForm[idx].style.display = "none";
  });
});
const closeEditForm = document.querySelectorAll(".edit-close-form");
closeEditForm.forEach((closebtn, idx) => {
  closebtn.addEventListener("click", () => {
    editForm[idx].style.display = "none";
  });
});

const submitForm = document.querySelectorAll(".submit-form");
submitForm.forEach((sbmtBtn, idx) => {
  sbmtBtn.addEventListener("click", () => {
    if (taskForm[idx].value === "") return;
    const request = new XMLHttpRequest();
    request.open("POST", "/", true);
    request.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
    request.send(
      `task=${taskTitle[idx].value}&task_description=${taskForm[idx].value}&status=${status[idx]}`
    );
    request.addEventListener("readystatechange", () => {
      if (request.status == 200 && request.readyState == 4) {
        const aTask = JSON.parse(request.response);
        updateUI([aTask], idx);
      } else if (request.status == 400 && request.readyState == 4) {
        alert("ERROR -> " + request.response);
      }
    });
  });
});

// Delete
const delTask = document.querySelectorAll(".task-del");

function deleteTask(delId, taskList) {
  const request = new XMLHttpRequest();
  request.open("DELETE", `${status[Number(taskList)]}/${delId}`, true);
  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  request.addEventListener("readystatechange", () => {
    if (request.status == 200 && request.readyState == 4) {
      const aTask = JSON.parse(request.response);
      updateUI(aTask, taskList);
    } else if (request.status == 400 && request.readyState == 4) {
      alert("ERROR -> " + request.response);
    }
  });
}

const updateUI = (utasks, tasklist) => {
  // utasks.forEach((task) => {
  //   tasks[
  //     tasklist
  //   ].innerHTML += `<div class="task" data-id="${task._id}" draggable="true">
  //   <p>${task.task}</p>
  //   <a
  //   class="task-del"
  //   href="javascript:void(0)"
  //   onclick="deleteTask('${task._id}', '${tasklist}')"
  //   >❌</a>
  //   <a href="javascript:void(0)" data-id="<%= task._id  %>">📝</a>
  //   </div>`;
  // });
  window.location.href = "/";
};

// draggable
const taskList = document.querySelectorAll(".task");
const todo = document.getElementById("todo");
const doing = document.getElementById("doing");
const done = document.getElementById("done");

taskList.forEach((task) => {
  task.addEventListener("dragstart", (e) => {
    let selected = e.target;
    doing.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    doing.addEventListener("drop", (e) => {
      updatedTaskStatus(doing, selected);
      selected = null;
    });
    done.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    done.addEventListener("drop", (e) => {
      updatedTaskStatus(done, selected);
      selected = null;
    });
    todo.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    todo.addEventListener("drop", (e) => {
      updatedTaskStatus(todo, selected);
      selected = null;
    });
  });
});

const updatedTaskStatus = (tasklist, selectedTask) => {
  const uStatus = tasklist.getAttribute("id");
  const taskId = selectedTask.getAttribute("data-id");

  const request = new XMLHttpRequest();
  request.open("PUT", `${uStatus}/${taskId}`, true);

  request.setRequestHeader("Content-Type", "application/json");
  request.send();
  tasklist.appendChild(selectedTask);
};

// update task
const updateTask = (taskId, tasktitle, taskDesc, idx) => {
  const editForm = document.querySelectorAll(".edit-task");
  const editTitle = document.querySelectorAll("input[name='edtitle']");
  const editDesc = document.querySelectorAll(".editDesc");
  editForm.forEach((form) => {
    form.style.display = "none";
  });
  editForm[idx].style.display = "block";
  editTitle[idx].value = tasktitle;
  editDesc[idx].value = taskDesc;

  const editBtn = document.querySelectorAll(".edit-form")[idx];
  editBtn.addEventListener("click", () => {
    const request = new XMLHttpRequest();
    request.open("PUT", `update/${taskId}/${editTitle[idx].value}/${editDesc[idx].value}`, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send();
    window.location.href = "/"
  });
};
