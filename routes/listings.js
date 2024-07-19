const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { validateListing, isLoggedIn, isOwner } = require('../middleware.js');
const listingController = require('../controller/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
// const upload=multer({dest:"uploads/"})

//index route
router.get('/', wrapAsync(listingController.index));

//new rote
router.get('/new', isLoggedIn, listingController.renderNewForm);
//create route
router.post(
	'/',
	isLoggedIn,
	//  validateListing,
	upload.single('Listing[image][url]'),
	wrapAsync(listingController.createListing)
);

// router.post("/",upload.single("Listing[image][url]"),(req,res)=>{
// 	res.send(req.file);
// })

//show route
router.get('/:id', wrapAsync(listingController.showListing));

//get-edit route
router.get(
	'/:id/edit',
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.getEditForm)
);

//update  route
router.put(
	'/:id',
	isLoggedIn,
	isOwner,
	// validateListing,
	upload.single('Listing[image][url]'),
	wrapAsync(listingController.updateListing)
);

//delete listing route
router.delete(
	'/:id',
	isLoggedIn,
	isOwner,
	wrapAsync(listingController.destroyListing)
);

module.exports = router;
