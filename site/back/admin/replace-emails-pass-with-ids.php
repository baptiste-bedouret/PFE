<?php

require '../utils/access.php';
require '../utils/sql-data-access.php';

// Call the function to connect to the database and retrieve the table name
if (isset($_POST['table'])) {
    $input = $_POST['table'];
    $result = connectToDatabase($input);
} else {
    $result = connectToDatabase();
}

// Use the $result array to access the $conn and $table variables
$conn = $result["conn"];
$table = $result["table"];

// Prepare the update query
$sql = "UPDATE $table SET email = id, mdp = id";

if (mysqli_query($conn, $sql)) {
    echo "All emails and passwords updated to IDs";
} else {
    echo "Error updating: " . mysqli_error($conn);
}

mysqli_close($conn);

