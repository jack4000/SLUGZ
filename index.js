(function(){


//library to check class existence
function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}


//globals
var slugs = 0; //current amount of slugs
var pounds = 0; //current amount of £
var catch_click_yield = 1; //current amount of slugs caught per click
var sell_click_yeild = 1; //current £ value of 1 slug


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
  var m = document.getElementById('messages');

  //create message
  var p = document.createElement('p');
  var msg = '';
  if(type == 'catch click') {msg = 'Caught ' + amount + ' slugs'}
  if(type == 'sell click') {msg = 'Sold ' + amount + ' slugs'}
  if(type == 'sell click fail') {msg = 'Not enough slugs to sell'}
  p.innerHTML = msg;

  //prepend message
  m.prepend(p);

  //clean up messages
  var msgs = m.getElementsByTagName('p');
  if(msgs.length > 8){ //if there are more than 8 messages
    msgs[8].remove(); //remove last message
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


})();
