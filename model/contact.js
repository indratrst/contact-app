const mongoose = require("mongoose");

// //  Membuat schema
// const Contact = mongoose.model("Contact", {
// 	nama: {
// 		type: String,
// 		required: true,
// 	},
// 	nohp: {
// 		type: String,
// 		required: true,
// 	},
// 	email: {
// 		type: String,
// 	},
// 	image: {
// 		data: Buffer,
// 		contentType: String
// 	},
// });

// module.exports = Contact;


const contactSchema = new mongoose.Schema({
	nama: {
		type: String,
		required: true,
	},
	nohp: {
		type: String,
		required: true,
	},
	email: {
		type: String,
	},
	image:
	{
		type: String,
		default: 'image_not_found.png',
	}
});

//Image is a model which has a schema contactSchema

module.exports = new mongoose.model('Contact', contactSchema);
