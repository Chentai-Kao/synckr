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

	$(".out-event:not(not-decided,not-voted)").click(function(e) {
		_gaq.push(['_trackEvent', 'list', 'click', 'event-done']);
	});

	$(".out-event.not-decided.not-voted").click(function(e) {
		_gaq.push(['_trackEvent', 'list', 'click', 'event-ongoing']);
	});
});
