const colorSelector = document.getElementById("colorSelector");
let addButton = document.getElementById("addButton");
let removeButton = document.getElementById("removeButton");
const input = document.getElementById("colorInput");
const confirmationMessage = document.getElementById("confirmationMessage");
const maxMenuSize = 10;
const skipIntroCheckBox = document.getElementById("skipIntroCheckbox");
const spanIntroCheckBox = document.getElementById("spanIntroCheckBox");
let extensionColor = null;

getIntroFeatureState().then(state => skipIntroCheckBox.checked = state);
getExtensionColor().then(color => updateExtensionColor(color));
getColorMenu().then(colorOptions => buildButtons(colorOptions));

function setCheckBoxColor() {
  if(skipIntroCheckBox.checked) {
    spanIntroCheckBox.style.backgroundColor = extensionColor;
  } else {
    spanIntroCheckBox.style.backgroundColor = chineseSilver;
  }
}

skipIntroCheckBox.onclick = () => {
  setCheckBoxColor();
  setIntroFeatureState(skipIntroCheckBox.checked);
}

function setIntroFeatureState(state) {
  chrome.storage.sync.set({ isIntroFeatureActive: state }, function () {
    log("Setting intro feature state to " + state);
  });
}

function updateExtensionColor(color) {
  extensionColor = color;
  setCheckBoxColor();
  input.value = color;
  addButton.style.backgroundColor = color;
  removeButton.style.backgroundColor = color;
}

function updateColorMenu(colorOptions) {
  while(colorSelector.lastChild) colorSelector.removeChild(colorSelector.lastChild);
  buildButtons(colorOptions);
}

function colorCodeValidation(color) {
  confirmationMessage.innerText = "";
  const isOk = /^#([0-9A-F]{3}){1,2}$/i.test(color);

  if (!isOk) {
    confirmationMessage.innerText = "Invalid hex code!";
    log("Invalid input");
    return false;
  }

  return true;
}

addButton.onclick = function() {
  const color = input.value.toUpperCase();

  getColorMenu().then(colorOptions => {
    if(colorOptions.length === maxMenuSize) {
      confirmationMessage.innerText = "You have reached the maximum menu size!";
      log("Max menu size reached");
      return;
    }

    if(!colorCodeValidation(color)) return;

    const isInMenu = colorOptions.includes(color);

    if(isInMenu) {
      confirmationMessage.innerText = "This color is already in the menu";
      log("Repeated color");
      return;
    }

    setExtensionColor(color);
    updateExtensionColor(color);

    colorOptions.push(color);
    
    setColorMenu(colorOptions);
    updateColorMenu(colorOptions);
  }); 
}

removeButton.onclick = function() {
  const color = input.value.toUpperCase();

  if(!colorCodeValidation(color)) return;

  if(color === crunchyrollOrange) {
    confirmationMessage.innerText = "You can't remove this color!";
    log("Tried to remove theme color");
    return;
  }

  getColorMenu().then( colorOptions => {
    const isInMenu = colorOptions.includes(color);

    if(!isInMenu) {
      confirmationMessage.innerText = "This color isn't in the menu";
      log("Color not in menu");
      return;
    }

    colorOptions = colorOptions.filter(function(element) { return element != color; });

    getExtensionColor().then( currentColor => {
      const isInMenu = colorOptions.includes(currentColor);
      if(!isInMenu) {
        setExtensionColor(crunchyrollOrange);
        updateExtensionColor(crunchyrollOrange);
      }
    });

    setColorMenu(colorOptions);
    updateColorMenu(colorOptions);
  });
}

function setColorMenu(colorMenu) {
  chrome.storage.sync.set({ colorOptions: colorMenu }, function () {
    log("Color menu updated");
  });
}

function setExtensionColor(color) {
  chrome.storage.sync.set({ extensionColor: color }, function () {
    log("Setting extension color to " + color);
  });
}

function buildButtons(colorOptions) {
  for (let color of colorOptions) {
    let newButton = document.createElement("button");
    newButton.addEventListener("click", function () { 
      setExtensionColor(color);
      updateExtensionColor(color);
    });
    newButton.style.backgroundColor = color;
    newButton.className = "colorChangeButton"
    colorSelector.appendChild(newButton);
  }
}