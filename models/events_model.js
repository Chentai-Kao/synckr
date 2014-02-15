var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var slotSchema = new Schema({
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  duration:  { type: String, required: true }
});

var participantSchema = new Schema({
  name:     { type: String, required: true },
  personId: { type: String, required: true },
  slot:     [slotSchema]
});

var eventSchema = new Schema({
  title:        { type: String, trim: true, required: true },
  description:  { type: String, trim: true },
  startDate:    { type: String, required: true },
  endDate:      { type: String, required: true },
  deadline:     { type: String, required: true },
  duration:     { type: String, required: true },
  eventId:      { type: String, required: true },
  participants: { type: [participantSchema], required: true }
});

module.exports = mongoose.model('events', eventSchema);

// Example:
/*
$.post('/newevent', {
  title: 'Event 0',
  description: 'testing',
  startDate: "2014-02-11",
  endDate: "2014-02-14",
  deadline: "2014-02-10",
  duration: "2",
  eventId: "123",
  participants: [
    { personId: "123456", name: "Andrew Liu", slot: [
        { startDate: '2014-02-12', startTime: '2', duration: '3' },
        { startDate: '2014-02-13', startTime: '4', duration: '1' }
      ]
    },
    { personId: "654321", name: "Andrew Ng", slot: [
        { startDate: '2014-02-12', startTime: '2', duration: '1' }
      ]
    },
    { personId: "123123", name: "Andrew Luck", slot: [
        { startDate: '2014-02-13', startTime: '3', duration: '3' },
        { startDate: '2014-02-14', startTime: '3', duration: '3' }
      ]
    }
  ]
});

$.post('/updateslot', {
  eventId: "123",
  personId: "123456",
  slot: [
    { startDate: '2014-02-13', startTime: '2', duration: '3' },
    { startDate: '2014-02-14', startTime: '4', duration: '1' }
  ]
});
*/
