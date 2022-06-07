(function(){


//library to check class existence
function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}


//globals
var level = 1; //game level
var slugs = 0; //current amount of slugs
var pounds = 0; //current amount of £
var catch_click_yield = 1; //current amount of slugs caught per click
var sell_click_yeild = 1; //current £ value of 1 slug
var completed_upgrades = ['hat',]; //array of completed upgrades


//tabs
function tabs(){
  //get tab buttons
  var tb = document.getElementsByClassName('tab-button');

  //get tabs
  var t = document.getElementsByClassName('tab');

  //process each button
  for(var a=0; a<tb.length; a++){
    //set event listener
    tb[a].addEventListener('click', function(){
      //hide all tabs
      for(var b=0; b<t.length; b++){
        if(t[b].classList.contains('invisible')) {} //do nothing - already hidden
        else {
          t[b].classList.add('invisible'); //add invisible class
        }
      }

      //unhide new active tab
      t[this.dataset.tab].classList.toggle('invisible');

      //remove active class from all buttons
      for(var c=0; c<tb.length; c++){
        tb[c].classList.remove('active');
      }

      //add active class to this button
      if(this.classList.contains('active')) {}
      else {
        this.classList.add('active');
      }
    })
  }
}
tabs()


//welcome messages remover
function remove_welcome_message(){
  //get elements
  var wm = document.getElementsByClassName('welcome');

  //process each message
  for(var a=0; a<wm.length; a++){
    //get exit button
    var wm_exit = wm[a].getElementsByClassName('exit')[0];

    //set event listener
    wm_exit.addEventListener('click', function(){
      //get container and remove
      var wm_container = this.parentNode.parentNode;
      wm_container.remove();
    })
  }
}
remove_welcome_message()


//update header info - takes the slugs/pounds globals
function update_header_info(){
  //get elements
  var hi_s = document.getElementById('slugs');
  var hi_p = document.getElementById('pounds');

  //update values
  hi_s.innerHTML = slugs.toString();
  hi_p.innerHTML = pounds.toString();
}
update_header_info()


//add a message to messages area
function add_message(type, amount){
  //get messages div
  var m = document.getElementById('message');

  //create message
  var p = document.createElement('p');
  var msg = '';
  if(type == 'catch click') {msg = 'Caught ' + amount + ' slugs'}
  if(type == 'sell click') {msg = 'Sold ' + amount + ' slugs'}
  if(type == 'sell click fail') {msg = 'Not enough slugs to sell'}
  if(type == 'upgrade buy fail') {msg = 'Not enough money to buy upgrade'}
  p.innerHTML = msg;

  //prepend message
  m.prepend(p);

  //clean up messages
  var msgs = m.getElementsByTagName('p');
  if(msgs.length > 1){ //if there are more than 8 messages
    msgs[1].remove(); //remove last message
  }
}


//catch button functionality
function catch_click(){
  //get button
  var cb = document.getElementById('catch');

  //set event listener
  cb.addEventListener('click', function(){
    //increase slugs total
    slugs = slugs + catch_click_yield;

    //update header info and add message
    update_header_info()
    add_message('catch click', catch_click_yield);
  })
}
catch_click()


//sell
function sell(){
  //get sell buttons
  var sb = document.getElementsByClassName('sell-button');

  //set event listeners
  for(var a=0; a<sb.length; a++){
    sb[a].addEventListener('click', function(){
      //get slugs amount
      var s = slugs;

      //get sell amount
      var amount = this.dataset.amount;

      //check if there are enough slugs to sell
      if(s>=amount){
        //deduct slugs from total and add message
        slugs = s - amount;
        add_message('sell click', amount)

        //add money and update header
        pounds = pounds + (amount * sell_click_yeild);
        update_header_info()
      } else {
        //do not sell, add message
        add_message('sell click fail', amount)
      }
    })
  }
}
sell()


//create available upgrades and populate data, upgrade management in seperate function
function create_upgrades(){
  //get current game level
  var lvl = level;

  //get upgrades section
  var container = document.getElementById('upgrades-container');

  //'refresh' upgrades by removing and re-adding
  var ups = container.children;
  if(ups.length > 0){
    container.innerHTML = '';
  }

  //loop through upgrades
  for(up in upgrades){
    if(upgrades[up].level <= lvl){
      //create dom element and internal div
      var u = document.createElement('div');
      u.classList.add('six');
      var uu = document.createElement('div');
      uu.classList.add('upgrade-item');
      uu.classList.add('relative');
      uu.dataset.upgrade = up;

      //populate data
      var title = "<h3>" + upgrades[up].title + "</h3>";
      var desc = "<p>" + upgrades[up].desc + "<br><br></p>";
      var price = "<p><strong>£" + upgrades[up].price + "</strong></p>";
      var benefit = "<p><strong>" + upgrades[up].benefit.desc + "</strong></p>";

      //create buy button
      var buy = "<button data-upgrade=" + up + ">Buy</button>";

      //complete element and add to page
      uu.innerHTML = title + desc + price + benefit + buy;
      u.prepend(uu);
      container.append(u);
    }
  }

  //process upgrades - make button active/inactive, etc
  process_upgrades()
}
create_upgrades()


//process upgrades - make button active/inactive, etc
//initially called in create_upgrades() above
function process_upgrades(){
  //get upgrades container
  var container = document.getElementById('upgrades-container');

  //get visible upgrades
  var vu = container.getElementsByClassName('upgrade-item');

  //get completed upgrades
  var cu = completed_upgrades;

  //loop through visible upgrades
  for(var a=0; a<vu.length; a++){
    //get upgrade name
    var u = vu[a].dataset.upgrade;

    //check if completed
    if(cu.includes(vu[a].dataset.upgrade)){
      //remove buy button
      var button = vu[a].getElementsByTagName('button');
      button[0].remove()

      //make upgrade 'completed'
      vu[a].classList.add('completed');
    } else {
      //make buy button active
      var button = vu[a].getElementsByTagName('button');
      button[0].addEventListener('click', function(){buy_upgrade(u)});
    }
  }
}


//buy upgrade
function buy_upgrade(u){
  //get upgrades details
  var ud = upgrades[u];

  //check if enough money
  if(pounds>=ud.price){
    //add upgrade to completed array
    completed_upgrades.push(u);

    //recreate upgrades
    create_upgrades()

    //get and apply upgrade stats
    console.log('a')
  } else {
    //send 'not enough money' message
    add_message('upgrade buy fail', 0)
  }

}


})();
