const Reviews=require("../models/reviewSchema.js");
const Listing=require('../models/listing.js');

module.exports.createReview=(async(req,res)=>{
    let {id}=req.params;
    
    let listing=await Listing.findById(id);
    let newReview=new Reviews(req.body.review)
    newReview.author=req.user._id;

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
		req.flash("success","New Review Added Successfully!");
    //  console.log(newReview);
    //  console.log(listing);
     res.redirect(`/listings/${listing._id}`);
});

module.exports.destroyReview=(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate( id,{$pull: { reviews:reviewId } } );
    await Reviews.findByIdAndDelete(reviewId);
	req.flash("error","Review deleted Successfully!");

    res.redirect(`/listings/${id}`);

})