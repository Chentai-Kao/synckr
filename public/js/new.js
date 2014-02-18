$(document).ready(function(){

  $("#st-date").datepicker().on('changeDate', function(e){
    $("#st-date").datepicker('hide');
    $("#start-date").val($("#st-date").data("datepicker").date);
  });
  $("#en-date").datepicker().on('changeDate', function(e){
    $("#en-date").datepicker('hide');
    $("#end-date").val($("#en-date").data("datepicker").date);
  });
  $("#de-date").datepicker().on('changeDate', function(e){
    $("#de-date").datepicker('hide');
    $("#deadline-date").val($("#de-date").data("datepicker").date);
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

  // $("#mainform").submit(function(e) {
  //   e.preventDefault();
  //   $.post("/events", $(this).serialize());
  // });
  $("#nav-right").click(function(e) {
    $("#mainform").submit();
  });
});
