
/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var eventId = req.params.eventId;
  var Event = req.app.get('models')('events_model');
  Event.find({ eventId: eventId }, function(error, record) {
    res.json(record);
  });
};

/*
 * AJAX get event list given user's ID
 */

exports.eventList = function(req, res) {
  var personId = req.params.personId;
  var Event = req.app.get('models')('events_model');
  Event.find({ 'participants.personId': personId },
    function(error, record) {
      res.json(record);
    }
  );
};

/*
 * AJAX new event
 */

exports.create = function(req, res) {
  var data = req.body;
  var Event = req.app.get('models')('events_model');
  var newEvent = new Event(data);
  newEvent.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.json("");
  });
};

/*
 * AJAX update slot
 */

exports.updateSlot = function(req, res) {
  var eventId = req.body.eventId;
  var personId = req.body.personId;
  var slot = req.body.slot;

  var Event = req.app.get('models')('events_model');
  Event.update(
    { eventId: eventId, "participants.personId": personId },
    { $set: { "participants.$.slot": slot } },
    function(error) {
      if (error) {
        console.log(error);
      }
      res.json("");
    }
  );
};
