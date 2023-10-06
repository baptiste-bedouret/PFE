const fs = require('fs');
const Papa = require("papaparse");

const {pathToImage} = require('../site/front/js/csv-operation');


/* Test if mixed_data_user is generated and contains 1824 lines in random order  */
describe('Content of the mixed data file', () => {
	test('Creation of the mixed_data_user.csv file', () => {

		// Check that the mixed_data_user.csv file has been created
		expect(fs.existsSync('data/csv_tests/mixed_data_404.csv')).toBeTruthy();

		// Check that the mixed_data_user.csv file contains 1824 lines
		let mix_file;
		try {
			mix_file = fs.readFileSync('data/csv_tests/mixed_data_404.csv', 'utf8');
		}catch(e){
			console.error(e);
		}
		const mix_lines = mix_file.trim().split('\n');
		expect(mix_lines.length).toBe(1825);

		// Check that the lines are mixed
		let uni_file;
		try {
			uni_file = fs.readFileSync('../site/back/data/uni_test.csv', 'utf8');
		}catch(e){
			console.error(e);
		}
		const uni_lines = uni_file.trim().split('\n');

		// See if line 5 of uni_test.csv is different from line 5 of mixed_data_user.csv
		expect(mix_lines[5]).not.toBe(uni_lines[5]);
		// See if line 10 of uni_test.csv is different from line 10 of mixed_data_user.csv
		expect(mix_lines[10]).not.toBe(uni_lines[10]);

	});


	/* Test if mixed_data_user.csv contains the right lines */
	test('Reading the content of the mixed_data_user.csv file', () => {

		const mix_file_name = "data/csv_tests/mixed_data_404.csv";
		const uni_train_file_name = "../site/back/data/uni_train.csv";
		const uni_test_file_name = "../site/back/data/uni_test.csv";
		let mix_file, mix_json, mix_data;
		let uni_train_file, uni_train_json, uni_train_data;
		let uni_test_file, uni_test_json, uni_test_data;

		try {
			mix_file = fs.readFileSync(mix_file_name, "utf-8");
			mix_json = Papa.parse(mix_file, {encoding: "utf-8"});
			mix_data = mix_json.data;

			uni_train_file = fs.readFileSync(uni_train_file_name, "utf-8");
			uni_train_json = Papa.parse(uni_train_file, {encoding: "utf-8"});
			uni_train_data = uni_train_json.data;

			uni_test_file = fs.readFileSync(uni_test_file_name, "utf-8");
			uni_test_json = Papa.parse(uni_test_file, {encoding: "utf-8"});
			uni_test_data = uni_test_json.data;
		}catch(e){
			console.error(e);
		}

		// Check that the file mixed_data_user.csv contains the rows from uni_train.csv
		let i,j =1;
		while(i<1825){
			expect(mix_data[i]).toStrictEqual(uni_train_data[j]);
			expect(mix_data[i+1]).toStrictEqual(uni_train_data[j+1]);
			expect(mix_data[i+2]).toStrictEqual(uni_train_data[j+2]);
			i=i+243;
			j=j+3;
		}

		// Check if each row of uni_test.csv is present in mixed_data_user.csv
		let matchingRowCount = 0;
		uni_test_data.forEach((uniTestRow, index) => {
			const isMatchingRow = mix_data.some((mixedDataRow) => {
				return Object.entries(uniTestRow).every(([key, value]) => {
					return mixedDataRow[key] === value;
				});
			});

			if (isMatchingRow) {
				matchingRowCount++;
			} else {
				console.log(`Ligne différente à la ligne ${index + 1} :`, uniTestRow);
			}
		});

		// Assert that the number of corresponding lines is correct
		expect(matchingRowCount).toBe(uni_test_data.length-1);
	});
});

