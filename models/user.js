var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  fb_id:       { type: String, required: true },
  fb_name:     { type: String, required: true },
  firstUse:    { type: Boolean, required: true },
  firstDecide: { type: Boolean, required: true }
});

module.exports = mongoose.model('users', UserSchema);