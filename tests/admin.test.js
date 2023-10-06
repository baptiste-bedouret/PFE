global.TextEncoder = require('fast-text-encoding').TextEncoder;
const mysql = require('mysql');
global.$ = require('jquery');
const fs = require('fs');


// Import the functions to be tested
const {
    search,
} = require('../site/front/js/admin');


describe('Admin', () => {
    let connection;

    const testUser1 = {
        id: 1,
        email: 'test1@test',
        mdp: 'test1',
        age: "18 - 21",
        date_creation: "2023-03-22 00:00:00",
    };

    beforeAll(() => {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'users',
        });
        // connection = mysql.createConnection({
        //     host: 'sql7.freesqldatabase.com',
        //     port: 3306,
        //     user: 'sql7599045',
        //     password: 'tKfldlYmmI',
        //     database: 'sql7599045',
        // });

        // source file path
        const sourceFilePath1 = 'data/admin/mixed_data_user_1.csv';
        const sourceFilePath2 = 'data/admin/save_user_1.csv';
        const sourceFilePath3 = 'data/admin/session_user_1.csv';

        // destination file path
        const destinationFilePath1 = '../site/back/data/users/mix_data/mixed_data_user_1.csv';
        const destinationFilePath2 = '../site/back/data/users/save_users/save_user_1.csv';
        const destinationFilePath3 = '../site/back/data/users/session_users/session_user_1.csv';

        // read the source file
        let fileContents = fs.readFileSync(sourceFilePath1, 'utf-8');
        // write the contents to the destination file
        fs.writeFileSync(destinationFilePath1, fileContents, 'utf-8');

        fileContents = fs.readFileSync(sourceFilePath2, 'utf-8');
        fs.writeFileSync(destinationFilePath2, fileContents, 'utf-8');

        fileContents = fs.readFileSync(sourceFilePath3, 'utf-8');
        fs.writeFileSync(destinationFilePath3, fileContents, 'utf-8');


    });

    test('Should connect to the test database', (done) => {
        jest.setTimeout(20000);
        connection.connect((err) => {
            expect(err).toBeNull();
            // console.log('Connected to database');
            const sqlCode = fs.readFileSync('data/admin/test_table_body.sql', 'utf-8');
            connection.query(sqlCode);
            done();
        });

    });

    test('Adding a user to the database', (done) => {
        // Insert a user into the database

        jest.setTimeout(20000);

        connection.query('INSERT INTO test SET ?', testUser1, (err, result) => {
            if (err) {
                console.error('Error inserting utilisateurs into database:', err);
            } else {
                console.log('Inserted utilisateurs into database');
            }

            connection.query('SELECT * FROM test WHERE email = ?', testUser1.email, (err, rows) => {
                if (err) {
                    console.error('Error selecting utilisateurs from database:', err);
                } else {
                    console.log('Selected utilisateurs from database');
                    expect(rows[0].email).toEqual(testUser1.email);
                    // expect(rows[0].mdp).toEqual(testUser1.mdp);
                    expect(rows[0].age).toEqual(testUser1.age);
                }
                done(err);
            });

            // Check that the user was inserted correctly
            connection.query('SELECT * FROM test WHERE email = ?', testUser1.email, (err, rows) => {
                if (err) {
                    console.error('Error selecting utilisateurs from database:', err);
                } else {
                    console.log('Selected utilisateurs from database');
                    expect(rows[0].email).toEqual(testUser1.email);
                    // expect(rows[0].mdp).toEqual(testUser1.mdp);
                    expect(rows[0].age).toEqual(testUser1.age);
                }
                done(err);
            });
        });
    });
    test('Should display search results for id when AJAX request is successful', () => {
        jest.setTimeout(20000);
        const expectedResults = [{ id: testUser1.id,
            email: testUser1.email,
            mdp: testUser1.mdp,
            age: testUser1.age,
            date_creation: testUser1.date_creation}];

        // Mock the jQuery ajax function and make assertions on the parameters passed to it
        const ajaxMock = jest.spyOn($, 'ajax').mockImplementation((options) => {
            options.success(expectedResults);
        });

        document.body.innerHTML = `
            <div id="result"></div>
            <input type="text" id="value" value="1">
            <input type="radio" name="search_by" value="id" checked>
        `;
        const expectedData_id = { value: testUser1.id+"", search_by: 'id' };

        // Call the search function
        search();
        expect(ajaxMock).toHaveBeenCalledWith(expect.objectContaining({
            url: 'back/admin/search-user.php',
            type: 'POST',
            data: expectedData_id,
            dataType: 'json'
        }));

        // Expect the search results to have been displayed
        expect(document.getElementById('result').innerHTML).toContain('Id: ' + testUser1.id);
        expect(document.getElementById('result').innerHTML).toContain('Email: ' + testUser1.email);
        expect(document.getElementById('result').innerHTML).toContain('Password: ' + testUser1.mdp);
        expect(document.getElementById('result').innerHTML).toContain('Age range: ' + testUser1.age);

        // Restore the original implementation of $.ajax
        ajaxMock.mockRestore();
    });
    test('Should display search results for email when AJAX request is successful', () => {
        const expectedResults = [{ id: testUser1.id,
            email: testUser1.email,
            mdp: testUser1.mdp,
            age: testUser1.age,
            date_creation: testUser1.date_creation}];

        // Mock the jQuery ajax function and make assertions on the parameters passed to it
        const ajaxMock = jest.spyOn($, 'ajax').mockImplementation((options) => {
            options.success(expectedResults);
        });

        // Mock the necessary DOM elements and values
        document.body.innerHTML = `
            <div id="result"></div>
            <input type="text" id="value" value="test1@test">
            <input type="radio" name="search_by" value="email" checked>
        `;
        const expectedData_email = { value: testUser1.email, search_by: 'email' };


        // Call the search function
        search();
        expect(ajaxMock).toHaveBeenCalledWith(expect.objectContaining({
            url: 'back/admin/search-user.php',
            type: 'POST',
            data: expectedData_email,
            dataType: 'json'
        }));

        // Expect the search results to have been displayed
        expect(document.getElementById('result').innerHTML).toContain('Id: ' + testUser1.id);
        expect(document.getElementById('result').innerHTML).toContain('Email: ' + testUser1.email);
        expect(document.getElementById('result').innerHTML).toContain('Password: ' + testUser1.mdp);
        expect(document.getElementById('result').innerHTML).toContain('Age range: ' + testUser1.age);

        // Restore the original implementation of $.ajax
        ajaxMock.mockRestore();

    });
    test('Test download-users-csv', () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const params = 'table=test'; // the parameters to send
            xhr.open('POST', 'http://localhost/back/admin/download-users-csv.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const csvData = xhr.responseText;
                    const expectedCsvData = 'id,email,mdp,age,date_creation\n' +
                        '1,test1@test,test1,"18 - 21","2023-03-22 00:00:00"\n';
                    expect(csvData).toEqual(expectedCsvData);
                    resolve();
                } else {
                    reject('Error: Could not create CSV file');
                }
            };
            xhr.send(params);
        });
    });
    test('Test download-user-results-csv', () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const params = 'id=1'; // the parameters to send
            xhr.open('POST', 'http://localhost/back/admin/download-user-results-csv.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const csvData = xhr.responseText;
                    // Read the expected CSV data from a file
                    const expectedCsvData = fs.readFileSync('../site/back/data/users/save_users/save_user_1.csv', 'utf8');
                    expect(csvData).toEqual(expectedCsvData);
                    resolve();
                } else {
                    reject('Error: Could not create CSV file');
                }
            };
            xhr.send(params);
        });
    });
    test('Test download-img-results-csv', () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const params = 'imageName=test'; // the parameters to send
            xhr.open('POST', 'http://localhost/back/admin/download-img-results-csv.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const csvData = xhr.responseText;
                    const expectedCsvData = '"File Name",Choice,Time\n' +
                        'save_user_1.csv,5,3\n';
                    expect(csvData).toEqual(expectedCsvData);
                    resolve();
                } else {
                    reject('Error: Could not create CSV file');
                }
            };
            xhr.send(params);
        });
    });
    test('Test replace-emails-pass-with-ids', () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const params = 'table=test'; // the parameters to send
            xhr.open('POST', 'http://localhost/back/admin/replace-emails-pass-with-ids.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const csvData = xhr.responseText;
                    const expectedCsvData = 'All emails and passwords updated to IDs';
                    expect(csvData).toEqual(expectedCsvData);
                    resolve();
                } else {
                    reject();
                }
            };
            xhr.send(params);
        });
    });
    test('Test download-users-csv with ids', () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const params = 'table=test'; // the parameters to send
            xhr.open('POST', 'http://localhost/back/admin/download-users-csv.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const csvData = xhr.responseText;
                    const expectedCsvData = 'id,email,mdp,age,date_creation\n' +
                        '1,1,1,"18 - 21","2023-03-22 00:00:00"\n';
                    expect(csvData).toEqual(expectedCsvData);
                    resolve();
                } else {
                    reject('Error: Could not create CSV file');
                }
            };
            xhr.send(params);
        });
    });
    test('Test remove-user', () => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const params = 'id=1&table=test'; // the parameters to send
            xhr.open('POST', 'http://localhost/back/admin/remove-user.php', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const rep = xhr.responseText;
                    console.log(rep);
                    expect(fs.existsSync('../site/back/data/mix_data/mixed_data_user_1')).toBe(false);
                    expect(fs.existsSync('../site/back/data/save_users/save_user_1')).toBe(false);
                    expect(fs.existsSync('../site/back/data/session_users/session_user_1')).toBe(false);
                    // Find the user in the database
                    connection.query('SELECT * FROM test WHERE id = ?', "1", (err, rows) => {
                        if (err) {
                            expect(err);
                        }
                    });
                    resolve();
                } else {
                    reject();
                }
            };
            xhr.send(params);
        });
    });



    afterAll(() => {
        connection.query('DROP TABLE test;');
        connection.end((err) => {
            if (err) {
                console.error('Error disconnecting from database:', err);
            } else {
                // console.log('Disconnected from database');
            }
        });
    });

});

