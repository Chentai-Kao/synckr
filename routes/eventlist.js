
/*
 * AJAX get event list given user's Facebook ID
 */

exports.get = function(req, res) {
  var facebookId = req.params.facebookId;
  var Event = req.app.get('models')('events');
  Event.find({ 'participants.facebookId': facebookId },
    function(error, record) {
      res.json(record);
    }
  );
};
