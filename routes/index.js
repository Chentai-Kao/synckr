
/*
 * GET home page.
 */


exports.view = function(req, res){
  var mongoose = req.app.get('mongoose');
  var kittySchema = mongoose.Schema({
        name: String
  });
  // NOTE: methods must be added to the schema before compiling it with mongoose.model()
  kittySchema.methods.speak = function () {
    var greeting = this.name
      ? "Meow name is " + this.name
      : "I don't have a name"
      console.log(greeting);
  }

  var Kitten = mongoose.model('Kitten', kittySchema)
  var silence = new Kitten({ name: 'Silence' });
  var fluffy = new Kitten({ name: 'fluffy' });
  fluffy.speak() // "Meow name is fluffy"
  fluffy.save(function (err, fluffy) {
    if (err) { // TODO handle the error
      console.log('Error saving fluffy');
    }
    fluffy.speak();
    Kitten.find(function (err, kittens) {
      if (err) { // TODO handle err
        console.log('Error finding');
      }
      console.log(kittens)
    })
  });

  res.render('index', {
    'projects': [
      { 'name': 'Waiting in Line',
        'image': 'lorempixel.people.1.jpeg',
        'id': 'project1'
      },
      { 'name': 'Needfinding',
        'image': 'lorempixel.city.1.jpeg',
        'id': 'project2'
      },
      { 'name': 'Prototyping',
        'image': 'lorempixel.technics.1.jpeg',
        'id': 'project3'
      },
      { 'name': 'Heuristic Evaluation',
        'image': 'lorempixel.abstract.1.jpeg',
        'id': 'project4'
      },
      { 'name': 'Visualization',
        'image': 'lorempixel.abstract.8.jpeg',
        'id': 'project5'
      },
      { 'name': 'Social design',
        'image': 'lorempixel.people.2.jpeg',
        'id': 'project6'
      },
      { 'name': 'Gestural interaction',
        'image': 'lorempixel.technics.2.jpeg',
        'id': 'project7'
      },
      { 'name': 'Design tools',
        'image': 'lorempixel.city.2.jpeg',
        'id': 'project8'
      }
    ]  
  });
};
