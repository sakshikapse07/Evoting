function login() {
    var username = $('#username').val();
    var password = $('#password').val();

    let formData = new FormData();
    formData.append("uname", username);
    formData.append("pword", password);
    let data = new URLSearchParams(formData);
    fetch('/loginProcess', {
            method: 'POST',
            body: data
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data == "Unsuccessful") {
                swal({
                    title: "Bad job!",
                    text: "Login Unsuccessful !",
                    icon: "warning",
                    button: "Oppss !!",
                });
            }

            if (data == "Successful") {
                window.location.href = "/dashboard";
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function checkReg() {
    let name = $('#name').val();
    let mail = $('#mail').val();
    let pass = $('#pass').val();
    let role = $('#job').val();

    if (name == '' || mail == '' || pass == '' || role == '') {
        swal({
            title: "Bad job!",
            text: " Please fill all form input !",
            icon: "warning",
            button: "Oppss !!",
        });
        // alert("Please fill all form input");
        return false;
    }
}