describe('Generation of the session file', () => {
	const mix_file_name = "data/csv_tests/mixed_data_404.csv";
	const session_file_name = "data/csv_tests/session_404.csv";
	let mix_file, mix_json, mix_data;
	let session_file, session_json, session_data;

	/* Test if session_user.csv is generated and contains 243 lines */
	test('Read test of the file content session_user.csv', () => {
		try {
			mix_file = fs.readFileSync(mix_file_name, "utf-8");
			mix_json = Papa.parse(mix_file, {encoding: "utf-8"});
			mix_data = mix_json.data;

			session_file = fs.readFileSync(session_file_name, "utf-8");
			session_json = Papa.parse(session_file, {encoding: "utf-8"});
			session_data = session_json.data;
		}catch(e){
			console.error(e);
		}

		// Check that session_user.csv contains 244 rows
		expect(session_data.length).toBe(244);

		// Check that the session_user.csv file contains the first 243 lines of mixed_data_user.csv
		let i;
		for(i=0; i<244; i++){
			expect(session_data[i]).toStrictEqual(mix_data[i]);
		}

	});

	// Checks that the path to the images is correctly created from the data in the session file
	test('Path to the images', () => {
		// Changes a little the path to adapt to the position from this file
		const path = '../site/back/data/images/';

		// Calls the function of csv-operation to test the code and, also copies the code to be adapt for the test
		for(let i=1; i < session_data.length; i++){
			// Creates et checks the exact path to each image of the session file
			let debutPath = path + pathToImage(session_data[i][3]);

        	let noisy = debutPath.concat('/','perturbation');
        	let sup = debutPath.concat('/','sup');

			let img1 = noisy.concat('/',session_data[i][1]);
        	let img2 = sup.concat('/',session_data[i][2]);

			expect(fs.existsSync(img1)).toBeTruthy();
			expect(fs.existsSync(img2)).toBeTruthy();
		}
	});

	/* Delete the extracted images for a session from the mixed_data_user.csv file */
	test('Delete extracted images for one session from mixed_data_user.csv', () => {
		const mix_file_name = "data/csv_tests/mixed_data_user_409.csv";
		const uni_train_file_name = "../site/back/data/uni_train.csv";
		let mix_file, mix_json, mix_data;
		let uni_train_file, uni_train_json, uni_train_data;
		try {
			mix_file = fs.readFileSync(mix_file_name, "utf-8");
			mix_json = Papa.parse(mix_file, {encoding: "utf-8"});
			mix_data = mix_json.data;
			uni_train_file = fs.readFileSync(uni_train_file_name, "utf-8");
			uni_train_json = Papa.parse(uni_train_file, {encoding: "utf-8"});
			uni_train_data = uni_train_json.data;
		}catch(e){
			console.error(e);
		}
		// Check that mix_data_user.csv contains 1825 - 243 = 1582 rows
		expect(mix_data.length-1).toEqual(1582);

		// Check that the first 3 lines of the mixed_data_user.csv file are the line 5,6,7 of uni_train.csv
		let i=1;
		let j=4;
		expect(mix_data[i]).toEqual(uni_train_data[j]);
		expect(mix_data[i+1]).toEqual(uni_train_data[j+1]);
		expect(mix_data[i+2]).toEqual(uni_train_data[j+2]);

	});

});


