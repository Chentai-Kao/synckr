$(document).ready(function(){

  $("#st-date").datepicker().on('changeDate', function(e){
    $("#st-date").datepicker('hide')
  });
  $("#en-date").datepicker().on('changeDate', function(e){
    $("#en-date").datepicker('hide')
  });
  $("#de-date").datepicker().on('changeDate', function(e){
    $("#de-date").datepicker('hide')
  });


  var width = $('#friendList').width();
  $("#friendList").offset({left: width});

  $('#invite-form input').click(function(e) {
    e.preventDefault();
    $('#friendList').animate({left: 0}, 200);
    $('#placeholder').animate({left: -width}, 200);
  });

  $('#back-new').click(function(e) {
    e.preventDefault();
    $('#friendList').animate({left: width}, 200);
    $('#placeholder').animate({left: 0}, 200);
  });

  $('#ok-new').click(function(e) {
    e.preventDefault();
    $('#friendList').animate({left: width}, 200);
    $('#placeholder').animate({left: 0}, 200);
  });  

  // send data to server
  newEvent = {}
  $("#done").click(function(e) {
    $("#title-form :input").each(function() {
      newEvent[this.name] = $(this).val();
    });
    $("#date-form :input").each(function() {
      newEvent[this.name] = $(this).val();
    });
    newEvent.duration = ""
    $("#dur-form :input").each(function() {
      newEvent.duration += $(this).val();
    });
    $("#invite-form :input").each(function() {
      newEvent[this.name] = $(this).val();
    });
    newEvent.eventId = String(Math.random()).substring(2);
    $.post("/newevent", newEvent);
  });

});
