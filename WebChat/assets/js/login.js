function validate() {
    var uname = document.getElementById("uname");
    if (uname === "" || uname === null) {        
        return false;
    }
    return true;
}


$('#form').on('submit', function (e) {
    var uname = $('#uname');

    // Check if there is an entered value
    if (!uname.val()) {
        // Add errors highlight
        uname.closest('.form-group').removeClass('has-warning').addClass('has-error');

        // Stop submission of the form
        e.preventDefault();
    } else {
        // Remove the errors highlight
        uname.closest('.form-group').removeClass('has-warning').addClass('has-success');
    }
});