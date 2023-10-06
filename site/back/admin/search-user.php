<?php

require '../utils/access.php';
require '../utils/sql-data-access.php';

// This function searches for users in the database based on the specified search criteria.
function searchUsers($searchBy, $value): array
{
    // Call the 'connectToDatabase' function to get the database connection and table name.
    $result = connectToDatabase();
    $conn = $result["conn"];
    $table = $result["table"];

    // Check the search criteria and build the SQL query accordingly.
    if ($searchBy === "id" && is_numeric($value)) {
        $sql = "SELECT * FROM $table WHERE id = $value";
    } elseif ($searchBy === "email") {
        $sql = "SELECT * FROM $table WHERE email = '$value'";
    } else {
        // If the search criteria is invalid, return an error message.
        return array('error' => 'Invalid search option');
    }

    // Execute the SQL query.
    $data = $conn->query($sql);

    // Create an empty array to store the search results.
    $arr = array();

    // Loop through each row returned by the SQL query and add it to the $arr array.
    if ($data->num_rows > 0) {
        while ($row = $data->fetch_assoc()) {
            $arr[] = $row;
        }
    } else {
        // If no rows were returned by the SQL query, return an error message.
        return array('error' => 'User not found');
    }

    // Close the database connection.
    $conn->close();

    // Return the search results.
    return $arr;
}

// This function searches for users based on the specified criteria and returns the results in JSON format.
function searchUsersJson($searchBy, $value)
{
    // Call the 'searchUsers' function to get the search results.
    $result = searchUsers($searchBy, $value);

    // Encode the search results in JSON format and print them to the output.
    echo json_encode($result);
}

// Get the search criteria and value from the POST parameters and call the 'searchUsersJson' function.
$searchBy = $_POST["search_by"];
$value = $_POST["value"];
searchUsersJson($searchBy, $value);

