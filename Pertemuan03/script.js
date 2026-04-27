// --- NAVIGASI HALAMAN ---
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

// --- FITUR 1: KALKULATOR (DENGAN RIWAYAT) ---
let riwayatPerhitungan = [];
function hitung() {
  let a = Number(document.getElementById('angka1').value);
  let b = Number(document.getElementById('angka2').value);
  let op = document.getElementById('operasi').value;
  let resEl = document.getElementById('hasil');

  let hasil;
  switch (op) {
    case '+': hasil = a + b; break;
    case '-': hasil = a - b; break;
    case '*': hasil = a * b; break;
    case '/': hasil = b === 0 ? 'Error' : a / b; break;
    case '%': hasil = b === 0 ? 'Error' : a % b; break;
  }

  let teks = `${a} ${op} ${b} = ${hasil}`;
  resEl.innerHTML = teks;
  resEl.className = 'hasil sukses';

  if (hasil !== 'Error') {
    riwayatPerhitungan.unshift(teks);
    if (riwayatPerhitungan.length > 3) riwayatPerhitungan.pop();
    document.getElementById('list-riwayat').innerHTML = 
      riwayatPerhitungan.map(i => `<li>${i}</li>`).join('');
  }
}

function hapus() {
  document.getElementById('angka1').value = '';
  document.getElementById('angka2').value = '';
  document.getElementById('hasil').innerHTML = '';
}

// --- FITUR 2: KONVERSI SUHU ---
function toFahrenheit(c) { return (c * 9/5) + 32; }
function toKelvin(c) { return c + 273.15; }
function toReamur(c) { return c * 4/5; }

function konversiSemua() {
  let c = parseFloat(document.getElementById('inputCelsius').value);
  if (isNaN(c)) return;
  document.getElementById('resF').innerText = toFahrenheit(c).toFixed(2) + " °F";
  document.getElementById('resK').innerText = toKelvin(c).toFixed(2) + " K";
  document.getElementById('resR').innerText = toReamur(c).toFixed(2) + " °R";
}

// --- FITUR 3: FIZZBUZZ ---
function jalankanFizzBuzz() {
  const container = document.getElementById('container-fizz');
  container.innerHTML = "";
  for (let i = 1; i <= 100; i++) {
    let output = "";
    let kelas = "";
    if (i % 15 === 0) { output = "FizzBuzz"; kelas = "fizzbuzz"; }
    else if (i % 3 === 0) { output = "Fizz"; kelas = "fizz"; }
    else if (i % 5 === 0) { output = "Buzz"; kelas = "buzz"; }
    else { output = i; }
    
    container.innerHTML += `<span class="${kelas}">${output}</span>`;
  }
}

// --- FITUR 4: TEBAK ANGKA ---
let angkaRahasia = Math.floor(Math.random() * 100) + 1;
let jumlahTebakan = 0;

function cekTebakan() {
  let tebakan = parseInt(document.getElementById('tebakanUser').value);
  let pesan = document.getElementById('pesanTebak');
  jumlahTebakan++;

  if (tebakan === angkaRahasia) {
    pesan.innerHTML = `🎉 BENAR! Angkanya adalah ${angkaRahasia}`;
    pesan.className = "hasil sukses";
    document.getElementById('infoTebak').innerText = `Total percobaan: ${jumlahTebakan}`;
  } else if (tebakan > angkaRahasia) {
    pesan.innerHTML = "Too Big! 📈";
    pesan.className = "hasil error";
  } else {
    pesan.innerHTML = "Too Small! 📉";
    pesan.className = "hasil error";
  }
}

function resetGame() {
  angkaRahasia = Math.floor(Math.random() * 100) + 1;
  jumlahTebakan = 0;
  document.getElementById('pesanTebak').innerHTML = "";
  document.getElementById('infoTebak').innerText = "";
  document.getElementById('tebakanUser').value = "";
}