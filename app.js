
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , flash = require('connect-flash');

var app = express();

require('./models/project');

app.enable('trust proxy')

app.configure(function(){
  app.set('port', process.env.PORT || 60990);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({keepExtensions: true, uploadDir: __dirname + '/public/uploads'}));
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(flash());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
  app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
});

var routes = require('./routes');

app.configure('development', function(){
  app.use(express.errorHandler());
});

function checkAuth(req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/login");
    console.log("wrong");
  } else {
    next();
  }
}

app.all("/admin", checkAuth);
app.all("/admin/*", checkAuth);
app.get('/', routes.index);
app.get('/project/:id', routes.project);
app.get('/users', user.list);
app.get('/login', routes.login);
app.post('/login/authenticate', function (req, res) {
  var post = req.body;
  if (post.user == 'admin' && post.password == 'lisaweb2013') {
    req.session.user_id = "admin";
    res.redirect('/admin');
  } else {
    req.flash('info', 'Wrong login/password');
    req.flash('class', 'wrong');
    
    res.redirect('/login');
  }
});
//app.get('/admin/authenticate', routes.admin.authenticate);
app.get('/admin', routes.admin.index);
app.post( '/admin/create', routes.admin.create );
app.get( '/admin/delete/:id', routes.admin.delete );
app.get( '/admin/delete_media/:id/:imgid', routes.admin.deleteMedia );
app.get( '/admin/delete_video/:id/:vidid', routes.admin.deleteVideo );
app.get( '/admin/now', routes.admin.now );
app.get( '/admin/edit/now/:id', routes.admin.editNow );
app.get( '/admin/edit/now/add', routes.admin.addNow );

app.get( '/admin/edit/:id', routes.admin.edit );
app.post( '/admin/update/:id', routes.admin.update );
app.post( '/admin/media/:id', routes.admin.media);
app.post( '/admin/video/:id', routes.admin.video);
app.post( '/admin/projectsort/:id', routes.admin.projectsort);
app.post( '/admin/imgedit/:id', routes.admin.imgedit);
app.post( '/admin/videdit/:id', routes.admin.videdit);
app.get('/logout', function (req, res) {
  delete req.session.user_id;
  res.redirect('/login');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
