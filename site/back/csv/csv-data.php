<?php
    // https://www.phptutorial.net/php-tutorial/php-csv/
    // https://www.nidup.io/blog/manipulate-csv-files-in-php
    // https://www.php.net/manual/fr/function.fopen.php

    $folder = 'back/data/users';
    $folder2 = '../../back/data/users';
    /**
     * Creates all the files when the user creates an account.
     */
    function createUserFiles($id){
        global $folder;
        // Opens training dataset
        $f_read_train = fopen('back/data/uni_train.csv', 'rb');
        if($f_read_train === false){
            die('Error opening file uni_train.csv');
        }
        // Gets the csv parameters
        $first_line = fgetcsv($f_read_train);
        // Gets each row of the csv training file
        $rows_train=[];
        while(($row = fgetcsv($f_read_train)) !== false) {
            $rows_train[] = $row;
        }

        // Opens testing dataset
        $f_read_test = fopen('back/data/uni_test.csv', 'rb');
        if($f_read_test === false){
            die('Error opening file uni_test.csv');
        }
        fgetcsv($f_read_test);
        // Gets each row of the csv testing file
        $rows_test=[];
        while(($row = fgetcsv($f_read_test)) !== false) {
            $rows_test[] = $row;
        }
        // Shuffle the rows to have a unique scenario for each user
        shuffle($rows_test);

        // Creates a file to put shuffled data + training images in (nb_images = 1824 images)
        $path = $folder . '/mix_data/mixed_data_user_' . $id . '.csv';
        $f_mix = fopen($path, 'wb');
        if($f_mix === false){
            die('Error opening file ' . $path . ' for creation.');
        }

        fputcsv($f_mix, $first_line);
        // Puts the images in the file by alternating 3 training images and 240 testing images
        $nb_train_images = 6;
        $nb_images = 3;
        $nb_sessions = 0;
        for($i = 0; $i < $nb_train_images; $i += 3){
            fputcsv($f_mix, $rows_train[$i]);
            fputcsv($f_mix, $rows_train[$i+1]);
            fputcsv($f_mix, $rows_train[$i+2]);

            $pos = $nb_images * $nb_sessions;
            $put_nb_images = ($nb_images * ($nb_sessions+1));
            if($put_nb_images > count($rows_test)){
                $put_nb_images = count($rows_test);
            }
            for($j = $pos; $j < $put_nb_images; ++$j){
                fputcsv($f_mix, $rows_test[$j]);
            }
            $nb_sessions ++;
        }

        // Creates a file for each session
        $path = $folder . '/session_users/session_user_' . $id . '.csv';
        $f_session = fopen($path, 'wb');
        if($f_session === false){
            die('Error opening file ' . $path . ' for creation.');
        }

        // Creates a file to save the results for each user
        $path = $folder . '/save_users/save_user_' . $id . '.csv';
        $f_save = fopen($path, 'wb');
        if($f_save === false){
            die('Error opening file ' . $path . ' for creation.');
        }
        // Modifies the line of csv parameters to add choices and times columns in the save file
        array_push($first_line, "Choices","Times");
        fputcsv($f_save, $first_line);

        // Closes the files
        fclose($f_read_train);
        fclose($f_read_test);
        fclose($f_mix);
        fclose($f_session);
        fclose($f_save);
    }


    /**
     * Fill the session file at the beginning of a session, unless it is filled.
     */
    if($_SERVER["REQUEST_METHOD"] === "GET"){
        // Gets the number of images and the user id for one session
        $nb_images_session = 6;
        session_start();
        $user_id = (string)$_SESSION["user_id"];

        // Opens the shuffled data
        $path = $folder2 . '/mix_data/mixed_data_user_' . $user_id . '.csv';
        $lines = file($path);

        // If there are still images to be assessed
        if(count($lines) !== 1){
            $f_read = fopen($path, 'rb');
            if($f_read === false){
                die('Error opening file '. $path . ' to read from the get request.');
            }

            // Reads the file content
            $rows=[];
            while(($row = fgetcsv($f_read)) !== false) {
                $rows[] = $row;
            }
            // Closes the file
            fclose($f_read);

            // Opens the session file
            $path = $folder2 . '/session_users/session_user_' . $user_id . '.csv';
            $session_file = file($path);

            // If empty, fills it
            if(count($session_file) === 0){
                $f_write = fopen($path, 'wb');
                if($f_write === false){
                    die('Error opening file '. $path . ' to write the images for a session.');
                }

                //Extracts only nb_images_session images that we can display in one session, otherwise the rest
                if(count($lines) < $nb_images_session){
                    $nb_images_session = count($lines)-1;
                }
                for($i = 0; $i <= $nb_images_session; ++$i){
                    fputcsv($f_write, $rows[$i]);
                }

                // Closes the file
                fclose($f_write);

                // Deletes the images already processed in mix file
                $path = $folder2 . '/mix_data/mixed_data_user_' . $user_id . '.csv';
                $f_modif = fopen($path, 'wb');
                if($f_modif === false){
                    die('Error opening file '. $path . ' to delete images in the mixed file.');
                }

                // Skip the displayed images
                fputcsv($f_modif, $rows[0]);
                if(count($rows) >= $nb_images_session){
                    for($i = $nb_images_session+1, $iMax = count($rows); $i < $iMax; ++$i){
                        fputcsv($f_modif, $rows[$i]);
                    }
                }
                fclose($f_modif);
            }
        }
        // Sends user id on the client side
        echo $user_id;
    }

    /**
     * Deletes the session and mix files if the experiment is done (i.e. the two files are empty)
     */
    function deleteSessionMixUserFiles($id){
        global $folder2;
        $path_mix = $folder2 . '/mix_data/mixed_data_user_' . $id . '.csv';
        $lines_mix = file($path_mix);

        $path = $folder2 . '/session_users/session_user_' . $id . '.csv';
        $lines = file($path);
        if(count($lines_mix) === 1 && count($lines) === 0){
            unlink($folder2 . '/session_users/session_user_' . $id . '.csv');
            unlink($folder2 . '/mix_data/mixed_data_user_' . $id . '.csv');
        }
    }

    /**
     * Puts the user's choices and times in the save files and empties the session file if it is terminated.
     */
    if($_SERVER["REQUEST_METHOD"] === "POST"){
//        $user_stats=[];
        // Gets the body of post method : choices + times
        $user_stats = file_get_contents('php://input');
        // Decode json to php object
        $user_stats = json_decode($user_stats, true);

        // If the file is empty, leave the session during training
        if(!$user_stats){
            $error_message = 'Error downloading data !';
        }else{

            // Gets the id
            session_start();
            $user_id = (string)$_SESSION["user_id"];

            // Opens the session file
            $path = $folder2 . '/session_users/session_user_' . $user_id . '.csv';
            $f_read = fopen($path, 'rb');
            if($f_read === false){
                die('Error opening file ' . $path . ' to copy the displayed images.');
            }

            // Opens the save file
            $path = $folder2 . '/save_users/save_user_' . $user_id . '.csv';
            $f_save = fopen($path, 'ab');
            if($f_save === false){
                die('Error opening the file '. $path . ' to save the images into the user save file.');
            }

            // Passes the parameters and training phase
            $rows=[];
            for($i = 0; $i <= 3; ++$i){
                $rows[] = fgetcsv($f_read);
            }

            // Reads the idx evaluated rows to save with choices and times
            $idx = count($user_stats)/2;
            for($i = 0; $i < count($user_stats)/2; $i++){
                $row = fgetcsv($f_read);
                array_push($row, $user_stats[$i],  $user_stats[$i + $idx]);
                fputcsv($f_save, $row);
            }

            // If the session was not over
            if(($row = fgetcsv($f_read)) !== false){
                // Recover the remaining images
                $rows[] = $row;
                while(($row = fgetcsv($f_read)) !== false) {
                    $rows[] = $row;
                }

                // Opens the session file in writing mode
                $path = $folder2 . '/session_users/session_user_' . $user_id . '.csv';
                $f_write = fopen($path, 'wb');
                if($f_write === false){
                    die('Error opening file' . $path . 'to copy the displayed images.');
                }

                // Rewrite them, with the training images first
                foreach ($rows as $iValue) {
                    fputcsv($f_write, $iValue);
                }

            }else{
                // Else, empties the file to fill it with the following images
                $path = $folder2 . '/session_users/session_user_' . $user_id . '.csv';
                $f_write = fopen($path, 'wb');
                if($f_write === false){
                    die('Error opening file ' . $path . ' to copy the displayed images.');
                }
                file_put_contents($path, '');
            }
            // Closes the files
            fclose($f_read);
            fclose($f_save);
            fclose($f_write);

            // Check if the files are empty to be deleted
            deleteSessionMixUserFiles($user_id);
        }
    }

