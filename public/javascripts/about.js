$(document).ready(function() {
    $(".md-content").append("<div></div>");
    var mailAddress = new Array("sakshiKapse@gmail.com", "suja.hash69@gmail.com", "akhil.pillai@gmail.com", "azhar.gourse@gmail.com");
    var phoneNumber = new Array("9074470033", "8372823914", "9195660742", "8590321452");
    var webSite = new Array("www.amigos.com", "www.amigos.com", "www.amigos.com", "www.amigos.com");
    var currentPerson, personAddress, personPhoneNumber, personWebSite;

    $('#amazingTeam  .ch-info-back a').on("click", function() {
        $('.md-overlay').addClass('md-overlay-show');
        $('.md-modal').addClass('md-show');
        $('md-content', '.md-modal').addClass('md-show.md-effect-9 .md-content');
        var $h3SelectName = $(this).closest('.section4_article').find(this + " > h3").html();
        var $selectParentContent = $(this).closest('.article_center4').find(".md-content div");

        $('#appendDiv').remove();
        currentPerson = $(this).attr('id');
        switch (currentPerson) {
            case "idPerson1":
                personAddress = mailAddress[0];
                personPhoneNumber = phoneNumber[0];
                personWebSite = webSite[0];
                break;
            case "idPerson2":
                personAddress = mailAddress[1];
                personPhoneNumber = phoneNumber[1];
                personWebSite = webSite[1];
                break;
            case "idPerson3":
                personAddress = mailAddress[2];
                personPhoneNumber = phoneNumber[2];
                personWebSite = webSite[2];
                break;
            case "idPerson4":
                personAddress = mailAddress[3];
                personPhoneNumber = phoneNumber[3];
                personWebSite = webSite[3];
                break;
        }
        var textToInsert = [];
        var i = 0;
        textToInsert[i++] = '<div id="appendDiv">';
        textToInsert[i++] = '<p></p>';
        textToInsert[i++] = '<ul><li><strong>Mail:</strong>';
        textToInsert[i++] = personAddress + '</li><li><strong>Phone number:</strong>';
        textToInsert[i++] = personPhoneNumber + '</li><li><strong>Website:</strong><a>';
        textToInsert[i++] = personWebSite + '</a></li></ul><button class=".md-close">Close me</button><div>';
        $($selectParentContent).append(textToInsert.join(''));
        $(".md-content > div p").text($h3SelectName);
        return false;
    });

    $('div', '.md-content').on("click", "button", function() {
        removeModalViewClass();
        return false;
    });

    $('.md-overlay').on("click", function() {
        removeModalViewClass();
        return false;
    });

    function removeModalViewClass() {
        $('.md-overlay').removeClass('md-overlay-show');
        $('.md-modal').removeClass('md-show');
        $('.md-modal md-content').removeClass('md-show.md-effect-9 .md-content');
    }

    $('.about-me-img').hover(function() {
        $('.authorWindowWrapper').stop().fadeIn('fast').find('p').addClass('trans');
    }, function() {
        $('.authorWindowWrapper').stop().fadeOut('fast').find('p').removeClass('trans');
    });

});