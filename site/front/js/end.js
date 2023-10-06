$.ajax({
    url: "controller.php?f=csn",
    type: "GET",
    success: function(response) {
        if(response){
            // console.log(response);
            document.getElementById("message").innerHTML = "Vous avez évalué toutes les sessions. L'expérience est finie !";
            document.getElementById("button").style.display = "none";
        }
    },
    error: function(xhr, status, error) {
        console.log("Error: " + error);
    }
});

