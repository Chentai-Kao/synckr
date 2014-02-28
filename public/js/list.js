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

	$(".out-event:not(.not-decided,.not-voted)").click(function(e) {
		e.preventDefault();
		var link = $(this).find('a').attr('href');
		ga('send', 'event', 'list', 'click', 'event-done', {
			'hitCallback': function() {
				window.location.href = link;
			}
		});
	});

	$(".out-event.not-decided,.out-event.not-voted").click(function(e) {
		e.preventDefault();
		var link = $(this).find('a').attr('href');
		ga('send', 'event', 'list', 'click', 'event-ongoing', {
			'hitCallback': function() {
				window.location.href = link;
			}
		});
	});
});
