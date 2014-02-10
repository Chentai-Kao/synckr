  $(document).ready(function() {
    $("#st-date").datepicker().on('changeDate', function(e){$("#st-date").datepicker('hide')});
    $("#en-date").datepicker().on('changeDate', function(e){$("#en-date").datepicker('hide')});
  });

