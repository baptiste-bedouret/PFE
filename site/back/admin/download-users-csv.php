<?php

require '../utils/access.php';
require '../utils/sql-data-access.php';
// This function gets the list of users from the database.
function getUsers(): array
{
    // Check if the 'table' POST parameter is set.
    if (isset($_POST['table'])) {
        // If set, assign the value to the $input variable.
        $input = $_POST['table'];
        // Call the 'connectToDatabase' function with the $input parameter and assign the result to the $result variable.
        $result = connectToDatabase($input);
    } else {
        // If the 'table' POST parameter is not set, call the 'connectToDatabase' function without any parameter and assign the result to the $result variable.
        $result = connectToDatabase();
    }

    // Get the database connection and table name from the $result variable.
    $conn = $result["conn"];
    $table = $result["table"];

    // Execute the SELECT query to fetch all the rows from the database table.
    $data = $conn->query("SELECT * FROM $table");

    // Create an empty array to store the list of users.
    $users = [];

    // Loop through each row returned by the SELECT query and add it to the $users array.
    while ($row = $data->fetch_assoc()) {
        $users[] = $row;
    }

    // Close the database connection.
    mysqli_close($conn);

    // Return the list of users.
    return $users;
}

// This function creates a CSV file containing the list of users.
function createCsvFile()
{
    // Get the list of users from the getUsers() function.
    $users = getUsers();

    // Open a stream to write the CSV data.
    $fp = fopen('php://output', 'wb');

    // Write the header row for the CSV file.
    fputcsv($fp, array('id', 'email', 'mdp', 'age', 'date_creation'));

    // Loop through each user and write their data to the CSV file.
    foreach ($users as $user) {
        fputcsv($fp, $user);
    }

    // Close the CSV file stream.
    fclose($fp);

    // Set the HTTP response headers to indicate that the response is a CSV file.
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="users.csv"');
}

// Call the createCsvFile() function to generate the CSV file and send it as the HTTP response.
createCsvFile();
