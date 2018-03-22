var express	= require('express');
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//Index - show all campgrounds
router.get('/', function(req, res) {
  Campground.find({}, function(err, allCampgrounds){
	  if (err){
	    console.log(err);
	  } else {
	    res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
	  }
  });	
});

//NEW - show form to add new camp
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

//CREATE - add new camp to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
	var price = req.body.price;
  var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
  var newCampground = {name: name, price: price, image: image, description: desc, author: author};
  Campground.create(newCampground, function(err, newlyCreated){
	  if (err){
	    console.log(err);
	  } else {
	    res.redirect('/campgrounds');
	  }
  }); 
});

//SHOW - show more info for each specific campground
router.get("/:id", function(req, res){
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
			if(err || !foundCampground){
				console.log(err);
				req.flash('error', 'Sorry, that campground does not exist!');
				res.redirect('back');
			} else{
				res.render("campgrounds/show", {campground: foundCampground});
				}
		});
});

// Edit campground Route
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){	
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// Update campground Route
router.put("/:id", middleware.checkCampOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
	});
});

// Destroy campground route
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
				res.redirect("/campgrounds/");
			}
	});
});


module.exports = router;