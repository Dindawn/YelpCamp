var express	= require('express');
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//=================
// Comments routs
//=================
//Show new comment form
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground){ // Find campground by ID
		if(err){
			console.log(err);
		} else {
			res.render('comments/new', {campground: campground});
		}
	});
});

//CREATE - Add new comment
router.post("/", middleware.isLoggedIn, function(req, res){
Campground.findById(req.params.id, function(err, campground){ // Lookup campground using ID
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){ // Create new comment
				if(err){
					req.flash("error", "Somthing went wrong :(");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					// Connect new comment to campground
					campground.comments.push(comment._id); /// FIX XXX: 'comment._id' --not 'comment' like Ian XXXX
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id); // Redirect
				  }
			});	
		}
	});
});

// Comment Edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			req.flash('error', 'Sorry, Comment not found');
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
	});
});

// Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err, foundCampground){
		if(err){
			res.redirect("back");
		} else {
				req.flash("success", "Comment deleted");
				res.redirect("/campgrounds/" + req.params.id);
			}
	});
});


module.exports = router;