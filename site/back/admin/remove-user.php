<?php

require '../utils/access.php';
require '../utils/sql-data-access.php';

// check if the id is set in the POST data
if (isset($_POST['id'])) {
    if (isset($_POST['table'])) {
        $input = $_POST['table'];
        $result = connectToDatabase($input);
    } else {
        $result = connectToDatabase();
    }

    // Use the $result array to access the $conn and $table variables
    $conn = $result["conn"];
    $table = $result["table"];

    // escape the id value to prevent SQL injection attacks
    $id = $conn->real_escape_string($_POST['id']);

    // check if a user with the specified id exists
    $result = $conn->query("SELECT * FROM $table WHERE id = '$id'");
    if ($result->num_rows === 0) {
        $response = array("error" => "User not found");
    } else {
        // remove the user from the database
        $conn->query("DELETE FROM $table WHERE id = '$id'");

        // delete files with the user's ID in the filename
        $files = glob("../data/users/mix_data/*_$id.csv");
        foreach ($files as $file) {
            unlink($file);
        }
        $files = glob("../data/users/save_users/*_$id.csv");
        foreach ($files as $file) {
            unlink($file);
        }
        $files = glob("../data/users/session_users/*_$id.csv");
        foreach ($files as $file) {
            unlink($file);
        }

        $response = array("message" => "User removed successfully");
        mysqli_close($conn);
    }
} else {
    $response = array("error" => "Invalid request");
}

// return a JSON response
header("Content-Type: application/json");
echo json_encode($response);


