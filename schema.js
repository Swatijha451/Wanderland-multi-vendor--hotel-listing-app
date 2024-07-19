const joi = require('joi');
module.exports.listingSchema = joi.object({
	Listing: joi
		.object({
			title: joi.string().required(),
			description: joi.string().required(),
			location: joi.string().required(),
			country: joi.string().required(),
			price: joi.number().required().min(0),
			image: {
				url: joi.string().required(),
				filename: joi.string().required(),
			},
			reviews: joi.array().items({
				comment: joi.string().required(),
				rating: joi.number().min(1).max(5).required(),
			}),

			owner: joi.string().required(),
		})
		.required(),
});

module.exports.ReviewSchema = joi.object({
	review: joi
		.object({
			comment: joi.string().required(),
			rating: joi.number().min(1).max(5).required(),
			created_on: joi.date(),
			author: joi.string(),
		})
		.required(),
});
