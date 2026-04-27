function hitung() {
  // 1. Ambil nilai dari input
  let input1  = document.getElementById('angka1').value;
  let input2  = document.getElementById('angka2').value;
  let operasi = document.getElementById('operasi').value;
  let elHasil = document.getElementById('hasil');

  // 2. Validasi input kosong
  if (input1 === '' || input2 === '') {
    elHasil.innerHTML = '⚠️ Isi kedua angka dulu!';
    elHasil.className = 'hasil error';
    return;
  }

  let a = Number(input1);
  let b = Number(input2);
  let hasil;

  // 3. Logika perhitungan
  switch (operasi) {
    case '+': hasil = a + b; break;
    case '-': hasil = a - b; break;
    case '*': hasil = a * b; break;
    case '/': 
      hasil = b === 0 ? 'Error: ÷ 0!' : a / b; 
      break;
  }

  // 4. Tampilkan hasil dengan warna hijau
  elHasil.innerHTML = `${a} ${operasi} ${b} = ${hasil}`;
  elHasil.className = 'hasil sukses';
}