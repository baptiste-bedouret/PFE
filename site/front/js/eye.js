// Get all password input fields, toggle buttons, and icons
/**
 * @type {NodeList} - NodeList of all password input fields on the page
 */
let passwordInputs = document.querySelectorAll("input[type='password']");

/**
 * @type {NodeList} - NodeList of all toggle buttons on the page
 */
let toggles = document.querySelectorAll(".toggle");

/**
 * @type {NodeList} - NodeList of all icons on the page
 */
let icons = document.querySelectorAll(".fa-solid");

// Add event listeners to the toggle buttons to call the show function when clicked
toggles.forEach(function(toggle, index) {
    toggle.addEventListener("click", function() {
        show(index);
    }, false);
});

/**
 * Function to toggle password visibility on and off when the toggle button is clicked
 * @param {number} index - The index of the password input, toggle button, and icon to toggle
 */
function show(index) {
    // Get the password input, toggle button, and icon corresponding to the index
    let passwordInput = passwordInputs[index],
        icon = icons[index];

    // If the password input is currently hidden
    if (passwordInput.type === "password") {
        // Show the password
        passwordInput.type = "text";
        // Change the icon color to black to indicate the password is visible
        icon.style.color = "black";
    } else {
        // Otherwise, if the password is currently visible
        // Hide the password
        passwordInput.type = "password";
        // Change the icon color to grey to indicate the password is hidden
        icon.style.color = "grey";
    }
}