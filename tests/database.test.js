const mysql = require('mysql');

// Tests database

describe('User logins', () => {
	let connection;

	const newUser = {
		id: 1,
		email: 'testuser@example.com',
		mdp: 'testpassword',
		age: 30,
		date_creation: new Date(),
  	};

  	beforeAll((done) => {
		// Connect to the database
		connection = mysql.createConnection({
			host: 'sql7.freesqldatabase.com',
			port: 3306,
			user: 'sql7599045',
			password: 'tKfldlYmmI',
			database: 'sql7599045',
    	});

		connection.connect((err) => {
			if (err) {
				console.error('Error connecting to database:', err);
			} else {
				console.log('Connected to database');
			}
			done(err);
		});
  	});

  	afterAll((done) => {
		// Disconnect from the database
		connection.end((err) => {
			if (err) {
				console.error('Error disconnecting from database:', err);
			} else {
				console.log('Disconnected from database');
			}
			done(err);
		});
 	});


  	test('Adding a user to the database', (done) => {
		// Insert a user into the database

		jest.setTimeout(20000);

		connection.query('INSERT INTO utilisateurs SET ?', newUser, (err, result) => {
			if (err) {
				console.error('Error inserting utilisateurs into database:', err);
			} else {
				console.log('Inserted utilisateurs into database');
			}

			// Check that the user was inserted correctly
			connection.query('SELECT * FROM utilisateurs WHERE email = ?', newUser.email, (err, rows) => {
				if (err) {
					console.error('Error selecting utilisateurs from database:', err);
				} else {
					console.log('Selected utilisateurs from database');
					expect(rows.length).toEqual(1);
					expect(rows[0].email).toEqual(newUser.email);
					expect(rows[0].mdp).toEqual(newUser.mdp);
					expect(parseInt(rows[0].age)).toEqual(parseInt(newUser.age));
				}
				done(err);
			});
		});
  	});

  	test('Finding a user in the database', (done) => {

    	// Find the user in the database
      	connection.query('SELECT * FROM utilisateurs WHERE email = ?', newUser.email, (err, rows) => {
			if (err) {
				console.error('Error selecting user from database:', err);
			} else {
				console.log('Selected user from database');
				expect(rows.length).toEqual(1);
				expect(rows[0].email).toEqual(newUser.email);
				expect(rows[0].mdp).toEqual(newUser.mdp);
				expect(parseInt(rows[0].age)).toEqual(parseInt(newUser.age));
			}
			done(err);
      	});
    });

 	test('Inserting a user with an existing email', (done) => {
		// Insert the user into the database
		connection.query('INSERT INTO utilisateurs SET ?', newUser, (err, result) => {
			expect(err).not.toBeNull();
			done();
		});
  	});

  	test('Deleting a user from the database', (done) => {

		// Find the user in the database
		connection.query('DELETE FROM utilisateurs WHERE email = ?', newUser.email, (err, rows) => {
			if (err) {
				console.error('Error Deleting user from database:', err);
			} else {
				console.log('Deleted utilisateurs into database');
			}
			done(err);
		});
  	});

  // update email and password with id 6 months after the user has logged in
  test('Updating a user in the database', (done) => {

      // Find the user in the database
      connection.query('UPDATE utilisateurs SET email = id, mdp = id WHERE date_creation < DATE_SUB(NOW(), INTERVAL 6 MONTH) ', [newUser.email, newUser.mdp, newUser.id, newUser.date_creation], (err, rows) => {
        if (err) {
            console.error('Error Updating user from database:', err);
          } else {
            console.log('Updated utilisateurs into database');
          }
        done(err);
      });
    });

});