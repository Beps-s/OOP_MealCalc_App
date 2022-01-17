const StorageCtrl = (function(){
  return {
    storeItem: function(item){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    clearAll: function(){
      localStorage.clear()
    }
  }
})();

const ItemCtrl = (function(){
  const Item = function(id, name, calories){
    this.id = id
    this.name = name
    this.calories = calories 
  }
  
  const data = {
    items: [
        //{id: 0, name: 'Steak Dinner', calories: 1200},
        //{id: 1, name: 'Cookie', calories: 400},
        //{id: 2, name: 'Eggs', calories: 300}
    ],
    total: 0
  }
  
  return {
    getItems: function(){
      return data.items
    },
    addItem: function(name, calories){
      let ID;
      if(data.items.lenght > 0){
        ID = data.items[data.items.lenght - 1].id + 1
      } else {
        ID = 0
      }
      calories = parseInt(calories)
      newItem = new Item(ID, name, calories)
      data.items.push(newItem)
      return newItem
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total = total + item.calories;
      });
      data.total = total
      return data.total;
    },
   logData: function(){
        return data
      }
    }
})();

const UICtrl = (function(){
  const UISelectors = {
    itemList: "#item-list",
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    addBtn: '.add-btn',
    totalCalories: '.total-calories',
    clearBtn: '.clear-btn',
    backBtn: '.back-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn'
  }
  return {
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html+=`<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong><em>${item.calories}Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        </li>`;
      })
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return{
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    getSelectors: function(){
      return UISelectors
    },
    addListItem: function(item){
      const li = document.createElement('li');
      li.className = 'collection-item'
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em> <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearUI: function(){
      document.querySelector(UISelectors.itemList).innerHTML = '';
      document.querySelector(UISelectors.totalCalories).textContent = '0';
    },
    showBtns: function(){
      if(event.target.parentElement.tagName == 'A'){
      document.querySelector(UISelectors.backBtn).style.display = ''
      document.querySelector(UISelectors.deleteBtn).style.display = ''
      document.querySelector(UISelectors.updateBtn).style.display = ''
      document.querySelector(UISelectors.addBtn).style.display = 'none'
      document.querySelector(UISelectors.clearBtn).style.display = 'none'
      }
    },
    hideBtns: function(){
      document.querySelector(UISelectors.addBtn).style.display = ''
      document.querySelector(UISelectors.clearBtn).style.display = ''
      document.querySelector(UISelectors.backBtn).style.display = 'none'
      document.querySelector(UISelectors.deleteBtn).style.display = 'none'
      document.querySelector(UISelectors.updateBtn).style.display = 'none'
    },
    clearMeal: function(){

    },
  }
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getSelectors()
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    document.querySelector(UISelectors.itemList).addEventListener('click', UICtrl.showBtns);
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.hideBtns);
    document.querySelector(UISelectors.clearBtn).addEventListener('click', () => {
    UICtrl.clearUI();
    StorageCtrl.clearAll();
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', clearMeal);
  })
    document.addEventListener('DOMContentLoaded', getItemsFromStorage)
  }
  const itemAddSubmit = function(event){
    const input = UICtrl.getItemInput()
    if(input.name !== '' && input.calories !== ''){
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      UICtrl.addListItem(newItem)
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);
      StorageCtrl.storeItem(newItem);
      UICtrl.clearInput();
    }
    event.preventDefault()
  }
  const getItemsFromStorage = function(){
    const items = StorageCtrl.getItemsFromStorage()
    items.forEach(function(item){
      ItemCtrl.addItem(item['name'], item['calories'])
    })
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    UICtrl.populateItemList(items)
  }
  return {
      init: function(){
        console.log('Initializing App')
        const items = ItemCtrl.getItems()
        UICtrl.populateItemList(items)
        loadEventListeners()
      }
    }
}) (ItemCtrl, StorageCtrl, UICtrl);

App.init()