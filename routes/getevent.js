
/*
 * AJAX get event given event ID
 */

exports.get = function(req, res) {
  var eventId = req.params.eventId;
  var Event = req.app.get('models')('events');
  Event.find({ _id: eventId }, function(error, record) {
    res.json(record);
  });
};
