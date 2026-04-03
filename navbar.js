// Navbar load hone ka function
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // Navbar load hone ke baad events attach karein
            initNavbarEvents();
            
            // Dark mode state check karein
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark-mode');
            }
        });
}

function initNavbarEvents() {
    const themeBtn = document.getElementById('themeBtn');
    
    // 1. Theme Toggle Logic
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            const circle = document.querySelector('.color-circle');
            if (circle) {
                circle.style.transform = isDark ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        });
    }

    
   
    const navLinksContainer = document.getElementById('navLinks');
    const mobileLinks = document.querySelectorAll('.nav-item');

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Check karein ki kya mobile menu active hai
            if (navLinksContainer && navLinksContainer.classList.contains('mobile-active')) {
                // toggleMobileMenu() function ko call karein jo navbar.js mein pehle se hai
                if (typeof window.toggleMobileMenu === 'function') {
                    window.toggleMobileMenu();
                }
            }
        });
    });
}

// MOBILE MENU LOGIC (Iska Global scope hona zaroori hai)
window.toggleMobileMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.classList.toggle('mobile-active');
        
        // Body scroll lock (Jab menu khula ho toh piche ka page scroll na ho)
        if (navLinks.classList.contains('mobile-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
};

// Page load par navbar load karein
document.addEventListener('DOMContentLoaded', loadNavbar);