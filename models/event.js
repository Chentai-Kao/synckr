var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SlotSchema = new Schema({
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  duration:  { type: String, required: true }
});

var ParticipantSchema = new Schema({
  name:     { type: String, required: true },
  personId: { type: String, required: true },
  slot:     [SlotSchema]
});

var EventSchema = new Schema({
  title:        { type: String, trim: true, required: true },
  description:  { type: String, trim: true },
  startDate:    { type: String, required: true },
  endDate:      { type: String, required: true },
  deadline:     { type: String, required: true },
  duration:     { type: String, required: true },
  eventId:      { type: String, required: true },
  participants: { type: [ParticipantSchema], required: true },
  host:         { type: {
                    name:     { type: String, required: true },
                    personId: { type: String, required: true }
                  }, required: true},
  decision:     { type: {
                    startDate: { type: String, required: true },
                    startTime: { type: String, required: true },
                    duration:  { type: String, required: true }
                  } }
});

EventSchema.methods.getType = function() {
  var now = new Date();
  if (now > this.deadline && typeof this.decision !== "undefined") {
    return 'done';
  } else if (now > this.deadline && typeof this.decision === "undefined") {
    return 'pending';
  } else {
    return 'ongoing';
  }
};

EventSchema.methods.genHeatmap = function(id) {
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
  };

  var slotByDate = createSlotByDate(this);
  return createSortedSlot(slotByDate);
};

module.exports = mongoose.model('event', EventSchema);
