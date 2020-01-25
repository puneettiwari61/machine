$(document).ready(function(){
  $('.datepicker').datepicker();
});


$(document).ready(function(){
  $('.timepicker').timepicker();
});

// $(document).ready(function() {
//   $('.browser-default').material_input();
// });

// var instance = M.FormSelect.getInstance('.checkit');

// instance.destroy();
M.AutoInit();
// document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('.sidenav');
//   var instances = M.Sidenav.init(elems, {edge: 'right', draggable :true});
//   instances.open();
// });

$(document).ready(function() {
  M.updateTextFields();
});
      
 
//  $(".button-collapse").sideNav();
 

$(document).ready(function(){
  $(".button-collapse").sideNav({edge: 'right'});
});

// ---------payements
// const payments = document.querySelector('.payments-open');
// var tbox = document.querySelector('.tbox')
// payments.addEventListener('click',() => {
//   tbox.classList.toggle('tboxv') 
// })

var mobile = document.querySelector('.mobile-icon');
var mobileNav = document.querySelector('.mobile');
mobile.addEventListener('click',()=>{
  mobileNav.classList.toggle('mobile2')
})

