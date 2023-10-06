
/**
 * Perform an AJAX search request based on the selected search criteria.
 */
function search() {

    // Get the search value and search criteria
    const value = document.getElementById('value').value;
    const searchBy = document.querySelector('input[name="search_by"]:checked').value;
    // Make an AJAX request to the search-user.php endpoint
    $.ajax({
        url: "back/admin/search-user.php",
        type: "POST",
        data: {value: value, search_by: searchBy},
        dataType: "json",
        success: function(result) {
            // If an error occurred during the search, display an error message
            if ('error' in result) {
                $("#result").text(result.error);
                $("#remove").hide();
                $("#user-results").hide();
            } else {
                // Otherwise, display the search results
                $("#result").html("<p>Id: " + result[0].id
                    + "<br>Email: " + result[0].email
                    + "<br>Password: " + result[0].mdp
                    + "<br>Age range: " + result[0].age
                    + "<br>Date of creation: " + result[0].date_creation
                    + "</p>");
                $("#remove").show();
                $("#user-results").show();
            }
        },
        // error: function(xhr, status, error) {
        //     // Handle AJAX errors by logging the error to the console
        //     console.error("AJAX error:", error);
        // }
        error: function(xhr, status, error) {
            // Handle AJAX errors by displaying an error message
            console.error('Error:', error);
            $("#remove").hide();
            $("#user-results").hide();
        }
    });
}

/**
 * This function is called when the user clicks on the "Remove" button. It sends a
 * request to the server to remove the user with the ID shown in the search results.
 * If the request is successful, the search results are hidden and a message is shown.
 * If there is an error, an error message is shown instead.
 */
function remove() {
    // Extract the ID of the user from the search results
    let id = $("#result p").text().match(/Id: (\d+)/)[1];
    // Ask the user to confirm before proceeding with the removal
    if (confirm("Are you sure you want to remove this user?")) {
        // Send a request to the server to remove the user
        $.ajax({
            url: "back/admin/remove-user.php",
            type: "POST",
            dataType: "json",
            data: {
                id: id
            },
            success: function(result) {
                // If the server returns an error message, display it
                if ('error' in result) {
                    $("#result").text(result.error);
                    $("#remove").hide();
                    $("#user-results").hide();
                } else {
                    // Otherwise, display a success message
                    $("#result").text(result.message);
                    $("#remove").hide();
                    $("#user-results").hide();
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // If there is an AJAX error, log it to the console
                console.error('Error:', errorThrown);
            }
        });
    }
}

/**
 * Function to download user results as a CSV file using ajax
 */
function downloadUserResults() {
    // Get the user ID from the result paragraph text
    let id = $("#result p").text().match(/Id: (\d+)/)[1];

    // Make an ajax request to download the user results
    $.ajax({
        url: "back/admin/download-user-results-csv.php",
        method: "POST",
        data: { id: id },
        xhrFields: {
            responseType: "blob"
        },
        success: function(data, textStatus, jqXHR) {
            // If the request is successful, create a blob object with the response data
            let blob = new Blob([data], { type: "text/csv" });
            // Create a URL for the blob object
            let url = window.URL.createObjectURL(blob);
            // Create an anchor element and set the href and download attributes
            let a = document.createElement("a");
            a.href = url;
            a.download = "save_user_" + id + ".csv";
            // Append the anchor element to the document body and click it to start the download
            document.body.appendChild(a);
            a.click();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // If the request fails with a 404 error, display an error message
            alert("File not found.");
        }
    });
}

/**
 * Downloads CSV results for a given image name using AJAX.
 */
function downloadImgResults() {
    // Get the image name from the input box
    const imageName = document.getElementById("imageName").value;

    // Send an AJAX request to the PHP script to generate the CSV file
    $.ajax({
        type: "POST",
        url: "back/admin/download-img-results-csv.php",
        data: { imageName: imageName },
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data, textStatus, jqXHR) {
            // If the request is successful, create a blob object with the response data
            const blob = new Blob([data], { type: "text/csv" });
            // Create a URL for the blob object
            const url = window.URL.createObjectURL(blob);
            // Create an anchor element and set the href and download attributes
            const a = document.createElement('a');
            a.href = url;
            a.download = 'results.csv';
            // Append the anchor element to the document body and click it to start the download
            document.body.appendChild(a);
            a.click();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // If the request fails with a 404 error, display an error message
            alert("Sup image not found!");
        }
    });
}

/**
 * Downloads a CSV file using AJAX with all users.
 */
function downloadCSV() {
    // Send an AJAX request to the PHP script to generate the CSV file
    $.ajax({
        type: "POST",
        url: "back/admin/download-users-csv.php",
        xhrFields: {
            responseType: 'blob'
        },
        success: function(data, textStatus, jqXHR) {
            // If the request is successful, create a blob object with the response data
            const blob = new Blob([data], { type: "text/csv" });
            // Create a URL for the blob object
            const url = window.URL.createObjectURL(blob);
            // Create an anchor element and set the href and download attributes
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users.csv';
            // Append the anchor element to the document body and click it to start the download
            document.body.appendChild(a);
            a.click();
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // If the request fails, display an error message
            alert("Error: " + errorThrown);
        }
    });
}

/**
* Replaces user email addresses and passwords with unique IDs using AJAX.
*/
function replaceEmailsPassWithIDs() {
// Confirm with the user before removing personal data
    if (confirm("Are you sure you want to remove personal data?")) {
        // Send an AJAX request to the PHP script to replace email addresses and passwords with unique IDs
        $.ajax({
            type: "POST",
            url: "back/admin/replace-emails-pass-with-ids.php",
            success: function(response) {
                alert(response);
            },
            error: function() {
                alert("An error occurred while replacing emails and passwords.");
            }
        });
    }
}

module.exports = {
    search,
    remove,
    downloadUserResults,
    downloadImgResults,
    downloadCSV,
    replaceEmailsPassWithIDs
}