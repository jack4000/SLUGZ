(function(){


//library to check class existence
function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}


//globals
var level = 1; //game level
var slugs = 0; //current amount of slugs
var pounds = 600; //current amount of £
var click_catch = 1; //amount of slugs caught per click
var click_sell = 0.1; //£ value of 1 slug
var earn_catch = 0; //amount of slugs earned every 10 seconds
var earn_sell = 0; //amount of slugs earned every 10 seconds
var completed_upgrades = []; //array of completed upgrades


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
/*function remove_welcome_message(){
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
remove_welcome_message()*/


//update page info - globals, stats, etc
function update_page_info(){
  //get header elements
  var s = document.getElementById('slugs');
  var p = document.getElementById('pounds');

  //update header values
  s.innerHTML = slugs;
  p.innerHTML = pounds.toFixed(2);

  //get click elements
  var cc = document.getElementById('click-catch');
  var cs = document.getElementById('click-sell');

  //update click values
  cc.innerHTML = click_catch;
  cs.innerHTML = click_sell;

  //get earn elements
  var ec = document.getElementById('earn-catch');
  var es = document.getElementById('earn-sell');

  //update earn values
  ec.innerHTML = earn_catch;
  es.innerHTML = earn_sell;
}
update_page_info()


//add a message to messages area
function add_message(type, amount1, amount2){
  //get messages div
  var m = document.getElementById('message');

  //create message
  var p = document.createElement('p');
  var msg = '';
  if(type == 'click catch'){msg = '+' + amount1 + ' slugs!'}
  if(type == 'click sell'){msg = 'Sold ' + amount1 + ' slugs'}
  if(type == 'click sell fail'){msg = 'Not enough slugs to sell'}
  if(type == 'earn'){msg = 'Earnings: ' + amount1 + ' slugs caught, £' + amount2 + ' earned'}
  if(type == 'upgrade buy'){msg = 'Bought upgrade!'}
  if(type == 'upgrade buy fail'){msg = 'Not enough money to buy upgrade'}
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
    slugs = slugs + click_catch;

    //update page info and add message
    update_page_info()
    add_message('click catch', click_catch);
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
        add_message('click sell', amount)

        //add money and update page
        pounds = pounds + (amount * click_sell);
        update_page_info()
      } else {
        //do not sell, add message
        add_message('click sell fail', amount)
      }
    })
  }
}
sell()


//begin earn gameloop timer
var count = 0; //game 'time' count
var loop = setInterval(counter, 1000); //calls counter() every 1s
var eb = document.getElementById('earn-bar'); //get earn-bar
function counter(){ //adds to the count and does stuff
  //update counter
  count += 1;

  //check if end of cycle
  if(count>10){
    //reset count
    count = 0;

    //apply earnings
    earn()
  }

  //adjust earn-bar styling
  eb.style.width = 10*count + '%';
}


//earn
function earn(){
  //get earn globals
  var ec = earn_catch;
  var es = earn_sell;

  //send earned message
  add_message('earn', ec, es);
}


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
    //get upgrade data
    var _up = upgrades[up];

    //check level
    if(_up.level <= lvl){
      //create dom element and internal div
      var u = document.createElement('div');
      u.classList.add('six');
      var uu = document.createElement('div');
      uu.classList.add('upgrade-item');
      uu.classList.add('relative');
      uu.dataset.upgrade = up;

      //populate data
      var title = "<h3>" + _up.title + "</h3>";
      var desc = "<p class='desc'>" + _up.desc + "<br><br></p>";
      var price = "<p><strong>£" + _up.price + "</strong></p>";
      var benefit = "<p><strong>" + _up.benefit.desc + "</strong></p>";

      //create buy button
      var buy = "<button data-upgrade=" + up + ">Buy</button>";

      //complete element
      uu.innerHTML = title + desc + price + benefit + buy;
      u.prepend(uu);

      //add to page - prepend will add them in reverse order
      container.prepend(u);
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
      button[0].addEventListener('click', function(){buy_upgrade(this.dataset.upgrade)});
    }
  }
}


//buy upgrade
function buy_upgrade(u){
  //get upgrades details
  var ud = upgrades[u];

  //check if enough money
  if(pounds>=ud.price){
    //deduct pounds
    pounds = pounds - ud.price;

    //add upgrade to completed array
    completed_upgrades.push(u);

    //get and apply upgrade stats
    if(ud.benefit.type == 'click catch'){click_catch = click_catch+ud.benefit.amount};

    //send message
    add_message('upgrade buy', 0)

    //unlock next upgrades?
    if(ud.unlock>0){
      //increase game level
      level = level + 1;
    }

    //prompt event?
    if(ud.event != 0){
      //prompt new event
      new_event(ud.event)
    }

    //recreate upgrades
    create_upgrades()

    //update page info
    update_page_info()

  } else {
    //send 'not enough money' message
    add_message('upgrade buy fail', 0)
  }
}


//new event - called from buy_upgrade() if upgrade prompts event
function new_event(e){
  //display event alert in events tab - turned off when event is settled
  var event_alert = document.getElementById('event-alert');
  event_alert.style.display = 'inline';

  //get event data
  var _e = events[e];

  //get events section
  var container = document.getElementById('events-container');

  //create dom element and internal div
  var u = document.createElement('div');
  u.classList.add('twelve');
  var uu = document.createElement('div');
  uu.classList.add('event-item');
  uu.classList.add('relative');
  uu.dataset.event = e;

  //populate general data
  var title = "<h3>" + _e.title + "</h3>";
  var desc = "<p class='desc'>" + _e.desc + "<br><br></p>";

  //create choices element
  var uuu = document.createElement('div');
  uuu.classList.add('row');

  //create pros and cons lists
  var onep = document.createElement('ul');
  for(var a=0; a<_e.choices.one.pros.length; a++){
    var pro = document.createElement('li');
    pro.append(_e.choices.one.pros[a]);
    onep.append(pro);
  }

  var onec = document.createElement('ul');
  for(var a=0; a<_e.choices.one.cons.length; a++){
    var con = document.createElement('li');
    con.append(_e.choices.one.cons[a]);
    onec.append(con);
  }

  var twop = document.createElement('ul');
  for(var a=0; a<_e.choices.two.pros.length; a++){
    var pro = document.createElement('li');
    pro.append(_e.choices.two.pros[a]);
    twop.append(pro);
  }

  var twoc = document.createElement('ul');
  for(var a=0; a<_e.choices.two.cons.length; a++){
    var con = document.createElement('li');
    con.append(_e.choices.two.cons[a]);
    twoc.append(con);
  }

  //create choice buttons
  var one_button = document.createElement('button');
  one_button.dataset.choice = "one";
  one_button.innerHTML = "Go!";
  var two_button = document.createElement('button');
  two_button.dataset.choice = "two";
  two_button.innerHTML = "Go!";

  //create choices
  var one = document.createElement('div');
  one.classList.add('six');
  one.innerHTML = "<h4>" + _e.choices.one.title + "</h4><p>" + _e.choices.one.desc + "</p>";
  one.append(onep);
  one.append(onec);
  one.append(one_button);

  var two = document.createElement('div');
  two.classList.add('six');
  two.innerHTML = "<h4>" + _e.choices.two.title + "</h4><p>" + _e.choices.two.desc + "</p>";
  two.append(twop);
  two.append(twoc);
  two.append(two_button);

  //add choices to choices container
  uuu.append(one);
  uuu.append(two);

  //complete element
  uu.innerHTML = title + desc;
  uu.append(uuu); //add choices below general data
  u.prepend(uu);

  //add to page - prepend will add them in reverse order
  container.prepend(u);
}


})();
