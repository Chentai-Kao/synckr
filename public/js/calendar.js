$(function() {
  var slotID = 0;

  $("#overlay-toggle").click(function(){
    var $slot = $(".data");
    $.each($slot, function(i, s){
      if($(s).hasClass("clicked")){
        $(s).removeClass("clicked");
        $(s).find(".count").remove();
      }
      else{
        $(s).addClass("clicked");
        var level = $(s).attr("count");
        $(s).append("<p class='count'>"+level+"</p>");
      }
    })
  });

  $("#nav-right").click(function(){
    var data = [];
    $.each($(".draw"), function(i, d) {
      var $d = $(d);
      data.push({
        "startDate": $d.parent().attr("id"),
        "startTime": parseInt($d.attr("start")),
        "duration": parseInt($d.attr("end")) - parseInt($d.attr("start")) + 1
      });
    });
    $.post(
      "/events/" + $("meta[name=eventId]").attr("content") + "/slots",
      { slot: data }
    );
  });

  var drawSlot = function(slots) {
    $.each(slots, function(i, slot) {
      var $day = $("[id='" + slot.startDate + "']");
      var startTime = parseInt(slot.startTime);
      var duration = parseInt(slot.duration);
      $slot = $('<p id="slot-' + (++slotID) + '" class="slot draw gridtop-' +
        startTime + ' gridheight-' + duration + '" start="' + startTime +
        '" end="' + (startTime + duration - 1) + '"></p>'
      );
      $day.prepend($slot);
      blockHookup($slot);
    })
  };

  var drawHeatmap = function(map) {
    var maxCount = 0;
    $.each(map, function(date, slots) {
      $.each(slots, function(i, slot) {
        var count = parseInt(slot.count);
        if (count > maxCount) {
          maxCount = count;
        }
      });
    });

    maxCount--;
    $.each(map, function(date, slots) {
      var $day = $("[id='" + date + "']");
      $.each(slots, function(i, slot) {
        $day.prepend(
          '<p class="slot data gridtop-' + parseInt(slot.startTime) +
          ' gridheight-' + parseInt(slot.duration) +
          ' heatmap-' + Math.ceil((parseInt(slot.count)-1) / maxCount * 4 + 1) +
          '" count="' + parseInt(slot.count) + '"></p>'
        );
      });
    });
  };

  var drawGrid = function(date) {
    var $holder = $("#grid-stretch"),
        $column = $('<div class="grid-column" id="' + date + '"></div>');
    for (var i = 0; i < 26; ++i) {
      $column.append('<div class="grid hour">&nbsp;</div>');
    }
    $holder.append($column);
  }

  var scrollHookup = function() {
    var $handle = $("#handle-bar"),
        $scroll = $("#scroll-pane"),
        mouseMove = false,
        starty, mousey;

    $handle.on("touchstart", function(e) {
      mouseStart = true;
      starty = $scroll.scrollTop();
      mousey = e.originalEvent.touches[0].pageY;
      e.preventDefault();

      var touchmove = function(e) {
        if (!mouseStart) return false;
        $scroll.scrollTop(starty - (e.originalEvent.touches[0].pageY - mousey));
        e.preventDefault();
      };

      var touchend = function(e) {
        mouseStart = false;
        $(document).off("touchmove", touchmove).off("touchend", touchend);
      };

      $(document).on("touchmove", touchmove).on("touchend", touchend);
    }).click(function(e) {
      e.stopImmediatePropagation();
      return false;
    });
  };

  var dayHookup = function() {
    var $handle = $("#day-scroll"),
        $scrollTop = $("#day-scroll"),
        $scrollBottom = $("#grid-holder"),
        mouseMove = false,
        startx, mousex;

    $handle.on("touchstart", function(e) {
      mouseStart = true;
      startx = $scrollTop.scrollLeft();
      mousex = e.originalEvent.touches[0].pageX;
      e.preventDefault();

      var touchmove = function(e) {
        if (!mouseStart) return false;
        $scrollTop.scrollLeft(startx - (e.originalEvent.touches[0].pageX - mousex));
        $scrollBottom.scrollLeft(startx - (e.originalEvent.touches[0].pageX - mousex));
        e.preventDefault();
      };

      var touchend = function(e) {
        mouseStart = false;
        $(document).off("touchmove", touchmove).off("touchend", touchend);
      };

      $(document).on("touchmove", touchmove).on("touchend", touchend);
    }).click(function(e) {
      e.stopImmediatePropagation();
      return false;
    });
  };

  var ygrid = function(y) {
    return Math.floor((y - 15) / 20) + 1;
  };
  var collide = function($column, y1, y2, starty) {
    // console.log($column, y1, y2);
    $.each($column.find(".draw:not(.drawing)"), function(i, s) {
      var $s = $(s),
          s1 = parseInt($s.attr("start")), s2 = parseInt($s.attr("end"));
      // console.log($s, s1, s2);
      if (y1 >= s1 && y1 <= s2) y1 = s2 + 1;
      if (y2 >= s1 && y2 <= s2) y2 = s1 - 1;
      if (y1 <= s1 && y2 >= s2) {
        if (starty == y1) {
          y2 = s1 - 1;
        } else {
          y1 = s2 + 1;
        }
      }
    });
    return [y1, y2];
  };

  var slotHookup = function() {
    var $column = $(".grid-column"),
        mouseMove = false,
        starty, mousey,
        drawSlot = function(y1, y2) {
          var my = y1;
          if (y1 > y2) {
            var tmp = y2;
            y2 = y1;
            y1 = tmp;
          }
          var $slot = $("#slot-" + slotID), $col = $slot.parent();
          $slot.addClass("drawing");
          var g1 = ygrid(y1), g2 = ygrid(y2);
          var col = collide($col, g1, g2, ygrid(my));
          g1 = col[0];
          g2 = col[1];
          if (g1 < 1) g1 = 1;
          if (g2 > 48) g2 = 48;
          $slot.removeClass().addClass("slot draw gridtop-" + g1 +
            " gridheight-" + (g2 - g1 + 1)).attr("start", g1).attr("end", g2);
        };

    $column.on("touchstart", function(e) {
      console.log("column drag start");
      slotID++;
      mouseStart = true;
      var parentOffset = $(this).parent().offset();
      mousey = e.originalEvent.touches[0].pageY - parentOffset.top;
      var gy = ygrid(mousey), col = collide($(this), gy, gy, gy);
      console.log(col, gy);
      if (col[0] != gy) return;
      e.preventDefault();

      var $slot = $('<p id="slot-' + slotID + '"></p>');
      blockHookup($slot);
      $(this).prepend($slot);
      drawSlot(mousey, mousey);

      var touchmove = function(e) {
        if (!mouseStart) return false;
        var currenty = e.originalEvent.touches[0].pageY - parentOffset.top;
        drawSlot(mousey, currenty);
        e.preventDefault();
      };

      var touchend = function(e) {
        mouseStart = false;
        $(document).off("touchmove", touchmove).off("touchend", touchend);
      };

      $(document).on("touchmove", touchmove).on("touchend", touchend);
    }).click(function(e) {
      e.stopImmediatePropagation();
      return false;
    });
  };

  var blockHookup = function($block) {
    var mouseMove = false,
        starty, mousey,
        drawSlot = function($block, y, fixed) {
          var gy = ygrid(y), start = parseInt($block.attr("start")),
              end = parseInt($block.attr("end"));
          console.log(fixed);
          if (!fixed) {
            fixed = (gy == start) ? end : start;
          }
          var g1 = (gy > fixed) ? fixed : gy,
              g2 = (gy > fixed) ? gy : fixed;
          $block.addClass("drawing");
          var col = collide($block.parent(), g1, g2, fixed);
          g1 = col[0];
          g2 = col[1];
          if (g1 < 1) g1 = 1;
          if (g2 > 48) g2 = 48;
          console.log(gy, start, end, g1, g2, fixed);
          $block.removeClass().addClass("slot draw gridtop-" + g1 +
            " gridheight-" + (g2 - g1 + 1)).attr("start", g1).attr("end", g2);
          return fixed;
        };

    $block.on("touchstart", function(e) {
      console.log("touch start at slot");
      mouseStart = true;
      var that = $(this), parentOffset = $(this).parent().offset();

      var y = e.originalEvent.touches[0].pageY - parentOffset.top;
      if (ygrid(y) != parseInt(that.attr("start")) &&
          ygrid(y) != parseInt(that.attr("end"))) return;
      var fixed = drawSlot(that, y, false);

      var touchmove = function(e) {
        if (!mouseStart) return false;
        drawSlot(that, e.originalEvent.touches[0].pageY - parentOffset.top, fixed);
        e.preventDefault();
      };

      var touchend = function(e) {
        mouseStart = false;
        $(document).off("touchmove", touchmove).off("touchend", touchend);
      };

      $(document).on("touchmove", touchmove).on("touchend", touchend);
    }).hammer().on("tap", function(e) {
      e.stopImmediatePropagation();
    }).hammer().on("doubletap", function(e) {
      $(this).remove();
      e.stopImmediatePropagation();
    });
  }

  var FTUE = function(){
    var clicks = 0
    var dragAnimate = function(){
      $("#mask-drag-move").css("top", '0px');
      $("#mask-drag-move").animate({
        top:$("#mask-drag-move").height()
        }, 700, function(){ setTimeout(function() {dragAnimate();}, 500)}
      );
    };

    $("#mask").show();
    $(".mask-scroll").show();
    $("#mask").click(function(e){
      if (clicks == 0){
        $(".mask-scroll").hide();
        $(".mask-drag-frame").show();
        dragAnimate();
        clicks++;
      }
      else if (clicks == 1){
        $(".mask-drag-frame").hide();
        $(".mask-double-click").show();
        $("#mask-drag-move").stop();
        clicks++;
      }
      else if (clicks == 2){
        $(".mask-double-click").hide();

        $("#mask-slot-1").addClass("heatmap-1");
        $("#mask-slot-2").addClass("heatmap-3");
        $("#mask-slot-3").addClass("heatmap-5");
        $("#heat-level-1").addClass("heatmap-1");
        $("#heat-level-2").addClass("heatmap-2");
        $("#heat-level-3").addClass("heatmap-3");
        $("#heat-level-4").addClass("heatmap-4");
        $("#heat-level-5").addClass("heatmap-5");

        $(".mask-heatmap").show();

        clicks++;
      }
      else if(clicks == 3){
        $(".mask-heatmap").hide();
        $(".mask-tap").show();
        clicks++;
      }
      else if(clicks == 4){
        $(".mask-tap").hide();
        $("#mask").hide();
        clicks++;
      }
    });
  }

  var showDay = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var showMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'Mar', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var startDate = new Date($("meta[name=startDate]").attr("content"));
  var endDate = new Date($("meta[name=endDate]").attr("content"));
  $("#month").html(showMonth[startDate.getMonth()]);
  for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    $("#day-stretch").append('<div class="day"><div class="date">' + d.getDate()
      + '</div><div class="date-day">' + showDay[d.getDay()] + '</div>');
    drawGrid(d);
  }
  $.get(
    "/events/" + $("meta[name=eventId]").attr("content") + "/heatmap",
    drawHeatmap
  );
  $.get(
    "/events/" + $("meta[name=eventId]").attr("content") + "/slots",
    drawSlot
  );

  $("#scroll-pane").scrollTop(360);
  scrollHookup();
  dayHookup();
  slotHookup();
  //FTUE();
});

