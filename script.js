function addText(text) {
    const output = document.getElementById('output');
    let current = output.innerText;
  
    // Voeg spatie toe als er nog geen spatie staat
    if (current.length > 0 && !current.endsWith(' ')) {
      current += ' ';
    }
  
    output.innerText = current + text + ' ';
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

  const shortcuts = [
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
    container.innerHTML = ""; // leegmaken als je wilt herladen
  
    // Maak knoppen aan
    shortcuts.forEach(text => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.onclick = () => addText(text);
      container.appendChild(btn);
    });
  
    // Voeg 'Terug'-knop toe
    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅️ Terug";
    backBtn.className = "back";
    backBtn.onclick = hideShortcuts;
    container.appendChild(backBtn);
  }
  
  // Roep aan bij het laden van de pagina
  window.addEventListener("DOMContentLoaded", generateShortcuts);