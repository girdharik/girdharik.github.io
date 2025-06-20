// Smooth scroll for navigation links and active tab highlighting

document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Highlight active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let scrollPos = window.scrollY || document.documentElement.scrollTop;
    let offset = 100;
    sections.forEach(section => {
        const top = section.offsetTop - offset;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`nav ul li a[href="#${id}"]`);
        if (scrollPos >= top && scrollPos < bottom) {
            navLink && navLink.classList.add('active');
        } else {
            navLink && navLink.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

// Add animated floating effect to skill icons
document.querySelectorAll('.skill img').forEach((img, i) => {
    img.style.animation = `floatSkill 2.2s ease-in-out ${i * 0.13}s infinite alternate`;
});

// Add animated floating effect to social/contact icons
document.querySelectorAll('.social-links img').forEach((img, i) => {
    img.style.animation = `floatSocial 2s ease-in-out ${i * 0.1}s infinite alternate`;
});

// Add animated floating effect to profile photo
document.querySelector('.profile-photo').style.animation = "floatProfile 3s ease-in-out infinite alternate";

// Floating keyframes for skill and social icons
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes floatSkill {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-10px) scale(1.08); }
}
@keyframes floatSocial {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-5px) scale(1.15); }
}
@keyframes floatProfile {
  0% { transform: translateY(0) scale(1); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
  100% { transform: translateY(-8px) scale(1.02); box-shadow: 0 15px 25px rgba(0,0,0,0.3); }
}`;
document.head.appendChild(styleSheet);

// Function to change the about section background
function changeAboutBackground(imageUrl) {
    document.documentElement.style.setProperty('--background-image', `url('${imageUrl}')`);
}

// Example of how to use it:
// To change the background later, you can call:
// changeAboutBackground('https://images.unsplash.com/new-image-url');

// Copy to clipboard for phone and email
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const value = this.getAttribute('data-copy');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(value);
        } else {
            const temp = document.createElement('input');
            document.body.appendChild(temp);
            temp.value = value;
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
        }
        this.classList.add('copied');
        setTimeout(() => this.classList.remove('copied'), 1200);
    });
});
