function verify_user(username, role) {
    let formData = new FormData();
    formData.append("uname", username);
    formData.append("role", role);
    let data = new URLSearchParams(formData);
    fetch('/verifyUser', {
            method: 'POST',
            body: data
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data == "Successful") {
                swal({
                    title: "Great job !",
                    text: " User Verified ",
                    icon: "success",
                    button: "Yeahh !!",
                    // setTimeout:2000,
                });
                // alert(data);
                window.location.reload();
            } else {
                alert("Please Try Again");
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function switchElections() {
    fetch('/switchElections')
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data == "Successful") {

                // alert(data);
                swal({
                    title: "Great job !",
                    text: " ",
                    icon: "success",
                    button: "Yeahh !!",
                    // setTimeout:2000,
                });
                window.location.reload();
            } else {
                alert("Please Try Again");
            }
        })
        .catch(error => {
            console.log(error);
        });
}