$(function() {
	var heatmap = [
		{
			"date": "2014-02-11",
			"start": "1",
			"duration": "2",
			"level": 1
		},
		{
			"date": "2014-02-11",
			"start": "3",
			"duration": "2",
			"level": 3
		},
		{
			"date": "2014-02-11",
			"start": "10",
			"duration": "4",
			"level": 5
		},
		{
			"date": "2014-02-12",
			"start": "3",
			"duration": "2",
			"level": 2
		},
		{
			"date": "2014-02-12",
			"start": "5",
			"duration": "2",
			"level": 4
		}
	];

	var drawHeatmap = function(map) {
		$.each(map, function(i, slot) {
			console.log(slot);
			var $day = $("#" + slot.date);
			$day.prepend('<div class="slot gridtop-' + parseInt(slot.start)+ ' gridheight-'
				+ parseInt(slot.duration) + ' heatmap-' + parseInt(slot.level) + '"></div>');
		})
	};

	var drawGrid = function(date) {
		var $holder = $("#grid-holder"),
		    $column = $('<div class="grid-column" id="' + date + '"></div>');
		for (var i = 0; i < 25; ++i) {
			$column.append('<div class="grid hour">&nbsp;</div>');
		}
		$holder.append($column);
	}

	drawGrid("2014-02-10");
	drawGrid("2014-02-11");
	drawGrid("2014-02-12");
	drawGrid("2014-02-13");
	drawGrid("2014-02-14");
	drawHeatmap(heatmap);
});