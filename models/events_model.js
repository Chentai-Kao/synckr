var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var slotSchema = new Schema({
  startDate: { type: String, required: true },
  startTime: { type: String, required: true },
  duration:  { type: String, required: true }
});

var participantSchema = new Schema({
  name:       { type: String, required: true },
  facebookId: { type: String, required: true },
  slot:       [slotSchema]
});

var eventSchema = new Schema({
  title:        { type: String, trim: true, required: true },
  description:  { type: String, trim: true },
  startDate:    { type: String, required: true },
  endDate:      { type: String, required: true },
  deadline:     { type: String, required: true },
  duration:     { type: String, required: true },
  participants: { type: [participantSchema], required: true }
});

module.exports = mongoose.model('events', eventSchema);
