const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { check, body, validationResult } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const bodyParser = require('body-parser');

const flash = require("connect-flash");
const methodOverride = require("method-override");

require("./utils/db");
const Contact = require("./model/contact");
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv/config');
const multer = require('multer');


const { updateOne } = require("./model/contact");
// const { findOne } = require("./model/contact");
const app = express();
const port = 3000;

// setup method override
app.use(methodOverride("_method"));

// Setup ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
// Build in Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
	session({
		cookie: { maxAge: 6000 },
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

app.use(flash());

// Halaman Home
app.get("/", (req, res) => {
	const murid = [
		{
			nama: "Indra Tristia",
			email: "indra@gmail.com",
		},
		{
			nama: "Nabila Nur",
			email: "nabila@gmail.com",
		},
		{
			nama: "Muhamad Nur",
			email: "nur@gmail.com",
		},
	];

	res.render("index", {
		nama: "Indra Tristia",
		title: "Halaman Home",
		murid,
		layout: "layouts/main-layout",
	});
});

// Halaman About
app.get("/about", (req, res) => {
	res.render("about", {
		layout: "layouts/main-layout",
		title: "halaman About",
	});
});

// Halaman Contact
app.get("/contact", async (req, res) => {
	// const contacts = loadContact();
	const contacts = await Contact.find();

	res.render("contact", {
		layout: "layouts/main-layout",
		title: "halaman Contact",
		contacts,
		msg: req.flash("msg"),
	});
});
// Halaman form tambah data contact
app.get("/contact/add", (req, res) => {
	res.render("add-contact", {
		title: "Form Tambah Data Contact",
		layout: "layouts/main-layout",
	});
});

// proses tambah data contact


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

const upload = multer({ storage: storage });

app.post(
	"/contact", upload.single('image'),
	[
		body("nama").custom(async (value) => {
			const duplikat = await Contact.findOne({ nama: value });
			if (duplikat) {
				throw new Error("Nama kontak sudah terdaftar");
			}
			return true;
		}),
		check("email", "Email Tidak Valid").isEmail(),
		check("nohp", "No Hp Tidak Valid").isMobilePhone("id-ID"),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("add-contact", {
				title: "Form Tambah Data Contact",
				layout: "layouts/main-layout",
				errors: errors.array(),
			});
		} else {
			const obj = {
				nama: req.body.nama,
				email: req.body.email,
				nohp: req.body.nohp,
				img: {
					data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
					contentType: 'image/png'
				}
			}
			Contact.insertMany(obj, (error, result) => {
				//  kirim flash message
				req.flash("msg", "Data Contact berhasil ditambahkan");
				res.redirect("/contact");
			});
		}
	}
);

// proses delete contact

// app.get("/contact/delete/:nama", async (req, res) => {
// 	// const contact = findContact(req.params.nama);
// 	const contact = await Contact.findOne({ nama: req.params.nama });

// 	// jika contact tidak ada
// 	if (!contact) {
// 		res.status(404);
// 		res.send("<h1>404</h1>");
// 	} else {
// 		// deleteContact(req.params.nama);
// 		await Contact.deleteOne({ nama: req.params.nama }).then((result) => {
// 			req.flash("msg", "Data Contact Berhasil dihapus");
// 			res.redirect("/contact");
// 		});
// 	}
// });

app.delete("/contact", (req, res) => {
	Contact.deleteOne({ nama: req.body.nama }).then((result) => {
		req.flash("msg", "Data Contact Berhasil dihapus");
		res.redirect("/contact");
	});
});

// Edit data
// form ubah data contact
app.get("/contact/edit/:nama", async (req, res) => {
	const contact = await Contact.findOne({ nama: req.params.nama });
	res.render("edit-contact", {
		title: "Form Ubah Data Contact",
		layout: "layouts/main-layout",
		contact,
	});
});
// proses ubah data contact

app.put(
	"/contact", upload.single("image"),
	[
		body("nama").custom(async (value, { req }) => {
			const duplikat = await Contact.findOne({ nama: value });
			if (value !== req.body.oldNama && duplikat) {
				throw new Error("Nama kontak sudah terdaftar");
			}
			return true;
		}),
		check("email", "Email Tidak Valid").isEmail(),
		check("nohp", "No Hp Tidak Valid").isMobilePhone("id-ID"),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("edit-contact", {
				title: "Form Ubah Data Contact",
				layout: "layouts/main-layout",
				errors: errors.array(),
				contact: req.body,
			});
		} else {
			Contact.updateOne(
				{ _id: req.body._id },
				{
					$set: {
						nama: req.body.nama,
						email: req.body.email,
						nohp: req.body.nohp,
						img: {
							data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
							contentType: 'image/png'
						}
					},
				}
			).then((result) => {
				//  kirim flash message
				req.flash("msg", "Data Contact berhasil diubah");
				res.redirect("/contact");
			});
		}
	}
);

// Halaman detail contact
app.get("/contact/:nama", async (req, res) => {
	// const contact = findContact(req.params.nama);
	const contact = await Contact.findOne({ nama: req.params.nama });

	res.render("detail", {
		layout: "layouts/main-layout",
		title: "Halaman Detail Contact",
		contact,
	});
});


app.listen(port, () => {
	console.log(`Mongo Contact App | listening  at http://localhost:${port}`);
});
