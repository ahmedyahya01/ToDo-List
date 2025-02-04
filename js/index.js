"useStrict";
// ?============> Html Elements
let body = document.body;
let newTask = document.getElementById("newTask");
let modal = document.getElementById("modal");
let statusInput = document.getElementById("status");
let categoryInput = document.getElementById("category");
let titleInput = document.getElementById("title");
let descriptionInput = document.getElementById("description");
let addTaskBtn = document.getElementById("addTask");
let updateTaskBtn = document.getElementById("updateTask");
let barsBtn = document.getElementById("barsBtn");
let gridBtn = document.getElementById("gridBtn");
let containerOfTasks = document.querySelectorAll(".tasks");
let remainingCounterElement = document.getElementById("remainingCounter");
let nextUpCount = document.getElementById("nextUpCount");
let inProgressCount = document.getElementById("inProgressCount");
let doneCount = document.getElementById("doneCount");
let searchInput = document.getElementById("searchInput");
let modeBtn = document.getElementById("mode");
let rootElement = document.querySelector(":root");
let tasksContainers = {
  nextUp: document.getElementById("nextUp"),
  inProgress: document.getElementById("inProgress"),
  done: document.getElementById("done"),
};
// !============> App Variables
let arrayOfTasks = JSON.parse(localStorage.getItem("allTasks")) || [];
for (let i = 0; i < arrayOfTasks.length; i++) {
  displayTasks(i);
}
let updatedIndex = 0;
let titleRegex = /^[a-z0-9\s!#$%&'*+-/=?^_`{|}~.,@()<>]{3,30}$/i;
let descriptionRegex = /^[a-z0-9\s!#$%&'*+-/=?^_`{|}~.,@()<>]{5,100}$/i;
let remainingCounter = 100;

updateCounters();
// *============> Functions
function showModal() {
  modal.classList.replace("d-none", "d-flex");
  body.style.overflow = "hidden";
  window.scroll(0, 0);
}
function hideModal() {
  modal.classList.replace("d-flex", "d-none");
  clearInputs();
  addTaskBtn.classList.remove("d-none");
  updateTaskBtn.classList.add("d-none");
  body.style.overflow = "auto";
  titleInput.classList.remove("is-valid");
  descriptionInput.classList.remove("is-valid");
}
function addTask() {
  if (
    makeValidate(titleRegex, titleInput) &&
    makeValidate(descriptionRegex, descriptionInput)
  ) {
    let task = {
      status: statusInput.value,
      category: categoryInput.value,
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
    };
    arrayOfTasks.push(task);
    localStorage.setItem("allTasks", JSON.stringify(arrayOfTasks));
    displayTasks(arrayOfTasks.length - 1);
    hideModal();
    clearInputs();
  }
}
function displayTasks(index) {
  let task = arrayOfTasks[index];
  let theTask = `
        <div class="task" style="background-color: ${
          task.backgroundColor || "transparent"
        }">
            <h3 class="text-capitalize">${arrayOfTasks[index].title}</h3>
            <p class="description text-capitaliz">${
              arrayOfTasks[index].description
            }</p>
            <h4 class="category ${
              arrayOfTasks[index].category
            } text-capitalize">${arrayOfTasks[index].category}</h4>
            <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
                <li><i class="bi bi-pencil-square" onclick="getInfoToUpdate(${index})"></i></li>
                <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
                <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
            </ul>
        </div>
    `;
  tasksContainers[arrayOfTasks[index].status].innerHTML += theTask;
  updateCounters();
}
function emptyContainers() {
  for (const task in tasksContainers) {
    tasksContainers[task].innerHTML = "";
  }
}
function deleteTask(index) {
  emptyContainers();
  arrayOfTasks.splice(index, 1);
  localStorage.setItem("allTasks", JSON.stringify(arrayOfTasks));
  for (let i = 0; i < arrayOfTasks.length; i++) {
    displayTasks(i);
  }
  updateCounters();
}
function changeColor(e) {
  let r = Math.trunc(Math.random() * 255);
  let g = Math.trunc(Math.random() * 255);
  let b = Math.trunc(Math.random() * 255);
  let randomColor = `rgba(${r}, ${g}, ${b}, 25%)`;
  let taskElement = e.target.closest(".task");
  taskElement.style.backgroundColor = randomColor;

  let status = Object.keys(tasksContainers).find((key) =>
    tasksContainers[key].contains(taskElement)
  );
  let tasksInCurrentStatus = arrayOfTasks.filter(
    (task) => task.status === status
  );
  let taskIndex = Array.from(taskElement.parentNode.children).indexOf(
    taskElement
  );
  let globalIndex = arrayOfTasks.findIndex(
    (task) =>
      task.status === status &&
      task.title === tasksInCurrentStatus[taskIndex].title
  );
  if (globalIndex !== -1) {
    arrayOfTasks[globalIndex].backgroundColor = randomColor;
    localStorage.setItem("allTasks", JSON.stringify(arrayOfTasks));
  }
}
function getInfoToUpdate(index) {
  showModal();
  addTaskBtn.classList.add("d-none");
  updateTaskBtn.classList.remove("d-none");
  titleInput.value = arrayOfTasks[index].title;
  statusInput.value = arrayOfTasks[index].status;
  categoryInput.value = arrayOfTasks[index].category;
  descriptionInput.value = arrayOfTasks[index].description;
  updatedIndex = index;
}
function updateTask() {
  (arrayOfTasks[updatedIndex].title = titleInput.value),
    (arrayOfTasks[updatedIndex].status = statusInput.value),
    (arrayOfTasks[updatedIndex].category = categoryInput.value),
    (arrayOfTasks[updatedIndex].description = descriptionInput.value);
  localStorage.setItem("allTasks", JSON.stringify(arrayOfTasks));
  emptyContainers();
  for (let i = 0; i < arrayOfTasks.length; i++) {
    displayTasks(i);
  }
  hideModal();
  addTaskBtn.classList.remove("d-none");
  updateTaskBtn.classList.add("d-none");
}
function clearInputs() {
  statusInput.value = "nextUp";
  categoryInput.value = "education";
  titleInput.value = "";
  descriptionInput.value = "";
}
function changeDesignToBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");
  containerOfTasks.forEach((element) => {
    element.closest("section").classList.remove("col-md-6", "col-lg-4");
    element.setAttribute("data-view", "bars");
  });
}
function changeDesignToGrid() {
  gridBtn.classList.add("active");
  barsBtn.classList.remove("active");
  containerOfTasks.forEach((element) => {
    element.closest("section").classList.add("col-md-6", "col-lg-4");
    element.removeAttribute("data-view");
  });
}
function makeValidate(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.add("d-none");
    return true;
  } else {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    element.parentElement.nextElementSibling.classList.remove("d-none");
    return false;
  }
}
function updateCounters() {
  nextUpCount.textContent = tasksContainers.nextUp.childElementCount;
  inProgressCount.textContent = tasksContainers.inProgress.childElementCount;
  doneCount.textContent = tasksContainers.done.childElementCount;
}
function searchTask() {
  updateCounters();
  emptyContainers();
  let searchKey = searchInput.value;
  for (let i = 0; i < arrayOfTasks.length; i++) {
    if (
      arrayOfTasks[i].title.toLowerCase().includes(searchKey.toLowerCase()) ||
      arrayOfTasks[i].category.toLowerCase().includes(searchKey.toLowerCase())
    ) {
      displayTasks(i);
    }
  }
}
function changeMode() {
  if (modeBtn.classList.contains("bi-brightness-high-fill")) {
    modeBtn.classList.replace("bi-brightness-high-fill", "bi-moon-fill");
    rootElement.style.setProperty("--main-black", "#ffffff");
    rootElement.style.setProperty("--sec-black", "#f9fafb");
    rootElement.style.setProperty("--finance-color", "#2ecc71");
    rootElement.style.setProperty("--health-color", "#f39c12");
    rootElement.style.setProperty("--productivity-color", "#e74c3c");
    rootElement.style.setProperty("--education-color", "#3498db");
    rootElement.style.setProperty("--mid-gray", "#eaecef");
    rootElement.style.setProperty("--gray-color", "#d5d8dc");
    rootElement.style.setProperty("--text-color", "#2d3436");
  } else {
    modeBtn.classList.replace("bi-moon-fill", "bi-brightness-high-fill");
    rootElement.style.setProperty("--main-black", "#0d1117");
    rootElement.style.setProperty("--sec-black", "#161b22");
    rootElement.style.setProperty("--finance-color", "#30a277");
    rootElement.style.setProperty("--health-color", "#fb882e");
    rootElement.style.setProperty("--productivity-color", "#fc3637");
    rootElement.style.setProperty("--education-color", "#2e4acd");
    rootElement.style.setProperty("--mid-gray", "#474a4e");
    rootElement.style.setProperty("--gray-color", "#dadada");
    rootElement.style.setProperty("--text-color", "#a5a6a7");
  }
}

// ?============> Events
newTask.addEventListener("click", showModal);
// Hide Modal When Press On Escape;
document.addEventListener("keyup", function (e) {
  if (e.key === "Escape") {
    hideModal();
  }
});
// Hide Modal When Click Outside It;
modal.addEventListener("click", function (e) {
  if (e.target.id === "modal") {
    hideModal();
  }
});
// Push Every Task To The Array;
addTaskBtn.addEventListener("click", addTask);
// Update Task When Click On Update Button;
updateTaskBtn.addEventListener("click", updateTask);
// Change Design To Bars;
barsBtn.addEventListener("click", changeDesignToBars);
// Change Design To grid;
gridBtn.addEventListener("click", changeDesignToGrid);
// validate Inputs;
titleInput.addEventListener("input", function () {
  makeValidate(titleRegex, titleInput);
});
descriptionInput.addEventListener("input", function () {
  makeValidate(descriptionRegex, descriptionInput);
  remainingCounter = 100 - descriptionInput.value.split("").length;
  remainingCounterElement.innerHTML = remainingCounter;
});
// Search tasks;
searchInput.addEventListener("input", searchTask);
// Change Mode;
modeBtn.addEventListener("click", changeMode);
