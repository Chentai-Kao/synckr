
/*
 * AJAX new event
 */

exports.create = function(req, res) {
  var data = req.body;
  var Event = req.app.get('models')('events');
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
