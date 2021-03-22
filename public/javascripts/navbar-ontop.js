(function() {

    var className = "navbar-ontop"

    // we start hidden, to avoid flickering
    document.write("<style id='temp-navbar-ontop'>.navbar {opacity:0; transition: none !important}</style>")

    function update() {
        // toggle className based on the scrollTop property of document
        var nav = document.querySelector(".navbar")

        if (window.scrollY > 15)
            nav.classList.remove(className)
        else
            nav.classList.add(className)
    }

    document.addEventListener("DOMContentLoaded", function(event) {
        $(window).on('show.bs.collapse', function(e) {
            $(e.target).closest("." + className).removeClass(className);
        })

        $(window).on('hidden.bs.collapse', function(e) {
            update()
        })
        update()
            // still hacking to avoid flickering
        setTimeout(function() {
            document.querySelector("#temp-navbar-ontop").remove()
        })
    });

    window.addEventListener("scroll", function() {
        update()
    })

})();