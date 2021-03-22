function cast_vote(cand_id) {
    let formData = new FormData();
    formData.append("cand", cand_id);
    let data = new URLSearchParams(formData);
    fetch('/castVote', {
            method: 'POST',
            body: data
        })
        .then(response => response.text())
        .then(data => {
            console.log(data);
            if (data == "Successful") {
                alert(data);
                window.location.reload();
            } else {
                alert("Please Try Again");
            }
        })
        .catch(error => {
            console.log(error);
        });
}