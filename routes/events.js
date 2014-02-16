var crypto = require('crypto');

/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('events');
  Event.find({ eventId: eventId }, function(error, record) {
    res.render("event");
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
      console.log(record);
      res.render('list', {
        fb_id: req.session.fb_id,
        fb_name: req.session.fb_name,
        events: record
      });
    }
  );
};

/*
 * AJAX new event
 */

exports.createEventPage = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  res.render("new");
}

exports.createEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var data = req.body;
  data.eventId = crypto.randomBytes(20).toString('hex');
  data.participants = data.participants || [];
  data.participants.push({
    name: req.session.fb_name,
    personId: req.session.fb_id
  });
  data.duration = data["duration-hr"] + data["duration-min"];

  var Event = req.app.get('models')('events');
  console.log(data);
  var newEvent = new Event(data);
  console.log(newEvent);
  newEvent.save(function(error) {
    if (error) {
      console.log(error);
    }
    res.redirect("/events");
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
