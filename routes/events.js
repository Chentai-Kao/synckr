
/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var eventId = req.params.eventId;
  var Event = req.app.get('models')('events');
  Event.find({ eventId: eventId }, function(error, record) {
    res.json(record);
  });
};

/*
 * AJAX get event list given user's ID
 */

exports.listEvent = function(req, res) {
  console.log(req.session);
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var Event = req.app.get('models')('events');
  Event.find({ 'participants.personId': id },
    function(error, record) {
      res.json(record);
    }
  );
};

/*
 * AJAX new event
 */

exports.createEvent = function(req, res) {
  var data = req.body;
  var Event = req.app.get('models')('events');
  var newEvent = new Event(data);
  newEvent.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.json("");
  });
};

exports.updateEvent = function(req, res) {
  // TODO
};

/*
 * AJAX update slot
 */

exports.updateSlot = function(req, res) {
  var eventId = req.body.eventId;
  var personId = req.body.personId;
  var slot = req.body.slot;

  var Event = req.app.get('models')('events');
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
