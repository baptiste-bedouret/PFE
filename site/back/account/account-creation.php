<?php
require 'back/utils/sql-data-access.php';
include "back/csv/csv-data.php";
function validate($data): string
{
    $data = trim($data);
    $data = stripslashes($data);
    return htmlspecialchars($data);
}

// Call the function to connect to the database and retrieve the table name
$result = connectToDatabase();

// Use the $result array to access the $conn and $table variables
$conn = $result["conn"];
$table = $result["table"];


// Recovery of data from the form
if(isset($_POST["email"], $_POST["mdp"], $_POST["mdp2"], $_POST["age"]))
{
    $email = validate($_POST["email"]);
    $password = validate($_POST["mdp"]);
    $confirm_password = validate($_POST["mdp2"]);
    $age = validate($_POST["age"]);
    $condition = validate($_POST["accept-conditions"]);

    if (empty($email)) {
        header("Location: controller.php?to=createAccount&error=L'adresse électronique est requise");
    }else if(empty($password)){
        header("Location: controller.php?to=createAccount&error=Le mot de passe est requis");
    }else if(empty($age) && $age === ""){
        header("Location: controller.php?to=createAccount&error=La tranche d'âge est requise");
    }else if(empty($confirm_password)){
        header("Location: controller.php?to=createAccount&error=La confirmation du mot de passe est requise");
    }else if($password !== $confirm_password){
        header("Location: controller.php?to=createAccount&error=Les mots de passe ne correspondent pas");
    }else if($condition !== 'on'){
        header("Location: controller.php?to=createAccount&error=Il faut accepter les conditions d'utilisation");
    }else{
        // SQL query to check if the email already exists
        $sql = "SELECT * FROM $table WHERE email = '$email'";
        $result = mysqli_query($conn, $sql);

        // Checking the result of the query
        if (mysqli_num_rows($result) > 0) {
            header("Location: controller.php?to=createAccount&error=Cet adresse email existe deja");
        } else {
            // SQL query to insert a new user

            $hashed_password = password_hash($password, PASSWORD_DEFAULT);

            $sql = "INSERT INTO $table (email, mdp, age)
            VALUES ('$email', '$hashed_password', '$age')";

            // Executing the query and checking the result
            if (mysqli_query($conn, $sql)) {
                $id = mysqli_insert_id($conn);

                // createUserFiles function call from csv-data.php, with the user id
                createUserFiles($id);

                header("Location: controller.php?to=connexion&message=Le compte a été créé avec succès !");
            }
            else {
                header("Location: controller.php?to=connexion&error=Erreur ! Ce compte n'a pas été créé");
            }
        }
    }
}

// Closing the connection
mysqli_close($conn);

