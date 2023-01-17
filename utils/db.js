const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:127.0.0.1/db", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

// // Menambah satu data
// const contact1 = new Contact({
// 	nama: "Nabila",
// 	nohp: "089722499842",
// 	email: "nabila@gmail.com",
// });

// // simpan ke collections
// contact1.save().then((contact) => console.log(contact));
