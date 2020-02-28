const bcrypt = require('bcrypt');
const async = require('async');
const jwt = require('jsonwebtoken');
const pg = require('pg');
const pool = new pg.Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'roadtripfriends',
	password: '',
	port: '5432'
});

module.exports = {
	register: function (req, res) {
		const params = req.body;
		async.waterfall([
			function (callback) {
				checkEmailPseudo(params, callback);
			},
			function (params, callback) {
				hashPassword(params, callback);
			},
			function (params, callback) {
				getRole(params, callback);
			},
			function (params, callback) {
				getForfait(params, callback);
			},
			function (params, callback) {
				insertUser(params, callback);
			}
		], function (error, success) {
			if (error) {
				console.log('Something is wrong!', error);
			}
			res.json(success);
		});
	},
	login: function (req, res, next) {
		const params = req.body;
		async.waterfall([
			function (callback) {
				getUser(params, callback);
			},
			function (params, callback) {
				comparePassword(params, callback);
			},
			function (params, callback) {
				getTokenJwt(params, callback);
			}
		], function (error, success) {
			if (error) {
				console.log('Something is wrong!');
			}
			const setUser = {
				user_id: success.user_id,
				token: success.token
			};
			res.json(setUser);
		});
	}

};

/* LOGIN */

const getUser = function (params, callback) {
	pool.query(`SELECT * FROM users WHERE email = '${params.email.toLowerCase()}'`, (err, result) => {
		if (err) {
			callback(true, err);
		} else if (result) {
			if (result.rows && result.rows[0]) {
				params.user = result.rows[0];
			} else {
				params.user = null;
			}
			callback(null, params);
		}
	});
};

const comparePassword = function (params, callback) {
	if (params.user == null) {
		callback(null, params);
	} else {
		bcrypt.compare(params.password, params.user.password, function (err, res) {
			if (err) {
				callback(err);
			}
			if (res) {
				params.password = true;
				callback(null, params.user);
			} else {
				params.password = false;
				callback(null, params);
			}
		});
	}
};

const getTokenJwt = function (params, callback) {
	console.log(params);

	/* jwt.verify(authUser, 'migina', (error, result) => {
        console.log(result)
    });*/
	if (params.user == null) {
		callback(null, params);
	} else {
		const token = jwt.sign({ id: params.user_id, email: params.email }, 'migina', { expiresIn: '7d' });
		pool.query(`UPDATE users SET token = '${token}' WHERE user_id = ${params.user_id}`, (err, result) => {
			if (err) {
				console.log(err);
				callback(true, err);
			} else if (result) {
				params.token = token;
				callback(null, params);
			}
		});
	}
};

/*  REGISTER */

const checkEmailPseudo = function (params, callback) {
	if (params.email && params.email.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/) && params.pseudo && params.pseudo.length > 3 && params.pseudo.length < 15) {
		pool.query(`SELECT * FROM users WHERE email = '${params.email}'`, (err, result) => {
			if (err) {
				callback(true, err);
			} else if (result) {
				if (result.rows && result.rows[0]) {
					params.error = 'Email deja existant';
				} else {
					params.email = params.email.toLowerCase();
				}
				callback(null, params);
			}
		});
	} else {
		params.error = 'Mauvais format d\'email';
		callback(false, params);
	}
};

const hashPassword = function (params, callback) {
	if (params.error) {
		callback(true, params);
	} else if (params.password && params.password.length >= 6 && params.password.length <= 15) {
		bcrypt.hash(params.password, 10, function (err, hash) {
			if (err) callback(err);
			params.password = hash;
			callback(null, params);
		});
	} else {
		params.error = 'Mauvais format de mot de passe';
		callback(false, params);
	}
};

const getRole = function (params, callback) {
	if (params.error) {
		callback(true, params);
	} else {
		pool.query(`SELECT role_id FROM roles WHERE name = '${params.role}'`, (err, result) => {
			if (err) {
				callback(err, params);
			} else if (result) {
				params.role = result.rows[0].role_id;
				callback(null, params);
			}
		});
	}
};

const getForfait = function (params, callback) {
	if (params.error) {
		callback(true, params);
	} else {
		pool.query(`SELECT forfait_id FROM forfaits WHERE title = '${params.forfait}'`, (err, result) => {
			if (err) {
				callback(err, params);
			} else if (result) {
				params.forfait = result.rows[0].forfait_id;
				callback(null, params);
			}
		});
	}
};

const insertUser = function (params, callback) {
	if (params.error) {
		callback(true, params);
	} else {
		const query = `INSERT INTO users (email, pseudo, password, role_id, forfait_id, created_at) VALUES ('${params.email}', '${params.pseudo}', '${params.password}', ${params.role}, ${params.forfait}, NOW()) RETURNING user_id`;
		pool.query(query, (err, result) => {
			if (err) {
				callback(err, params);
			} else if (result) {
				callback(null, result.rows);
			}
		});
	}
};
