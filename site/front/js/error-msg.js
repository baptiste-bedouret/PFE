// Select the error message container and error message element
/**
 * @type {HTMLElement} - The error message container
 */
let errorContainer = document.getElementById("error");

/**
 * @type {HTMLElement} - The error message element
 */
let errorMsg = document.getElementById("errMsg");

/**
 * @type {HTMLElement} - The message element
 */
let msg = document.getElementById("msg");

// Check if the URL contains an error query parameter
/**
 * @type {URLSearchParams} - The URL search params object containing query parameters
 */
let urlParams = new URLSearchParams(window.location.search);

/**
 * @type {string|null} - The error message string from the "error" query parameter, or null if not present
 */
let error = urlParams.get("error");

/**
 * @type {string|null} - The message string from the "message" query parameter, or null if not present
 */
let message = urlParams.get("message");

if (error) {
    // Display the error message container and set the error message element to the error string
    errorContainer.style.display = "block";
    errorMsg.innerHTML = error;
    msg.innerHTML = "";
} else if(message) {
    // Hide the error message container and set the message element to the message string
    errorContainer.style.display = "none";
    errorMsg.innerHTML = "";
    msg.innerHTML = message;
}