// ---------- 1. Grab the elements from the page ----------
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");
const counter = document.getElementById("counter");
const clearBtn = document.getElementById("clearBtn");
const filters = document.getElementById("filters");
document.getElementById("today").textContent = new Date().toDateString();

// ---------- 2. Load saved tasks (or start with an empty list) ----------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks in the browser so they are still there after a refresh
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- 3. Draw the tasks on the page ----------
function render() {
  list.innerHTML = "";

  // Decide which tasks to show based on the selected filter
  const visible = tasks.filter((task) => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "completed") return task.done;
    return true;
  });

  visible.forEach((task) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    // Checkbox to mark a task as done
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = task.done;
    box.addEventListener("change", () => toggleTask(task.id));

    // Task text (textContent keeps user input safe)
    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;

    // Delete button
    const del = document.createElement("button");
    del.className = "delete";
    del.innerHTML = "&times;";
    del.setAttribute("aria-label", "Delete task");
    del.addEventListener("click", () => deleteTask(task.id));

    li.append(box, text, del);
    list.appendChild(li);
  });

  // Show the "no tasks" message when the list is empty
  emptyMsg.style.display = visible.length === 0 ? "block" : "none";

  // Update the counter
  const left = tasks.filter((task) => !task.done).length;
  counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}

// ---------- 4. The actions ----------
function addTask(text) {
  tasks.push({ id: Date.now(), text: text, done: false });
  save();
  render();
}

function toggleTask(id) {
  tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  save();
  render();
}

// ---------- 5. Listen for what the user does ----------
form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading
  const text = input.value.trim();
  if (text === "") return;
  addTask(text);
  input.value = "";
  input.focus();
});

filters.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") return;
  currentFilter = event.target.dataset.filter;
  filters.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  event.target.classList.add("active");
  render();
});

clearBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.done);
  save();
  render();
});

// Show everything when the page first loads
render();
