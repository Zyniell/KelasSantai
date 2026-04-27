// DATA & INITIALIZATION
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
let filterAktif = "semua";

// Fitur Counter (Menu 2) - Inisialisasi dari LocalStorage
let counterValue = parseInt(localStorage.getItem("counterAppValue")) || 0;

// Fitur Artikel (Menu 1) - State
let postLimit = 10;

// NAVBAR LOGIC
function showPage(pageId) {
  // Sembunyikan semua halaman
  document.querySelectorAll(".page-content").forEach(page => page.style.display = "none");
  // Tampilkan halaman terpilih
  document.getElementById(pageId).style.display = "block";
  
  // Update UI Navbar
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === pageId);
  });

  // Re-render konten spesifik jika perlu
  if (pageId === "todo-page") render();
  if (pageId === "counter-page") updateCounterUI();
}

// === MENU 1: FETCH ARTIKEL ===
async function fetchPosts() {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${postLimit}`);
    const data = await res.json();
    const container = document.getElementById("articleContainer");
    
    container.innerHTML = data.map(post => `
      <div class="article-card">
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      </div>
    `).join("");
  } catch (err) {
    console.error("Gagal memuat artikel", err);
  }
}

function muatLebihBanyak() {
  postLimit += 10;
  fetchPosts();
}

// === MENU 2: COUNTER LOGIC ===
function updateCounterValue(val) {
  if (val === 'reset') counterValue = 0;
  else counterValue += val;
  
  localStorage.setItem("counterAppValue", counterValue);
  updateCounterUI();
}

function updateCounterUI() {
  const el = document.getElementById("numberDisplay");
  el.textContent = counterValue;
  
  el.className = ""; // Reset class
  if (counterValue > 0) el.classList.add("text-green");
  else if (counterValue < 0) el.classList.add("text-red");
}

// === MENU 3: GITHUB SEARCH ===
async function searchGithub() {
  const username = document.getElementById("githubInput").value;
  const resultDiv = document.getElementById("githubResult");
  if (!username) return;

  resultDiv.innerHTML = "<p>Mencari...</p>";

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) throw new Error("User tidak ditemukan");
    const user = await res.json();

    resultDiv.innerHTML = `
      <div class="github-profile">
        <img src="${user.avatar_url}" alt="Avatar">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || "Tidak ada bio"}</p>
        <div class="github-stats">
          <span>📦 Repos: ${user.public_repos}</span>
          <span>👥 Followers: ${user.followers}</span>
        </div>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color:red">${err.message}</p>`;
  }
}

// === TODO LIST LOGIC (EXISTING) ===
function tambahTask() {
  const input = document.querySelector("#inputTask");
  const prioritasSelect = document.querySelector("#selectPrioritas");
  const teks = input.value.trim();
  if (teks === "") return; 
  
  tasks.push({ 
    id: nextId++, 
    teks, 
    selesai: false,
    prioritas: prioritasSelect.value
  });
  simpan();
  render();
  input.value = "";
}

function toggleSelesai(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.selesai = !task.selesai;
  simpan();
  render();
}

function editTask(id, element) {
  const task = tasks.find(t => t.id === id);
  const inputEdit = document.createElement("input");
  inputEdit.className = "input-edit";
  inputEdit.value = task.teks;
  element.replaceWith(inputEdit);
  inputEdit.focus();

  const simpanEdit = () => {
    const teksBaru = inputEdit.value.trim();
    if (teksBaru !== "") task.teks = teksBaru;
    simpan();
    render();
  };
  inputEdit.onblur = simpanEdit;
  inputEdit.onkeydown = (e) => { if (e.key === "Enter") simpanEdit(); };
}

function selesaikanSemua() {
  tasks.forEach(t => t.selesai = true);
  simpan();
  render();
}

function hapusTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  simpan();
  render();
}

function simpan() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  let tampil = tasks;
  if (filterAktif === "aktif") tampil = tasks.filter(t => !t.selesai);
  if (filterAktif === "selesai") tampil = tasks.filter(t => t.selesai);

  const list = document.querySelector("#listTask");
  const counterEl = document.querySelector("#counter");
  if (!list) return;

  const belumSelesai = tasks.filter(t => !t.selesai).length;
  counterEl.textContent = `${belumSelesai} task tersisa`;

  if (tampil.length === 0) {
    list.innerHTML = `<li class="kosong">Tidak ada task 🎉</li>`;
    return;
  }

  list.innerHTML = tampil.map(task => `
    <li class="task-item ${task.selesai ? "selesai" : ""} ${task.prioritas}">
      <span onclick="toggleSelesai(${task.id})" ondblclick="event.stopPropagation(); editTask(${task.id}, this)">
        ${task.teks}
      </span>
      <button onclick="hapusTask(${task.id})">🗑️</button>
    </li>
  `).join("");
}

// EVENT LISTENERS & INITIAL LOAD
document.addEventListener("DOMContentLoaded", () => {
  // Navigasi
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => showPage(link.dataset.page));
  });

  // Todo Listeners
  document.querySelector("#tombolTambah").addEventListener("click", tambahTask);
  document.querySelector("#selesaikanSemua").addEventListener("click", selesaikanSemua);
  document.querySelector("#inputTask").addEventListener("keydown", e => { if (e.key === "Enter") tambahTask(); });
  document.querySelectorAll(".btn-filter").forEach(btn => {
    btn.addEventListener("click", () => {
      filterAktif = btn.dataset.filter;
      document.querySelectorAll(".btn-filter").forEach(b => b.classList.toggle("aktif", b === btn));
      render();
    });
  });

  // Github Listener
  document.querySelector("#btnSearchGithub").addEventListener("click", searchGithub);

  // Initial Fetching
  render();
  fetchPosts();
  updateCounterUI();
});