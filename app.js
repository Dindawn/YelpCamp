var express     	= require('express'),
    app        	 	= express(), 
    bodyParser  	= require('body-parser'),
    mongoose    	= require("mongoose"),
		passport    	= require("passport"),
		LocalStrategy = require("passport-local"),
		methodOverride = require("method-override"),
		flash					= require("connect-flash"),
		Campground  	= require("./models/campground"),
		Comment  			= require("./models/comment"),
		User					= require("./models/user"),
		seedDB      	= require("./seeds");

// Requring routes
var campgroundRoutes = require("./routes/campgrounds"),
		commentRoutes    = require("./routes/comments"),
		indexRoutes			 = require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp_v12"); // !!!! v12 DB !!!!!
mongoose.connect("mongodb://aadb:azsxdc@ds223609.mlab.com:23609/yelpcamp1"); 

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB(); // seed the database 

// Passport configuration
app.use(require("express-session")({
	secret: "Once again just nothing",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// =====================================
app.get('*', function(req, res) {
  res.send('Wrong place to be!!!');
});

app.listen(process.env.PORT || 3000, function() {
  console.log('Server listening on port 3000');
});