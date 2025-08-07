const form = document.getElementById("crud-form");
const tableBody = document.querySelector("tbody");
let editingId = null;

function loadData() {
  fetch("/api/users")
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = "";
      data.forEach(user => {
        const row = `<tr>
          <td>${user.name}</td>
          <td>${user.age}</td>
          <td>
            <button onclick="editUser('${user.id}', '${user.name}', ${user.age})">Edit</button>
            <button onclick="deleteUser('${user.id}')">Delete</button>
          </td>
        </tr>`;
        tableBody.innerHTML += row;
      });
    });
}

function editUser(id, name, age) {
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;
  editingId = id;
  document.getElementById("submit-btn").textContent = "Update";
}

function deleteUser(id) {
  fetch(`/api/users/${id}`, { method: "DELETE" })
    .then(loadData);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value);
  const data = { name, age };
  const btn = document.getElementById("submit-btn");

  if (editingId) {
    fetch(`/api/users/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      editingId = null;
      btn.textContent = "Add";
      form.reset();
      loadData();
    });
  } else {
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(() => {
      form.reset();
      loadData();
    });
  }
});

loadData();
