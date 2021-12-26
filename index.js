const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const { DBError } = require("objection");
const cors = require("cors");
const PORT = 3007


// parse application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(
	cors({
		origin: "*",
	})
)
//Create Database Connection
const conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "test",
});





conn.connect((err) => {
	if (err) throw err;
	console.log("mysql connected ")
})

app.get("/api", (req, res) => {
	res.json({
		"version": "v0.0.1",
		"author": "hriday",
		"status": "running"
	})
})


// creat a new Record
app.post("/api/create", (req, res) => {
	let data = { number: req.body.number, mail: req.body.mail, password: req.body.password };
	let sql = "INSERT INTO users SET ?";
	conn.query(sql, data, (err, result) => {
		if (err) throw err;
		res.status(201).json({
			"message": "user registrion successful",
			"_user": result.insertId
		})
	});
});

app.post("/api/login", (req, res) => {
	const { number, password } = req.body
	let sql = `SELECT * FROM users WHERE number=${number} AND password=${password}`
	conn.query(sql, (err, result) => {
		if (err) throw err;
		if (result[0]) {
			return res.json({
				"message": "login successful",
				"_user": result[0].id
			})
		}
		return res.status(401).json({
			"error": {
				"message": "login failed"
			}
		})
	});
})




// show all records
app.get("/api/view", (req, res) => {
	let sql = "SELECT * FROM users";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});

// show a single record
app.get("/api/view/:id", (req, res) => {
	let sql = "SELECT * FROM users WHERE id=" + req.params.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
});


// delete the record
app.delete("/api/delete/:id", (req, res) => {
	let sql = "DELETE FROM users WHERE id=" + req.params.id + "";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Record deleted successfully" }));
	});
});

// update the Record
app.put("/api/update/", (req, res) => {
	let sql = "UPDATE users SET number='" + req.body.number + "', mail='" + req.body.mail + "',passwoed='" + req.body.password + "' WHERE id=" + req.body.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Record updated SuccessFully" }));
	});
});

//at the bottom of the code
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});