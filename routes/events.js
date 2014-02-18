var crypto = require('crypto');

/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('events');
  Event.findOne({ eventId: eventId }, function(error, record) {
    res.render("event", {
      eventId: eventId,
      startDate: record.startDate,
      endDate: record.endDate
    });
  });
};

exports.getHeatmap = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var createSlotByDate = function(record) {
    // Given a MongoDB event document, create slot with following format:
    // slotByDate = {
    //   "2014-02-01": [
    //     {
    //       "personId": "23463452",
    //       "startTime": "23",
    //       "duration": "6"
    //     },
    //     ...
    //   ],
    //   "2014-05-02": ...
    // }
    var slotByDate = {};
    for (var i = 0; i < record.participants.length; ++i) {
      var user = record.participants[i];
      if (user.personId === id) {
        continue;
      }
      for (var j = 0; j < user.slot.length; ++j) {
        var slot = user.slot[j];
        slotByDate[slot.startDate] = slotByDate[slot.startDate] || [];
        slotByDate[slot.startDate].push({
          personId: user.personId,
          startTime: slot.startTime,
          duration: slot.duration
        });
      }
    }
    return slotByDate;
  };

  var createSortedSlot = function(slotByDate) {
    // Return the sorted slot with following format:
    // sortedSlot = {
    //   "2014-02-01": [
    //     {
    //       "startTime": "23",
    //       "duration": "6"
    //       "participants": [
    //         "23463452",
    //         "43573454"
    //       ]
    //     },
    //     ...
    //   ],
    //   "2014-05-02": ...
    // }
    var sortByStart = function(a, b) {
      // sort by start time. Break tie by duration.
      if (a.startTime < b.startTime) {
        return -1;
      } else if (a.startTime > b.startTime) {
        return 1;
      } else if (a.duration < b.duration) {
        return -1;
      } else if (a.duration > b.duration) {
        return 1;
      }
      return 0;
    };

    sortedSlot = {};
    for (var date in slotByDate) {
      if (slotByDate.hasOwnProperty(date)) {
        // sort by start and end
        var sortedStart = slotByDate[date].slice(0).sort(sortByStart);
        // bar marks each start and end point
        var bars = [];
        for (var i = 0; i < sortedStart.length; ++i) {
          var start = parseInt(sortedStart[i].startTime);
          if (bars.indexOf(start) === -1) {
            bars.push(start);
          }
          var end = parseInt(sortedStart[i].startTime) +
                parseInt(sortedStart[i].duration);
          if (bars.indexOf(end) === -1) {
            bars.push(end);
          }
        }
        bars.sort();
        // iterate through bars
        var queue = [];
        var pushQueue = function(k) {
          while (sortedStart.length > 0 &&
              parseInt(sortedStart[0].startTime) === k) {
            var slot = sortedStart.pop();
            queue.push(slot);
          }
        };
        var popQueue = function(k) {
          for (var i = 0; i < queue.length; ++i) {
            var end = parseInt(queue[i].startTime) +
                parseInt(queue[i].duration);
            if (end === k) {
              queue.splice(i, 1);
              --i;
            }
          }
        };

        pushQueue(bars[0]);
        var result = []
        // calculating slot [i-1, i]
        for (var i = 1; i < bars.length; ++i) {
          // p is the array of the participants in [i-1,i]
          var p = [];
          // add all the slots in queue to the array
          for (var j = 0; j < queue.length; ++j) {
            p.push(queue[j].personId);
          }
          // create time slot for [i-1, i]
          if (queue.length > 0) {
            result.push({
              startTime: bars[i - 1],
              duration: bars[i] - bars[i - 1],
              count: queue.length,
              participants: p
            });
          }
          // push slots which starts at i
          pushQueue(bars[i]);
          // pop slots which ends at i
          popQueue(bars[i]);
        }
        sortedSlot[date] = result;
      }
    }
    return sortedSlot;
  }

  var Event = req.app.get('models')('events');
  Event.findOne({ eventId: eventId }, function(error, record) {
    var slotByDate = createSlotByDate(record);
    var sortedSlot = createSortedSlot(slotByDate);
    res.json(sortedSlot);
  });
};

exports.getSlot = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('events');

  Event.findOne({ eventId: eventId }, function(error, record) {
    for (var i = 0; i < record.participants.length; ++i) {
      if (record.participants[i].personId === id) {
        return res.json(record.participants[i].slot);
      }
    }
  });
};

/*
 * AJAX get event list given user's ID
 */

exports.listEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var Event = req.app.get('models')('events');
  Event.find({ 'participants.personId': id },
    function(error, record) {
      res.render('list', {
        fb_id: req.session.fb_id,
        fb_name: req.session.fb_name,
        events: record
      });
    }
  );
};

/*
 * AJAX new event
 */

exports.createEventPage = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  res.render("new");
}

exports.createEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var data = req.body;
  data.eventId = crypto.randomBytes(20).toString('hex');
  //data.participants = data.participants || [];
  data.participants = [
    {
      "name" : "Andrew Liu",
      "personId" : "766485187",
      "slot" : [
        {
          "startDate" : "2014-02-10",
          "startTime" : "20",
          "duration" : "5",
        },
        {
          "startDate" : "2014-02-11",
          "startTime" : "10",
          "duration" : "15",
        }
      ]
    },
    {
      "name" : "Jocelin Ho",
      "personId" : "100000010285733",
      "slot" : [
        {
          "startDate" : "2014-02-10",
          "startTime" : "10",
          "duration" : "20",
        },
        {
          "startDate" : "2014-02-10",
          "startTime" : "20",
          "duration" : "3",
        }
      ]
    }
  ];
  // add myself as participant
  data.participants.push({
    name: req.session.fb_name,
    personId: req.session.fb_id
  });

  // merge hour and min to duration
  data.duration = data["duration-hr"] + data["duration-min"];

  console.log(data);
  var Event = req.app.get('models')('events');
  var newEvent = new Event(data);
  newEvent.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.redirect("/events");
  });
};

exports.updateEvent = function(req, res) {
  // TODO
};

/*
 * AJAX update slot
 */

exports.updateSlot = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var slot = req.body.slot;

  var Event = req.app.get('models')('events');
  Event.update(
    { eventId: eventId, "participants.personId": id },
    { $set: { "participants.$.slot": slot } },
    function(error) {
      if (error) {
        console.log(error);
      }
      res.json("");
    }
  );
};
