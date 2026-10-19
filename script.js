let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (typeof lightbox !== 'undefined') {
    lightbox.option({
        fadeDuration: 0,
        imageFadeDuration: 0,
        resizeDuration: 0,
        wrapAround: true
    });
}

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-menu');
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}