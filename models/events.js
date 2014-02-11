var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    deadline: Date,
    duration: String,
    participants: [String]
});

module.exports = mongoose.model('events', eventSchema);
