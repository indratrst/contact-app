const mongoose = require("mongoose");

//  Membuat schema
const Contact = mongoose.model("Contact", {
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
	image: {
		data: Buffer,
		contentType: String
	},
});

module.exports = Contact;
