var express = require('express');
var MongoClient = require('mongodb').MongoClient
var router = express.Router();
var mongoose = require('mongoose');
require('dotenv').config()
const mongodb_uri = process.env.mongo_uri;
mongoose.connect(mongodb_uri);
var userModel = require('../model/user.schema');
var voterModel = require('../model/voter.schema');
var candidateModel = require('../model/candidate.schema');
var configurationModel = require('../model/configuration.schema');
var swal = require('sweetalert2');

var login_success = false;
var is_election_started = "No";
var is_voter_verified = "No";
var is_candidate_verified = "No";
var session = null;
var has_already_voted = "No";
var userDetail = null;
var verifiedCandidates = null;

function correctCase(str) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

function updateVoterDetails(session) {
    console.log("Inside Voter Details");

    return voterModel.find({ "voter_id": session.username }, function(err, res) {
        if (err) throw err;
        console.log(res);
        if (res[0].is_verified == "Yes") {
            is_voter_verified = "Yes";
        } else {
            is_voter_verified = "No";
        }

        if (res[0].has_voted == "Yes") {
            has_already_voted = "Yes";
        } else {
            has_already_voted = "No";
        }

    });
}

function updateCandidateDetails(session) {
    console.log("Inside Candidate Details");

    return candidateModel.find({ "candidate_id": session.username }, function(err, res) {
        if (err) throw err;
        console.log(res);
        if (res[0].is_verified == "Yes") {
            is_candidate_verified = "Yes";
        } else {
            is_candidate_verified = "No";
        }
    });
}

function updateElectionDetails() {
    return configurationModel.find({ "election_id": "1" }, function(err, res) {
        if (err) throw err;
        if (res[0].is_election_started == "Yes") {
            is_election_started = "Yes";
        } else {
            is_election_started = "No";
        }
    });
}

function updateVerifiedCandidates() {
    return candidateModel.find({ "is_verified": "Yes" }, function(err, res) {
        if (err) throw err;
        console.log("Inside Verified Candidate Update");
        verifiedCandidates = res;
    });
}

function updateUserDetails() {
    return userModel.find({ $or: [{ "role": "VOTER" }, { "role": "CANDIDATE" }] }, function(err, res) {
        if (err) throw err;
        console.log("Inside User Details");
        console.log(res);
        for (let i = 0; i < res.length; i++) {
            res[i].username = correctCase(res[i].username);
            res[i].role = correctCase(res[i].role);
        }

        userDetail = res;
    })
}

function login_proc(uname, pass, req) {
    return userModel.find({ "username": uname, "password": pass }, function(err, res) {
        if (err) throw err;
        if (res.length > 0) {
            console.log("Login Successfull");
            //Set Session for use
            user_uname = res[0].username;
            req.session.username = res[0].username;
            req.session.role = res[0].role;
            req.session.fullname = res[0].fullname;
            req.session.save();
            login_success = true;
        } else {
            console.log("Unsuccessful Login Attempt");
        }
    });
}

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

router.get('/login', function(req, res) {

    if (req.session != null && req.session != undefined && req.session.username != undefined && req.session.username != null) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/registerProcess', function(req, res) {
    var user = userModel();
    user.fullname = req.body.full_name;
    user.username = req.body.uname;
    user.password = req.body.pword;
    user.role = req.body.role;
    user.is_verified = "No";
    user.save();

    if (req.body.role == "VOTER") {
        var voter = voterModel();
        voter.voter_id = req.body.uname;
        voter.voter_name = req.body.full_name;
        voter.is_verified = "No";
        voter.has_voted = "No";
        voter.save();
    }

    if (req.body.role == "CANDIDATE") {
        var candidate = candidateModel();
        candidate.candidate_id = req.body.uname;
        candidate.candidate_name = req.body.full_name;
        candidate.is_verified = "No";
        candidate.tot_votes = 0;
        candidate.save();
    }
    res.render("reg_success");
});


router.post('/loginProcess', function(req, res) {

    let db_promise = login_proc(req.body.uname, req.body.pword, req);

    db_promise.then(() => {

        if (login_success === true) {
            res.send("Successful");
        } else {
            res.send("Unsuccessful");
        }
    });

});

router.post('/verifyUser', function(req, res) {
    console.log("Request Body");
    console.log(req);
    if (req.body.role == "Voter") {
        let filter = { "voter_id": req.body.uname.toLowerCase() };
        let update = { "is_verified": "Yes" };
        voterModel.updateOne(filter, update, function(err, docs) {
            console.log("Voter Update");
            if (err) { console.log(err) } else {
                console.log(docs);
            }
        });
    } else if (req.body.role == "Candidate") {
        let filter = { "candidate_id": req.body.uname.toLowerCase() };
        let update = { "is_verified": "Yes" };
        candidateModel.findOneAndUpdate(filter, update, function(err, docs) {
            console.log("Candidate Update");
            if (err) { console.log(err) } else {
                console.log(docs);
            }
        });
    }
    let filter = { "username": req.body.uname.toLowerCase() };
    let update = { "is_verified": "Yes" };
    userModel.findOneAndUpdate(filter, update, function(err, docs) {
        console.log("User Update");
        if (err) { console.log(err) } else {
            console.log(docs);
        }
    });
    res.send("Successful");
});



