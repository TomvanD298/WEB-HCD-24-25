let addedTexts = [];

function addText(text) {
  const output = document.getElementById('output');
  let current = output.innerText.trim();

  // Kijk of de huidige tekst eindigt op een zinseinde
  const endsWithPunctuation = /[.!?]$/.test(current);

  // Als de tekst NIET eindigt met punt/uitroepteken/vraagteken en er is al tekst:
  if (current.length > 0 && !endsWithPunctuation) {
    // dan maken we de eerste letter van de nieuwe tekst klein
    text = text.charAt(0).toLowerCase() + text.slice(1);
  }

  // Voeg spatie toe als er geen staat
  if (current.length > 0 && !current.endsWith(' ')) {
    current += ' ';
  }

  output.innerText = current + text + ' ';
  addedTexts.push(text);

  // ✅ Vibratie bij input
  if (navigator.vibrate) navigator.vibrate(50);
}

function removeLastText() {
  if (addedTexts.length > 0) {
    addedTexts.pop(); // laatste verwijderen
    const output = document.getElementById('output');
    output.innerText = addedTexts.join(' ') + ' ';
  }
}

function copyText() {
  const output = document.getElementById('output');
  navigator.clipboard.writeText(output.innerText.trim());
  alert('Gekopieerd naar klembord!');
}

function clearText() {
  document.getElementById('output').innerText = '';
  addedTexts = []; // ook de opgeslagen zinnen wissen
}

function showShortcuts() {
  document.getElementById('main-ring').style.display = 'none';
  document.getElementById('shortcut-ring').style.display = 'flex';
}

function hideShortcuts() {
  document.getElementById('main-ring').style.display = 'grid';
  document.getElementById('shortcut-ring').style.display = 'none';
}

// 📝 Opslaan en ophalen van custom zinnen
function saveCustomShortcut(text) {
  const saved = JSON.parse(localStorage.getItem('customShortcuts') || '[]');
  saved.push(text);
  localStorage.setItem('customShortcuts', JSON.stringify(saved));
  generateShortcuts(); // herladen na toevoegen
}

// 🔄 Snelzinnen array (basis)
const baseShortcuts = [
  "Ik ben onderweg naar huis",
  "De trein is druk vandaag",
  "Zin om later te bellen?",
  "Ik lees het straks even goed",
  "Ik heb nu weinig bereik",
  "Tot zo!",
  "Ik stuur straks een foto",
  "Even pauze aan het houden",
  "Laat maar weten als je er bent"
];

function generateShortcuts() {
  const container = document.getElementById('shortcut-ring');
  container.innerHTML = "";

  const custom = JSON.parse(localStorage.getItem('customShortcuts') || '[]');
  const combined = [...baseShortcuts, ...custom];

  combined.forEach(text => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => addText(text);
    container.appendChild(btn);
  });

  // Invoerveld voor eigen zinnen
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Eigen zin toevoegen...";
  // input.className = "custom-input";
  container.appendChild(input);

  const addBtn = document.createElement("button");
  addBtn.textContent = "➕ Voeg toe";
  addBtn.onclick = () => {
    const val = input.value.trim();
    if (val) {
      saveCustomShortcut(val);
      input.value = '';
    }
  };
  container.appendChild(addBtn);

  // Terugknop
  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅️ Terug";
  backBtn.className = "back";
  backBtn.onclick = hideShortcuts;
  container.appendChild(backBtn);

  // 🗑️ Laatste ongedaan maken
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "🗑️ Laatste ongedaan maken";
  removeBtn.className = "back";
  removeBtn.onclick = removeLastText;
  container.appendChild(removeBtn);
}

// 📤 WhatsApp deelknop
function shareViaWhatsApp() {
  const text = document.getElementById('output').innerText.trim();
  if (text) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  } else {
    alert('Er is nog geen tekst om te delen.');
  }
}

window.addEventListener("DOMContentLoaded", generateShortcuts);