// Test if choices and times are correctly saved in the save file when the session is over
describe('Save choices and times at the end of a session', () => {
	const save_file_name = "data/csv_tests/save_user_404.csv";
	const user_id = "404";
	let save_file, save_json, save_data;
	let session_origin, session_origin_json, session_origin_data;

	// Checks that the file name contains the user id
	test('Save file contains the user id in its name', () => {
		// Checks that the save file is created
		expect(fs.existsSync(save_file_name)).toBeTruthy();

		const id = save_file_name.substring(25, save_file_name.length-4);
		// Checks that the user id matches and is contained in the file name
		expect(id).toEqual(user_id);
		expect(save_file_name).toContain(user_id);
	});

	// Checks that all the rows of the original session file are in the save file, with two columns for choices and times
	test('Save file contains all the rows, except training, of the session file with the choices and times', () => {
		// Try to open the save file
		try {
			save_file = fs.readFileSync(save_file_name, "utf-8");
			save_json = Papa.parse(save_file, {encoding: "utf-8"});
			save_data = save_json.data;

			session_origin = fs.readFileSync("data/csv_tests/session_404.csv", "utf-8");
			session_origin_json = Papa.parse(session_origin, {encoding: "utf-8"});
			session_origin_data = session_origin_json.data;
		}catch(e){
			console.error(e);
		}

		// Removes the first parameter line and the empty line at the end of the file
		const nb_rows = save_data.length-2;
		// Checks if there are 240 images evaluated when the session is over
		expect(nb_rows).toEqual(240);

		// Checks that the columns 7 and 8 are for choices and times respectively
		expect(save_data[0][7]).toEqual("Choices");
		expect(save_data[0][8]).toEqual("Times");

		// Do not add the 3 trainings rows
		expect(save_data[1][0] != "0" && save_data[2][0] != "1" && save_data[3][0] != "2").toBeTruthy();

		// Check that each choice is between 0 and 5, and each time is between 0 and 20, are adding to the rows from session file
		for(let i=1; i <= nb_rows; i++){
			expect(save_data[i][2]).toEqual(session_origin_data[i+3][2]);
			expect(save_data[i][7] >= 0 && save_data[i][7] <= 5).toBeTruthy();
			expect(save_data[i][8] >= 0 && save_data[i][8] <= 20).toBeTruthy();
		}
	});

	// Checks that the content of the session file is updated from the original mixed data file
	test('Fill the csv session file with the following rows of the mixed data file', () => {
		let session_file, session_json, session_data;
		let mix_file, mix_json, mix_data;
		const session_file_name = "data/csv_tests/session_user_404.csv";

		try {
			session_file = fs.readFileSync(session_file_name, "utf-8");
			session_json = Papa.parse(session_file, {encoding: "utf-8"});
			session_data = session_json.data;

			mix_file = fs.readFileSync("data/csv_tests/mixed_data_404.csv", "utf-8");
			mix_json = Papa.parse(mix_file, {encoding: "utf-8"});
			mix_data = mix_json.data;
		}catch(e){
			console.error(e);
		}

		const nb_rows_session = session_data.length-2;
		// Checks if there are 243 new images in the session file, corresponding to the following in the mixed data file
		expect(nb_rows_session).toEqual(243);

		// Checks if the session file contains the following images from the mixed data file
		for(let i=1; i <= nb_rows_session; i++){
			expect(session_origin_data[i]).not.toEqual(session_data[i]);
			expect(session_data[i]).toEqual(mix_data[i+nb_rows_session]);
		}

	});
});


// Test if choices and times are correctly saved in the save file when the session is exited : 15 images evaluated
describe('Save choices and times when the user leaves the current session : 15 images evaluated', () => {
	// Session file before evaluation
	let session_origin_409, session_origin_json_409, session_origin_data_409;

	// Save file after evaluating 15 images
	const file_name = "data/csv_tests/save_user_409.csv";
	let save_file_409, save_json_409, save_data_409;

	// Session file when the session has been exited
	const file_name_409 = "data/csv_tests/session_user_409.csv";
	let session_file_409, session_json_409, session_data_409;

	// Number of evaluated images
	const nb_evaluated = 15;

	// Checks that only the evaluated images are added to the save file
	test('Save only evaluated images', () => {
		// Opens save file after and session file before evaluation
		try {
			save_file_409 = fs.readFileSync(file_name, "utf-8");
			save_json_409 = Papa.parse(save_file_409, {encoding: "utf-8"});
			save_data_409 = save_json_409.data;

			session_origin_409 = fs.readFileSync("data/csv_tests/session_409.csv", "utf-8");
			session_origin_json_409 = Papa.parse(session_origin_409, {encoding: "utf-8"});
			session_origin_data_409 = session_origin_json_409.data;
		}catch(e){
			console.error(e);
		}

		const nb_rows = save_data_409.length-2;
		// Checks if there are 15 images evaluated when we leave the session
		expect(nb_rows).toEqual(15);


		// Checks that the columns 7 and 8 are for choices and times respectively
		expect(save_data_409[0][7]).toEqual("Choices");
		expect(save_data_409[0][8]).toEqual("Times");

		// Do not add the 3 trainings rows
		expect(save_data_409[1][0] != "0" && save_data_409[2][0] != "1" && save_data_409[3][0] != "2").toBeTruthy();

		// Check that each choice is between 0 and 5, and each time is between 0 and 20, are adding to the rows from session file
		for(let i=1; i <= nb_evaluated; i++){
			expect(save_data_409[i][2]).toEqual(session_origin_data_409[i+3][2]);
			expect(save_data_409[i][7] >= 0 && save_data_409[i][7] <= 5).toBeTruthy();
			expect(save_data_409[i][8] >= 0 && save_data_409[i][8] <= 20).toBeTruthy();
		}

	});

	// Checks that the evaluated images are deleted from the session file
	test('Removes previously evaluated images from the session file', () => {
		// Opens session file after evaluation
		try {
			session_file_409 = fs.readFileSync(file_name_409, "utf-8");
			session_json_409 = Papa.parse(session_file_409, {encoding: "utf-8"});
			session_data_409 = session_json_409.data;
		}catch(e){
			console.error(e);
		}


		const nb_rows = session_data_409.length-2;
		// Checks if the images already evaluated are deleted
		expect(nb_rows).toEqual(243 - nb_evaluated);

		// Checks with the session file before evaluation if the rows no longer exist
		for(let i=4; i <= 3+nb_evaluated; i++){
			expect(session_data_409[i]).not.toEqual(session_origin_data_409[i]);
		}

	});

	// Checks that the session file still contains the training images and those still to be evaluated
	test('The session file stores the training images and then the images still to be evaluated when we log in', () => {
		// Checks if there are training images
		expect(session_data_409[1][0] === "0" && session_data_409[2][0] === "1" && session_data_409[3][0] === "2").toBeTruthy();

		// Checks that it resumes in the order in which the session left off
		for(let i=4; i < session_data_409.length-1; i++){
			expect(session_data_409[i]).toEqual(session_origin_data_409[i+nb_evaluated]);
		}

	});
});


