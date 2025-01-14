const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const filter = document.getElementById('filter');
let isEditMode = false;
const formBtn = itemForm.querySelector('button');

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => {
    addItemToDOM(item);
  });
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;

  if(newItem === '') {
    alert('Please add an item');
    return;
  }
  if (checkIfItemExist(newItem)) {
    alert('That item already exists!');
    return;
  }
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  }
  addItemToDOM(newItem);
  addItemToStorage(newItem);
  checkUI();

  itemInput.value = '';
}

function checkIfItemExist(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(document.createTextNode(item));
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  
  itemsFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
 }

 function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
 }

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) { 
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.nodeName == 'LI') {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;
  itemList.querySelectorAll('li').forEach((item) => {
    item.classList.remove('edit-mode');
  });

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  itemInput.value = item.textContent;
  formBtn.style.backgroundColor = 'green';
}

function removeItem(item) { 
  if (confirm('Are you sure')) {
    item.remove();      

    checkUI();
    removeItemFromStorage(item.textContent);
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((itemFromStorage) => {
    if (itemFromStorage !== item) {
      return itemFromStorage;
    }
  });
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while(itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  
  localStorage.removeItem('items');
  checkUI();
}


function checkUI() {
  const items = itemList.querySelectorAll('li');
  itemInput.value = '';
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    filter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    filter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function init() {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  filter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();