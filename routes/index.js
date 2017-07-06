var mongoose = require( 'mongoose' );
var Project  = mongoose.model( 'Project' );
var Media = mongoose.model( 'Media' );

exports.login = function (req, res){
  res.render( 'login', {
    title : 'Login',
    fail : {message: req.flash('info'), class: req.flash('class')}
  } );
}

exports.index = function(req, res){
  Project.find().sort("position").exec( function ( err, projects, count ){
    var currentProject = projects.filter(function(projects) { return projects.title == "now" && projects.category == true; })[0];
    if (currentProject !== undefined && currentProject.visible == true) {  
      res.render( 'project', {
          title : 'now : Lisa Truttmann',
          projects : projects,
          currentProject : currentProject
      });
    }
    else {
      res.render( 'index', {
          title : 'Lisa Truttmann',
          projects : projects
      });
    };
  });
};

exports.project = function(req, res){
  Project.find().sort("position").exec(function ( err, projects ){
    var currentProject = projects.filter(function(projects) { return projects._id == req.params.id; })[0];
    res.render( 'project', {
        title   : ' Lisa Truttmann',
        projects : projects,
        currentProject : currentProject
    });
  });

};

exports.admin = require('./admin');
