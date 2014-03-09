var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserClickScheme = new Schema({
	duration:    { type: String, required: true},
	type:        { type: String, required: true},
	theme:       { type: String, required: true}
});

var UserSchema = new Schema({
  fb_id:       { type: String, required: true },
  fb_name:     { type: String, required: true },
  firstUse:    { type: Boolean, required: true },
  firstDecide: { type: Boolean, required: true },
  records:     [UserClickScheme]
});

module.exports = mongoose.model('users', UserSchema);