
/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var eventId = req.params.eventId;
  var Event = req.app.get('models')('events_model');
  Event.find({ _id: eventId }, function(error, record) {
    res.json(record);
  });
};

/*
 * AJAX get event list given user's Facebook ID
 */

exports.eventList = function(req, res) {
  var facebookId = req.params.facebookId;
  var Event = req.app.get('models')('events_model');
  Event.find({ 'participants.facebookId': facebookId },
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
  var newEvent = new Event({
    title: data.title,
    description: data.description,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    deadline: new Date(data.deadline),
    duration: data.duration,
    participants: data.participants
  });
  newEvent.save(function(error) {
    if (error) {
      console.log(error);
    }
  });
};

/*
 * AJAX add slot
 */

exports.addSlot = function(req, res) {
  var eventId = req.params.eventId;
  var facebookId = req.params.facebookId;
  var data = req.body;

  var Event = req.app.get('models')('events_model');
  Event.update({ _id: eventId, 'participants.facebookId': facebookId },
    { $push: { 'participants.0.slot': data } },
    function(error) {
      if (error) {
        console.log(error);
      }
    }
  );
    /*
  newEvent.save(function(error) {
    if (error) {
      console.log(error);
    }
  });
  */
};
