const mongoose = require('mongoose');
const Reviews = require('./reviewSchema.js');

const Schema = mongoose.Schema;

const ListingSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	image: {
		filename: {
			type: String,
		},
		url: {
			type: String,
		},
	},
	price: {
		type: Number,
	},
	location: {
		type: String,
	},
	country: {
		type: String,
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Reviews',
		},
	],
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true,
			default: 'Point',
		},
		coordinates: {
			type: [Number],
			required: true,
			default: [77.2088, 28.6139],
		},
	},
});

ListingSchema.post('findOneAndDelete', async (listing) => {
	if (listing) {
		await Reviews.deleteMany({ _id: { $in: listing.reviews } });
	}
});

const Listing = mongoose.model('Listing', ListingSchema);
module.exports = Listing;
