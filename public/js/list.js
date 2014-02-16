$(document).ready(function(){
	$("#nav-left").click(function(e){
		$(".event-title").toggleClass("event-title-move");
		//$(".event-info").toggleClass("event-info-move");
		$(".arrow").toggleClass("arrow-move");
		$(".cancel-icon").toggleClass("cancel-icon-move");

	});

	$(".cancel-icon").click(function(e){
		console.log("clicked");
		$(this).parent().remove();

	});

  $.get("/eventlist/123456", function(data) {
    console.log(data);
  });

  // Facebook API
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '419637534837456',
      status     : true,
      cookie     : true,
      xfbml      : true 
    });

    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        testAPI();
      } else if (response.status === 'not_authorized') {
        FB.login();
      } else {
        FB.login();
      }
    });
  };

  // Load the SDK asynchronously
  (function(d) {
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
  }(document));

  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      $("#user-name").text(response.name);
      $.get(
        'http://graph.facebook.com/' + response.id +
            '/?fields=picture&type=large',
        function(data) {
          $("<img>", { src: data.picture.data.url }).width(30).height(30)
              .appendTo("#user-pic");
        }
      );
    });
  }
});
