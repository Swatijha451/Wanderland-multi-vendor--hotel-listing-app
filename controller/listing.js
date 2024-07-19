
const Listing=require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({ accessToken : mapToken });


module.exports.index=(async (req, res) => {
    const allListings = await Listing.find({}).populate("owner");
    
    res.render('./listings/index.ejs', { allListings });
});

module.exports.renderNewForm=(req, res) => {
	res.render('./listings/new.ejs');
};

module.exports.createListing=(async (req, res) => {
    let response= await geocodingClient.forwardGeocode(
        {
            query:req.body.Listing.location,
            limit:1.
        }).send();
    
    const newListing = new Listing(req.body.Listing);
    newListing.owner=req.user._id;
    newListing.image.url=req.file.path;
    newListing.image.filename=req.file.filename;    
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
//    console.log(savedListing);
    req.flash("success","New Listing Created Successfully!");
    res.redirect('/listings');
    // console.log(newListing);
});

module.exports.showListing=(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate(
        {
        path:'reviews',
        populate:
        {
            path:"author",
        },
    }
).populate("owner");
    if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect('/listings');
    }
    res.render('./listings/show.ejs', { listing });
});

module.exports.getEditForm=(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect('/listings');
        }
        let originalUrl=listing.image.url;
       originalUrl= originalUrl.replace("/upload","/upload/h_300/w_250")
    res.render('./listings/edit.ejs', { listing , originalUrl});
});

module.exports.updateListing=(async (req, res) => {
    const { id } = req.params;    
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    // console.log(req.file);
    if(typeof req.file  !== "undefined"){
    listing.image.url=req.file.path;
    listing.image.filename=req.file.filename;
    await listing.save();
    }

    req.flash("success","Listing updated Successfully!");
    
    res.redirect(`/listings/${id}`);
});

module.exports.destroyListing=(async (req, res) => {
    const { id } = req.params;
     await Listing.findByIdAndDelete(id);
    req.flash("error","Listing Deleted Successfully!");
    // console.log(deletedListing);
    res.redirect('/listings');
});