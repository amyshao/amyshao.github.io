
const navSlide = () => {
    const menu = document.querySelector('.menu');
    const nav = document.querySelector('.nav-links');
    const navlinks = document.querySelectorAll('.nav-links li');
    
    
    menu.addEventListener('click', () => {
        // toggle nav bar
        if (nav.style.transition) {
            nav.classList.toggle('nav-active');
            nav.style.transition = "";
        } else {
            nav.style.transition = `transform 0.5s ease-in-out`;
            nav.classList.toggle('nav-active');
        }
        //nav.style.transition = `transform 0.5s ease-in-out`;
        
        // animate nav links
        navlinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = "";
            } else {
                link.style.animation = `navfade 1s ease forwards ${index/8 }s`;
            }
            
        });
    });
    
}

navSlide();