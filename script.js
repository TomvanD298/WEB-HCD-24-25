let addedTexts = [];
const categories = {
  shortcuts: {
    containerId: 'shortcut-ring',
    base: [
      "Ik ben onderweg naar huis",
      "De trein is druk vandaag",
      "Zin om later te bellen?",
      "Ik lees het straks even goed",
      "Ik heb nu weinig bereik",
      "Tot zo!",
      "Ik stuur straks een foto",
      "Even pauze aan het houden",
      "Laat maar weten als je er bent"
    ],
    storageKey: 'customShortcuts'
  },
  common: {
    containerId: 'common-ring',
    base: [
      "Hoe gaat het?",
      "Ik ben zo terug",
      "Laat maar weten",
      "Even bezig, ik reageer zo"
    ]
  },
  train: {
    containerId: 'train-ring',
    base: [
      "Ik zit in de trein",
      "De trein heeft vertraging",
      "Ik ben bijna op bestemming",
      "Ik moet overstappen"
    ]
  },
  metro: {
    containerId: 'metro-ring',
    base: [
      "Ik zit in de metro",
      "De metro is druk",
      "Bijna bij mijn halte",
      "Ik stap zo over op de bus"
    ]
  },
  bus: {
    containerId: 'bus-ring',
    base: [
      "Ik zit in de bus",
      "De bus heeft vertraging",
      "Bijna bij mijn halte",
      "Ik stuur je straks een bericht"
    ]
  }
};

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

  text = text.trim();
  if (/[.,!?]/.test(text.charAt(0))) {
    output.innerText = current + text + ' ';
  } else {
    output.innerText = current + (current ? ' ' : '') + text + ' ';
  }
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

function generateCategory(categoryKey) {
  const category = categories[categoryKey];
  const container = document.getElementById(category.containerId);
  container.innerHTML = "";

  const custom = category.storageKey
    ? JSON.parse(localStorage.getItem(category.storageKey) || '[]')
    : [];

  const combined = [...category.base, ...custom];

  combined.forEach(text => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.onclick = () => addText(text);
    container.appendChild(btn);
  });

  if (category.storageKey) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Eigen zin toevoegen...";
    container.appendChild(input);

    const addBtn = document.createElement("button");
    addBtn.textContent = "➕ Voeg toe";
    addBtn.onclick = () => {
      const val = input.value.trim();
      if (val) {
        saveCustomShortcut(val, categoryKey);
        input.value = '';
      }
    };
    container.appendChild(addBtn);
  }

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "🗑️ Laatste ongedaan maken";
  removeBtn.className = "back";
  removeBtn.onclick = removeLastText;
  container.appendChild(removeBtn);

  const backBtn = document.createElement("button");
  backBtn.textContent = "⬅️ Terug";
  backBtn.className = "backButton";
  backBtn.onclick = () => {
    container.style.display = 'none';
    document.getElementById('main-ring').style.display = 'grid';
  };
  container.appendChild(backBtn);
}

function saveCustomShortcut(text, categoryKey = 'shortcuts') {
  const category = categories[categoryKey];
  const saved = JSON.parse(localStorage.getItem(category.storageKey) || '[]');
  saved.push(text);
  localStorage.setItem(category.storageKey, JSON.stringify(saved));
  generateCategory(categoryKey);
}

function showCategory(categoryKey) {
  document.getElementById('main-ring').style.display = 'none';
  Object.values(categories).forEach(cat => {
    const el = document.getElementById(cat.containerId);
    if (el) el.style.display = 'none';
  });
  const category = categories[categoryKey];
  document.getElementById(category.containerId).style.display = 'flex';
  generateCategory(categoryKey);
}

function shareViaWhatsApp() {
  const text = document.getElementById('output').innerText.trim();
  if (text) {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  } else {
    alert('Er is nog geen tekst om te delen.');
  }
}

function promptNewCategory() {
  const name = prompt("Voer de naam in voor de nieuwe categorie:");
  if (name) createNewCategory(name.trim());
}