router.post('/castVote', function(req, res) {

    if (req.session.has_voted == true) {
        res.send("Unsuccessful");
        return;
    }

    candidateModel.find({ "candidate_id": req.body.cand }, function(err, res) {
        if (err) throw err;
        let filter = { "candidate_id": req.body.cand };
        let update = { "tot_votes": res[0].tot_votes + 1 };
        candidateModel.findOneAndUpdate(filter, update, function(err, docs) {
            if (err) { console.log(err) } else {
                req.session.has_voted = true;
                req.session.save();
                console.log(docs);
            }
        });
    });

    let filter = { "voter_id": req.session.username };
    let update = { "has_voted": "Yes" };
    voterModel.findOneAndUpdate(filter, update, function(err, docs) {
        if (err) { console.log(err); } else {
            console.log(docs);
        }
    });
    res.send("Successful");
});



router.get('/logOut', function(req, res) {
    req.session.destroy();
    res.redirect("/login");
});

router.get('/about', function(req, res) {
    res.render("about");
});

router.get('/result', function(req, res) {
    candidateModel.find({}, function(err, resu) {
        if (err) throw err;

        var results = [
            ["Candidate Name", "Total Votes"]
        ];

        for (var i = 0; i < resu.length; i++) {
            let tmp = [resu[i].candidate_name, resu[i].tot_votes];
            results.push(tmp);
        }

        res.send(JSON.stringify(results));
    });
});

router.get('/result_page', function(req, res) {

    let electionDetails = updateElectionDetails();
    electionDetails.then(() => {
        res.render('results', { election_status: is_election_started });
    });
});

router.get('/performVoting', function(req, res) {
    if (req.session.has_voted == true) {
        res.redirect("/dashboard");
        return;
    }
    let electionDetails = updateElectionDetails();
    electionDetails.then(() => {
        let verifiedCandidatePromise = updateVerifiedCandidates();
        verifiedCandidatePromise.then(() => {
            res.render('voting', { user_fullname: session.fullname, election_status: is_election_started, candidate_details: verifiedCandidates });
        });
    });
});

router.get('/switchElections', function(req, res) {
    configurationModel.find({ "election_id": "1" }, function(err, res) {
        if (err) throw err;
        if (res[0].is_election_started == "Yes") {
            let filter = { "election_id": "1" };
            let update = { "is_election_started": "No" };
            configurationModel.findOneAndUpdate(filter, update, function(err, docs) {
                console.log("Election Switch Update");
                if (err) { console.log(err) } else {
                    console.log(docs);
                }
            });
        } else {
            let filter = { "election_id": "1" };
            let update = { "is_election_started": "Yes" };
            configurationModel.findOneAndUpdate(filter, update, function(err, docs) {
                console.log("Election Switch Update");
                if (err) { console.log(err) } else {
                    console.log(docs);
                }
            });
        }
    });
    res.send("Successful");
});

router.get('/dashboard', function(req, res) {
    console.log(req.session);
    session = req.session;
    if (req.session == undefined || req.session == null || req.session.username == undefined || req.session.username == null) {
        res.redirect("/login");
        return;
    }

    if (req.session.role === "EA") {
        let electionDetails = updateElectionDetails();
        electionDetails.then(() => {
            let userDetails = updateUserDetails();
            userDetails.then(() => {
                console.log("Inside EA View");
                console.log(userDetail);
                res.render("dash_ea", { user_fullname: session.fullname, election_status: is_election_started, user_details: userDetail });
            });
        });
    } else if (req.session.role === "VOTER") {
        let electionDetails = updateElectionDetails();
        electionDetails.then(() => {
            console.log("Inside Election Details Promise");
            console.log(session);
            let voterDetails = updateVoterDetails(session);
            voterDetails.then(() => {
                console.log("Inside Render: ", is_voter_verified, is_election_started);
                res.render("dash_voter", { user_fullname: session.fullname, voter_verification: is_voter_verified, election_status: is_election_started, already_voted: has_already_voted });
            });
        });
    } else if (req.session.role === "CANDIDATE") {
        let electionDetails = updateElectionDetails();
        electionDetails.then(() => {
            let candidateDetails = updateCandidateDetails(session);
            candidateDetails.then(() => {
                console.log(session.fullname, is_candidate_verified, is_election_started);
                res.render("dash_candidate", { user_fullname: session.fullname, candidate_verification: is_candidate_verified, election_status: is_election_started });
            });
        });
    }
});

module.exports = router;