/* Test if mix.csv and session.csv are empty, then delete them */
describe('delete mixed_data.csv and session.csv files', () => {
	it('mix.csv and session.csv files should be deleted if they are empty', () => {
		// Create the mix.csv file with two lines
		fs.writeFileSync('data/csv_tests/mix.csv', 'Noisy_image,Sup_Image,Distorsion\ndog,dog,Grad_Cam');

		// Read the two lines from mix.csv and write them into session.csv
		let data;
		try {
			data = fs.readFileSync('data/csv_tests/mix.csv', 'utf8');
		}catch(e){
			console.error(e);
		}
		const lines = data.trim().split('\n');
		fs.writeFileSync('data/csv_tests/session.csv', lines.join('\n'));

		// Empty mix.csv after writing in session.csv
		fs.writeFileSync('data/csv_tests/mix.csv', '');

		// Save the rows of session.csv in save.csv with two additional columns
		let sData;
		try {
			sData = fs.readFileSync('data/csv_tests/session.csv', 'utf8');
		}catch(e){
			console.error(e);
		}
		const sessionLines = sData.trim().split('\n');
		const saveLines = sessionLines.map((line, index) => {
			const cols = line.split(',');
			if (index === 0) {
				// Add the columns choice and time to the first row
				cols.push('choix', 'temps');
			} else if (index === 1) {
				//Add the values '1' and '2' to the second line
				cols.push('1', '2');
			}
			return cols.join(',');
		});
		fs.writeFileSync('data/csv_tests/save.csv', saveLines.join('\n'));

		// Empty session.csv after writing to save.csv
		fs.writeFileSync('data/csv_tests/session.csv', '');

		// Delete mix.csv and session.csv if they are empty
		try {
			let mixData = fs.readFileSync('data/csv_tests/mix.csv', 'utf8');
			if (mixData.trim() === '') {
				fs.unlinkSync('data/csv_tests/mix.csv');
			}
		}catch(e){
			console.error(e);
		}

		try {
			let sessionData = fs.readFileSync('data/csv_tests/session.csv', 'utf8');
			if (sessionData.trim() === '') {
				fs.unlinkSync('data/csv_tests/session.csv');
			}
		}catch(e){
			console.error(e);
		}

		// Check that the files have been deleted
		expect(fs.existsSync('data/csv_tests/mix.csv')).toBeFalsy();
		expect(fs.existsSync('data/csv_tests/session.csv')).toBeFalsy();
	});
});