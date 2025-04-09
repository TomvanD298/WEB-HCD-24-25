function addText(text) {
    const output = document.getElementById('output');
    let current = output.innerText;
  
    // Voeg spatie toe als er nog geen spatie staat
    if (current.length > 0 && !current.endsWith(' ')) {
      current += ' ';
    }
  
    output.innerText = current + text + ' ';
  
    // ✅ Vibratie bij input
    if (navigator.vibrate) navigator.vibrate(50);
  }
  
  function copyText() {
    const output = document.getElementById('output');
    navigator.clipboard.writeText(output.innerText.trim());
    alert('Gekopieerd naar klembord!');
  }
  
  function clearText() {
    document.getElementById('output').innerText = '';
  }
  
  function showShortcuts() {
    document.getElementById('main-ring').style.display = 'none';
    document.getElementById('shortcut-ring').style.display = 'flex';
  }
  
  function hideShortcuts() {
    document.getElementById('main-ring').style.display = 'block';
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
    input.style.padding = "1rem";
    input.style.marginTop = "1rem";
    input.style.borderRadius = "8px";
    input.style.width = "100%";
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
  
    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅️ Terug";
    backBtn.className = "back";
    backBtn.onclick = hideShortcuts;
    container.appendChild(backBtn);
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