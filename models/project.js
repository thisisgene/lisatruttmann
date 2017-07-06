var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    mediaSchema = new Schema({
      name          : String,
      name2         : String,
      originalName  : String,
      fileSize      : Number,
      description   : String,
      position      : Number,
      filePath      : String
    });

    videoSchema = new Schema({
      name        : String,
      url         : String,
      description : String
    })

    Project = new Schema({
      title               : String,
      position            : Number, 
      name                : String,
      name2               : String,
      description         : String,
      translation         : String,
      descriptionSource   : String,
      translationSource   : String,
      descriptionVersion  : [String],
      translationVersion  : [String],
      category            : Boolean, 
      media               : [mediaSchema],
      video               : [videoSchema],
      visible             : Boolean,
      nowVersion          : Boolean
    });


mongoose.model('Project', Project);
mongoose.model('Media', mediaSchema);
mongoose.model('Video', videoSchema);

// mongoose.connect('mongodb://lisaProjects:dbL 123@localhost:20729/lisatruttmann');
mongoose.connect('mongodb://localhost/lisatruttmann');

