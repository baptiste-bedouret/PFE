// https://javascript.info/fetch
// https://developer.mozilla.org/fr/docs/Learn/JavaScript/Client-side_web_APIs/Fetching_data
// https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data-fr
// https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage

/**
 * Determines the exact path to the image from the csv file.
 *
 * @param {String} imgPath - Contains the distortion applied to the image
 * @returns {String} distorsion - Folder to access the image
 */
function pathToImage(imgPath){
    let letter = imgPath[0];
    let distortion;
    switch(letter){
        case 'b':
            if(imgPath[1] === 'l'){
                distortion = 'blur';
            }else{
                distortion = 'brightness'; 
            }
            break;
        case 'g':
            distortion = 'geometric';
            break;
        case 'n':
            distortion = 'noise';
            break;
        default:
            break;
    }

    return distortion;
}


/**
 * The first get request is to fill the session file, whose respond body contains the user id.
 *
 * The second request is to get the content of the session file.
 * Reads the csv data and put the information from each row into tables and then pass it to script.js. 
 */
let imgs1=[], imgs2=[], labels1=[], labels2=[];
function readCsv(){
    var file_path = "";

    $.ajax({
        url: "controller.php?p=bc",
        type: "GET",
        success: function(response) {
            file_path += response;
    //create a new file with the N images to display in this experience
    fetch(file_path + "csv-data.php", {
        method: "GET",
    })
    .then(response => response.text())
    .then(body => {
        // console.log("File successfully opened !", body);
        let id = body;
        $.ajax({
            url: "controller.php?p=bdus",
            type: "GET",
            success: function(response) {
                //gets the content of csv file
                const path = response + "session_user_" + id + ".csv";
                // console.log("bdus : " + path);

                fetch(path)
                .then(response => response.text())
                .then(data => {
                    //reads and extract the content of the session_user_id.csv file
                    let csvJson = Papa.parse(data, {encoding: "utf-8", header: true});
                    let csvData = csvJson.data;

                    //storages in the arrays
                    for(let i=0; i < csvData.length-1; i++){
                        let debutPath = pathToImage(csvData[i]["Distortion"]);

                        //creates the exact path to images
                        let noisy = debutPath.concat('/','perturbation');
                        let sup = debutPath.concat('/','sup');

                        //add to images and labels to arrays
                        imgs1.push(noisy.concat('/',csvData[i]["Noisy_image"]));
                        imgs2.push(sup.concat('/',csvData[i]["Sup_image"]));
                        labels1.push(csvData[i]["Noisy_image_class"]);
                        labels2.push(csvData[i]["Original_image_class"]);
                    }

                    //makes a local storage to recover the arrays in the script.js.
                    localStorage.setItem('imgs1', JSON.stringify(imgs1));
                    localStorage.setItem('imgs2', JSON.stringify(imgs2));
                    localStorage.setItem('labels1', JSON.stringify(labels1));
                    localStorage.setItem('labels2', JSON.stringify(labels2));

                })
                .catch((error) => {
                    console.error(error);
                });
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    })
    .catch((error) => {
        console.error(error);
    });
        },
        error: function(xhr, status, error) {
            console.log("Error: " + error);
        }
    });
}


/**
 * Post a request whose body contains an array with the user's choices and times.
 */
function writeCsv(){
    //gets the choices and times for a session
    let userChoices = JSON.parse(localStorage.getItem('choices'));
    let userTimer = JSON.parse(localStorage.getItem('times'));

    //concatenates the two arrays to simplify the body of post method
    let userParams = userChoices.concat(userTimer);
    userParams = JSON.stringify(userParams);

    //post the choices and times array to the server
    fetch("back/csv/csv-data.php", {
        method: "POST",
        body: userParams,
    })
    .then(response => response.text())
    .then(body => {
        console.log("File successfully saved !", body);
    })
    .catch((error) => {
        console.error(error);
    });
}

module.exports = { pathToImage }


