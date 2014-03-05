var crypto = require('crypto');

/*
 * AJAX get event given event ID
 */

exports.getEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('event');
  Event.findOne({ eventId: eventId }, function(error, record) {
    if (record) {
      res.render("event", {
        theme: req.session.theme,
        eventId: eventId,
        eventType: record.getType(),
        allVoted: record.allVoted(),
        notVoted: record.notVoted(id),
        notDecided: record.notDecided(id),
        startDate: record.startDate,
        endDate: record.endDate,
        firstUse: req.session.first_use,
        firstDecide: req.session.first_decide
      });
    } else {
      res.send(404);
    }
  });
};

exports.getHeatmap = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('event');
  Event.findOne({ eventId: eventId }, function(error, record) {
    if (record) {
      var self = req.query.self || false;
      res.json(record.genHeatmap(id, self));
    } else {
      res.send(404);
    }
  });
};

exports.getSlot = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('event');

  Event.findOne({ eventId: eventId }, function(error, record) {
    if (record) {
      for (var i = 0; i < record.participants.length; ++i) {
        if (record.participants[i].personId === id) {
          return res.json(record.participants[i].slot);
        }
      }
    } else {
      res.send(404);
    }
  });
};

/*
 * AJAX get event list given user's ID
 */

exports.listEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var Event = req.app.get('models')('event');
  Event.find({ 'participants.personId': id },
    function(error, record) {
      record.sort(function(a, b) {
        var acode = 2, bcode = 2;
        if (a.notDecided(id) && a.isPending()) acode = 1;
        if (a.notVoted(id) && a.isOngoing()) acode = 0;
        if (b.notDecided(id) && b.isPending()) bcode = 1;
        if (b.notVoted(id) && b.isOngoing()) bcode = 0;
        return (acode + a.deadline) > (bcode + b.deadline);
      });
      res.render('list', {
        theme: req.session.theme,
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

  res.render("new", {theme: req.session.theme});
}

exports.createEvent = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var data = req.body;
  data.eventId = crypto.randomBytes(20).toString('hex');
  //data.participants = data.participants || [];
  data.participants = [
    {
      "name" : "Andrew Liu",
      "personId" : "766485187",
    },
    {
      "name" : "Jocelin Ho",
      "personId" : "100000010285733",
    }
  ];
  // add myself as participant
  data.participants.push({
    name: req.session.fb_name,
    personId: req.session.fb_id
  });

  // merge hour and min to duration
  data.duration = data["duration-hr"] + data["duration-min"];
  data.host = {
    name: req.session.fb_name,
    personId: req.session.fb_id
  };

  var Event = req.app.get('models')('event');
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

  var Event = req.app.get('models')('event');
  Event.update(
    { eventId: eventId, "participants.personId": id },
    { $set: { "participants.$.slot": slot } },
    function(error) {
      if (error) console.log(error);

      var User = req.app.get('models')('user');
      console
      User.update( {fb_id: id}, {$set: {firstUse: false}}, function(error) {
        console.log("Updated: not first time");
        req.session.first_use = false;
        if (error) console.log(error);
        res.json("");
      })
    }
  );
};

exports.decideSlot = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var decision = req.body.slot[0];

  var Event = req.app.get('models')('event');
  Event.update(
    { eventId: eventId },
    { $set: { "decision": decision } },
    function(error) {
      if (error) {
        console.log(error);
      }
      res.json("");
    }
  );
}

exports.getDecision = function(req, res) {
  var id = req.session.fb_id;
  if (!id) return res.redirect('/login');

  var eventId = req.params.id;
  var Event = req.app.get('models')('event');

  Event.findOne({ eventId: eventId }, function(error, record) {
    if (record) {
      res.json([record.decision]);
    } else {
      res.send(404);
    }
  });
};
