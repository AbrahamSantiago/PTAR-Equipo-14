document.addEventListener('DOMContentLoaded', function() {
    // Código existente para el header
    window.addEventListener("scroll", function () {
        var header = document.querySelector("header");
        header.classList.toggle("fixed-top", window.scrollY > 0);
    });

    // Código para el hover del navbar
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('hover-color');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('hover-color');
        });
    });})