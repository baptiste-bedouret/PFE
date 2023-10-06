<?php
require 'back/utils/sql-data-access.php';

// Call the function to connect to the database and retrieve the table name
$result = connectToDatabase();

// Use the $result array to access the $conn and $table variables
$conn = $result["conn"];
$table = $result["table"];

// SQL query to update the email and password columns to id after 6 months
$sql_delete= "UPDATE $table SET email =  id, mdp = id WHERE date_creation < DATE_SUB(NOW(), INTERVAL 6 MONTH)";
mysqli_query($conn, $sql_delete);

function validate($data): string
{
    $data = trim($data);
    $data = stripslashes($data);
    return htmlspecialchars($data);
}

// Recovery of data from the form
if(isset($_POST["email"], $_POST["mdp"])){
    $email = validate($_POST["email"]);
    $password = validate($_POST["mdp"]);

    if (empty($email)) {
        header("Location: controller.php?to=connexion&error=Email est requise");
    }else if(empty($password)){
        header("Location: controller.php?to=connexion&error=Le mot de passe est requis");
    }else if("admin@admin" === $email && "admin" === $password) {
        header("Location: controller.php?to=admin");
    } else {
        // SQL query to check if the email and the password are in the database

        $sql = "SELECT * FROM $table WHERE email = '$email'";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) === 1) {
            $row = mysqli_fetch_assoc($result);

            if (password_verify($password, $row['mdp'])) {
                $_SESSION['user_id'] = $row['id'];

                // If mix and session files are empty, go to the end of experiment
                $path_session = 'back/data/users/session_users/session_user_' . $_SESSION['user_id'] . '.csv';
                $path_mix = 'back/data/users/mix_data/mixed_data_user_' . $_SESSION['user_id'] . '.csv';
                if(!file_exists($path_mix) && !file_exists($path_session)){
                    header("Location: controller.php?to=end");
                }else{
                    header("Location: controller.php?to=start");
                }
            }
            else {
                header("Location: controller.php?to=connexion&error=Votre adresse e-mail ou votre mot de passe est incorrect");
            }
        } else{
            header("Location: controller.php?to=connexion&error=Votre adresse e-mail ou votre mot de passe est incorrect");
        }
    }
}

// Closing the connection
mysqli_close($conn);
