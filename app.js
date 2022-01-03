const ItemCtrl = (function(){
  const Item = function(id, name, calories){
    this.id = id
    this.name = name
    this.calories = calories 
  }
  const data = {
    items: [
        {id: 0, name: 'Steak Dinner', calories: 1200},
        {id: 1, name: 'Cookie', calories: 400},
        {id: 2, name: 'Eggs', calories: 300}
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
      data.Items.push(newItem)
      return newItem
    },
    getTotalCalories: function(){
      let total = 0;
      data.items.forEach(function(item){
        total = total + item.calories;
        console.log(total)
      });
      data.total = total
      console.log(data.total)
      return data.total;
    },
   logData: function(){
        return data
      }
    }
})();

const UICtrl = (function(){
  const UISelectors = {
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    addBtn: '#add-btn',
    totalCalories: '.total-calories'
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
      li.innerHTML = `<strong>${item.name}: </strong>
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
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
    }
  }
})();

const App = (function(ItemCtrl, UICtrl){
  const loadEventListeners = function(){
    const UISelectors = UICtrl.getSelectors()
    document.querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit)
  },
  const itemAddSubmit = function(event){
    const input = UICtrl.getItemInput()
    if(input.name !== '' && input.calories !== ''){
      const newItem = ItemCtrl.addItem(input.name, input.calories)
      UICtrl.addListItem(newItem)
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl,showTotalCalories(totalCalories);
      UICtrl.clearInput();
    }
    event.preventDefault()
  }
  return {
      init: function(){
        console.log('Initializing App')
        const items = ItemCtrl.getItems()
        UICtrl.populateItemList(items)
        loadEventListeners()
      }
    }
}) (ItemCtrl, UICtrl);

App.init()