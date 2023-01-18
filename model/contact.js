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
// 	img: {
// 		data: Buffer,
// 		contentType: String
// 	},
// });

// module.exports = Contact;


const contactSchema = new mongoose.Schema({
	nama: String,
	nohp: String,
	email: String,
	img:
	{
		data: Buffer,
		contentType: String
	}
});

//Image is a model which has a schema contactSchema

module.exports = new mongoose.model('Contact', contactSchema);
