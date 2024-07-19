const Listing=require("./models/listing.js");
const Reviews=require("./models/reviewSchema.js");
const ExpressError=require("./utils/ExpressError.js")

const {listingSchema,ReviewSchema}=require("./schema.js");


//middleware for validate listing
module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	console.log(error);
	if (error) {
		let errorMsg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(404, errorMsg);
	} else {
		next();
	}
};

//middleware for validating reviews
module.exports.validateReviews=(req,res,next)=>{
    let {error}=ReviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errorMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errorMsg);
    }
    else{
        next();
    }

};

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){  
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{ 
    const { id } = req.params;
		let listing =await Listing.findById(id);
		if(!listing.owner.equals(res.locals.currUser._id)){
			req.flash("error", "Only the Owner of the listing can edit!");
			return res.redirect(`/listings/${id}`);
		}
        next();
};


module.exports.isReviewAuthor=async(req,res,next)=>{ 
    const {id, reviewId } = req.params;
		let review =await Reviews.findById(reviewId);
		if(!review.author.equals(res.locals.currUser._id)){
			req.flash("error", "Only the author of the review can delete!");
			return res.redirect(`/listings/${id}`);
		}
        next();
};