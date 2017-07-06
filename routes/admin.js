var mongoose = require( 'mongoose' );
var Project  = mongoose.model( 'Project' );
var Media = mongoose.model( 'Media' );
var Video = mongoose.model( 'Video' );
var marked = require('marked');
var path = require('path');
var fs = require('fs');



exports.index = function(req, res){
  Project.find().sort("position").exec( function ( err, projects, count ){
    res.render( 'admin/index', {
        title : 'Lisa Truttmann | Admin',
        projects : projects
    });
  });
};  

exports.create = function ( req, res ){
  
  new Project({
    title       : req.body.title, 
    name        : req.body.title,
    name2       : req.body.title,
    current     : req.params.id
  }).save( function( err, project, count ){
    res.redirect( '/admin/edit/' + project._id);
  });
};

exports.now = function ( req, res ){
  Project.find().sort("position").exec( function ( err, projects, count ){
    res.render( 'admin/now', {
        title : 'Lisa Truttmann | Admin',
        projects : projects,
        currentProjectId : req.params.id
    });
  });
}
exports.addNow = function ( req, res ){
  new Project({
    title       : "now" + new Date().toISOString(),
    current     : req.params.id,
    nowVersion  : true
  }).save( function( err, project, count ){
    res.redirect( '/admin/edit/now');
  });
}
exports.editNow = function ( req, res ){
  Project.find().sort("position").exec( function ( err, projects ){
    res.render( 'admin/now', {
        title   : 'Admin : Lisa Truttmann',
        projects   : projects,
        currentProjectId : req.params.id
    });
  });
}


exports.delete = function ( req, res ){
  Project.findById( req.params.id, function ( err, project ){
    project.remove( function ( err, project ){
      res.redirect( '/admin' );
    });
  });
};

exports.deleteMedia = function( req, res){
  Project.findById( req.params.id, function ( err, project ){
    var thisMedia = project.media.id(req.params.imgid);
    var mediaToDelete = thisMedia.filePath; 
    thisMedia.remove();
    fs.unlink(mediaToDelete, function (err){
      if (err) {return next(err)} 
    });
    project.save( function ( err, project ){
      res.redirect( '/admin/edit/' + req.params.id);
    });
  });
}
exports.deleteVideo = function( req, res){
  Project.findById( req.params.id, function ( err, project ){
   
    project.video.id(req.params.vidid).remove();

    project.save( function ( err, project ){
      res.redirect( '/admin/edit/' + req.params.id);
    })
  });
}

exports.edit = function ( req, res ){
  Project.find().sort("position").exec( function ( err, projects ){
    res.render( 'admin/edit', {
        title   : 'Admin : Lisa Truttmann',
        projects   : projects,
        currentProjectId : req.params.id
    });
  });
};

exports.update = function ( req, res ){
  Project.findById( req.params.id, function ( err, project ){
    project.title               = req.body.title,
    project.name                = req.body.name,
    project.name2                = req.body.name2,
    project.description         = marked(req.body.descriptionSource),
    project.translation         = marked(req.body.translationSource),
    project.descriptionSource   = req.body.descriptionSource,
    project.translationSource   = req.body.translationSource,
    project.descriptionVersion.push(req.body.descriptionSource),
    project.translationVersion.push(req.body.translationSource),
    project.category            = req.body.category,
    project.visible             = req.body.visible;
    project.save( function ( err, project, count ){
      res.redirect( '/admin/edit/' + req.params.id );
    });
  });
};



exports.media = function ( req, res, next ){

 
  Project.findById( req.params.id, function ( err, project ) {
    var file = req.files.file;
    
    // code to handle file here:
    // file should already be in the right location
    // The path, this file has been saved at should be:
    //file.path;
    // To get only the filename of this path:
    var filename = path.basename(file.path);
    console.log(file);
    // First make sure that media is actually an array, not undefined.
    if (!project.media) { project.media = [ ]; }
    // Now add the filename
    //var mediaObject = new Array({name: filename, originalName: file.name, fileSize: file.size, description: []})
    //console.log(mediaObject);
    //project.media.push(mediaObject);
    project.media.push(new Media({
      name : filename,
      originalName : file.name,
      fileSize : file.size,
      filePath : file.path
    }));
    // And save it
    project.save(function(err) {
      if (err) { return next(err); }
      res.send("success");

    });
  });
}
exports.video = function ( req, res, next){
  Project.findById( req.params.id, function ( err, project ) {
    /*var videoObject = new Array({name: req.body.name, url: req.body.url, description: req.body.description});
    project.video.push(videoObject);*/
    project.video.push(new Video({
      name : req.body.name,
      url  : req.body.url,
      description : req.body.description
    }));
    project.save( function ( err, project, count ){
      res.redirect( '/admin/edit/' + req.params.id );
    });
  });  
}

exports.projectsort = function ( req, res, next) {
  Project.find().exec(function (err, project){
    project.forEach(function(project){
      project.position = req.body['position' + project.id];
      project.save();
    });
    /*project.sort(function(a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0
    });*/
    res.send("success");
      
    
  });

  

}

exports.imgedit = function ( req, res, next ){
  Project.findById( req.params.id, function ( err, project ){
    project.media.forEach(function(media) {
      media.position = req.body['position' + media.id];
      var description = req.body['imgDescription' + media.id];
      if (description !== undefined) {
        media.description = description;
      }
    });

    project.media.sort(function(a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0
    });

    project.save( function ( err, project, count){
      if (req.xhr) {
        res.send("success");
      }
      else {
        res.redirect('/admin/edit/' + req.params.id);
      }
    });
  });

};

exports.videdit = function ( req, res, next ){
  Project.findById( req.params.id, function ( err, project ){
    project.video.forEach(function(video) {
      video.position = req.body['position' + video.id];
      //var description = req.body['imgDescription' + video.id];
      /*if (description !== undefined) {
        video.description = description;
      }*/
    });

    project.video.sort(function(a, b) {
      if (a.position < b.position) return -1;
      else if (a.position > b.position) return 1;
      else return 0
    });

    project.save( function ( err, project, count){
      if (req.xhr) {
        res.send("success");
      }
      else {
        res.redirect('/admin/edit/' + req.params.id);
      }
    });
  });

};


