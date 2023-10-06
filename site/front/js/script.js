// Gets the images and labels in the session file, from the csv-operation.js
const imgs = JSON.parse(localStorage.getItem('imgs1'));
const sups = JSON.parse(localStorage.getItem('imgs2'));
const label1 = JSON.parse(localStorage.getItem('labels1'));
const label2 = JSON.parse(localStorage.getItem('labels2'));

// Index for the currently displayed image
let index = 0;

/**
 * Converts the user's choices from the evaluation form, between 0 and 5.
 * Then, storing them in the 'choices' array.
 *
 * @param {String} choice - User choice from the evaluation form
 */
let choices = [];
let times = [];
let numChoice;
function convertChoice(choice) {
    const evalu = choice.id;
    switch(evalu){
        case 'excellent':
            numChoice = 5;
            break;
        case 'good':
            numChoice = 4;
            break;
        case 'fair':
            numChoice = 3;
            break;
        case 'poor':
            numChoice = 2;
            break;
        case 'bad':
            numChoice = 1;
            break;
        default:
            numChoice = 0;
            break;
    }
    choices.push(numChoice);
}


/**
 * Calls the end of session page.
 */
function callPagePHP() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.href='controller.php?to=end', true);
    if(xhr.open){
        console.log("Page PHP appelée avec succès");
    }else{
        console.log("Erreur lors de l'appel de la page PHP");
    }
    xhr.send();
}


let timeoutId;
// Variables for time
var start, end;

/**
 * Interactions after a user choice.
 *
 * @param {String} choice - User choice from the evaluation form
 */
function choiceControl(choice) {
    if(index >= 3 && index < imgs.length){
        // Evaluation phase : store choice and time for an image
        end = new Date();
        let choiceTime = (end.getTime() - start.getTime())/1000;
        times.push(Math.round(choiceTime));
        convertChoice(choice);
    }
    if(index==2){
        // Separation between training and evaluation phase
        index ++;
        var getSelectedValue = document.querySelector('input[name="scale"]:checked');
        if(getSelectedValue !=null){
            clearTimeout(timeoutId);
        }
        // Hide elements and displays the start button
        document.getElementById("container").style.display = "none";
        document.getElementById("button").style.display = "inline-block";
        document.getElementById("test").innerHTML="Session d'évaluation";
    }else{
        index ++;
        // If all images in the session were evaluated : save the choices and call the end of session page
        if(index == imgs.length){
            save();
            callPagePHP();
        }
        var getSelectedValue = document.querySelector('input[name="scale"]:checked');
        if(getSelectedValue !=null){
            clearTimeout(timeoutId);
        }
        // Hide all elements during 5 seconds before displaying the next images and labels
        document.getElementById("button").style.display = "none";
        document.getElementById("container").style.display = "none";
        document.getElementById("dbutton").style.display = "none";
        setTimeout(displayNewImage, 5000);
    }
}


/**
 *  Separates the different labels of the string.
 *
 * @param {number} index - Current position in the tables
 */
function spliting(index) {
    var underscoreString = label2[index];

    // Split the string into an array of words
    var wordsArray = underscoreString.split("_");

    // Gets the div where we want to display the list
    var container = document.getElementById('ground_tr');
    container.innerHTML = '';
    for (var i = 0; i < wordsArray.length; i++) {
        var p = document.createElement('p');
        var text = document.createTextNode(wordsArray[i]);
        p.appendChild(text);
        container.appendChild(p);
    }

}

/**
 * Displays only the first images and labels in the tables.
 *
 * @param {number} idx - Current position in the tables
 */
function displayFirstImage(idx) {
    if(idx==0){
        start = new Date();
        document.getElementById("button").style.display = "none";
        $.ajax({
            url: "controller.php?p=bdi",
            type: "GET",
            success: function(response) {
                document.getElementById("img").src = `${response}${imgs[idx]}`;
                document.getElementById("superimposed").src = `${response}${sups[idx]}`;
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error);
            }
        });
        spliting(idx);
        document.getElementById("classification").innerHTML = label1[idx];
        document.getElementById("container").style.display = "flex";
        // Gives the user 20 seconds to make a choice
        timeoutId = setTimeout(choiceControl, 20000, 'null');
    }
}


/**
 * Displays the next images and labels in the tables.
 */
function displayNewImage() {
    if(index < imgs.length){
        start = new Date();
        document.getElementById("button").style.display = "none";
        document.getElementById("test").innerHTML="";
        $.ajax({
            url: "controller.php?p=bdi",
            type: "GET",
            success: function(response) {
                document.getElementById("img").src = `${response}${imgs[index]}`;
                document.getElementById("superimposed").src = `${response}${sups[index]}`;
            },
            error: function(xhr, status, error) {
                console.log("Error: " + error);
            }
        });
        spliting(index);
        document.getElementById("classification").innerHTML = label1[index];
        document.getElementById("container").style.display = "flex";

        const formControls = document.getElementsByClassName("form-control");
        for (let i = 0; i < formControls.length; i++) {
            if (formControls[i].checked) {
                formControls[i].checked = false;
            }
        }
        document.getElementById("dbutton").style.display = "inline-block";
        // Gives the user 20 seconds to make a choice
        timeoutId = setTimeout(choiceControl, 20000, 'null');
    }
}


/**
 * Stores choices and times, then calls the write_csv() function to transmit to the server.
 */
function save(){
    localStorage.setItem('choices', JSON.stringify(choices));
    localStorage.setItem('times', JSON.stringify(times));
    writeCsv();
}




// Functions to simplify tests
function setIndex(newIndex){
    index = newIndex;
}

function getIndex(){
    return index;
}

function setChoices(){
    choices=[];
}

function getChoices(){
    return choices;
}

function setTimes(){
    times=[];
}

function getTimes(){
    return times;
}

module.exports = {
    displayFirstImage,
    choiceControl,
    displayNewImage,
    setIndex,
    getChoices,
    getIndex,
    setChoices,
    getTimes,
    setTimes,
    imgs,
    sups,
    label1,
    label2,
    index
}



