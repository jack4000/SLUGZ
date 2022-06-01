(function(){


//library to check class existence
function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}


//globals
var slugs = 0;
var pounds = 0;


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
        if (t[b].classList.contains('invisible')) {} //do nothing - already hidden
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
      if (this.classList.contains('active')) {}
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


})();
