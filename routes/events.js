var crypto = require('crypto');

/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('events');
  Event.findOne({ eventId: eventId }, function(error, record) {
    res.render("event", { eventId: eventId });
  });
};

exports.getHeatmap = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('events');
  Event.findOne({ eventId: eventId }, function(error, record) {
    /*
		{
			"date": "2014-02-11",
			"start": "30",
			"duration": "2",
			"level": 1,
			"count": 2
		},
    */
    res.json(record);
  });
};

exports.getSlot = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('events');

  Event.findOne({ eventId: eventId }, function(error, record) {
    for (var i = 0; i < record.participants.length; ++i) {
      if (record.participants[i].personId === id) {
        res.json(record.participants[i].slot);
      }
    }
  });
};

/*
 * AJAX get event list given user's ID
 */

exports.listEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var Event = req.app.get('models')('events');
  Event.find({ 'participants.personId': id },
    function(error, record) {
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
  var newEvent = new Event(data);
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
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var slot = req.body.slot;

  var Event = req.app.get('models')('events');
  Event.update(
    { eventId: eventId, "participants.personId": id },
    { $set: { "participants.$.slot": slot } },
    function(error) {
      if (error) {
        console.log(error);
      }
      res.json("");
    }
  );
};