function createNewCategory(name) {
  if (!name) return;

  const id = name.toLowerCase().replace(/\s+/g, "-") + "-ring";
  if (document.getElementById(id)) return;

  const container = document.createElement("div");
  container.className = "shortcuts";
  container.id = id;
  container.style.display = "none";
  document.querySelector("main").insertBefore(container, document.getElementById("output"));

  if (typeof categories !== "undefined") {
    categories[name.toLowerCase()] = {
      containerId: id,
      base: [],
      storageKey: `custom-${name.toLowerCase()}`
    };
  }

  const btn = document.createElement("button");
  btn.className = "switchmodus";
  btn.textContent = name;
  btn.setAttribute("data-added", new Date().toISOString());
  btn.onclick = () => showCategory(name.toLowerCase());
  document.getElementById("main-ring").appendChild(btn);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "back";
  deleteBtn.textContent = `🗑️ Verwijder categorie`;
  deleteBtn.onclick = () => {
    const confirmDelete = confirm(`Weet je zeker dat je de categorie "${name}" wilt verwijderen?`);
    if (!confirmDelete) return;

    container.remove();
    const categoryKey = name.toLowerCase();
    delete categories[categoryKey];

    let savedCategories = JSON.parse(localStorage.getItem('customCategoryList') || '[]');
    savedCategories = savedCategories.filter(cat => cat.toLowerCase() !== categoryKey);
    localStorage.setItem('customCategoryList', JSON.stringify(savedCategories));
    localStorage.removeItem(`custom-${categoryKey}`);
  };
  container.appendChild(deleteBtn);

  let savedCategories = JSON.parse(localStorage.getItem('customCategoryList') || '[]');
  if (!savedCategories.includes(name)) {
    savedCategories.push(name);
    localStorage.setItem('customCategoryList', JSON.stringify(savedCategories));
  }
}

function sortCategoryButtons() {
  const sortBy = document.getElementById("sortSelect").value;
  const mainRing = document.getElementById("main-ring");

  const allButtons = Array.from(mainRing.querySelectorAll("button"));
  const fixedButtons = allButtons.slice(0, 6); // laat de eerste 6 staan
  const dynamicButtons = allButtons.slice(6);

  const sortedButtons = [...dynamicButtons];

  if (sortBy === "alphabetical") {
    sortedButtons.sort((a, b) =>
      a.textContent.localeCompare(b.textContent, 'nl', { sensitivity: 'base' })
    );
  } else if (sortBy === "added") {
    sortedButtons.sort((a, b) =>
      new Date(a.getAttribute('data-added')) - new Date(b.getAttribute('data-added'))
    );
  } else if (sortBy === "newest") {
    sortedButtons.sort((a, b) =>
      new Date(b.getAttribute('data-added')) - new Date(a.getAttribute('data-added'))
    );
  } else if (sortBy === "emoji") {
    const isEmoji = str => /^[^\p{L}\p{N}]/u.test(str.trim());
    sortedButtons.sort((a, b) => {
      return isEmoji(b.textContent) - isEmoji(a.textContent);
    });
  } else if (sortBy === "length-desc") {
    sortedButtons.sort((a, b) => b.textContent.trim().length - a.textContent.trim().length);
  } else if (sortBy === "length-asc") {
    sortedButtons.sort((a, b) => a.textContent.trim().length - b.textContent.trim().length);
  }

  dynamicButtons.forEach(btn => mainRing.removeChild(btn));
  sortedButtons.forEach(btn => mainRing.appendChild(btn));
}

window.addEventListener("DOMContentLoaded", () => {
  generateCategory('shortcuts');
  document.querySelectorAll('#main-ring button').forEach(btn => {
    if (!btn.hasAttribute('data-added')) {
      btn.setAttribute('data-added', new Date().toISOString());
    }
  });

  const savedCategories = JSON.parse(localStorage.getItem('customCategoryList') || '[]');
  savedCategories.forEach(name => {
    createNewCategory(name);
  });
});