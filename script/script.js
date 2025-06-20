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

// Animate sections on scroll and on first load for vertical reveal
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section, .about-bg.about-flex').forEach((section, i) => {
    setTimeout(() => {
        observer.observe(section);
    }, i * 200);
});

// Ensure all sections are visible if JS fails or on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('section, .about-bg.about-flex').forEach((section, i) => {
            setTimeout(() => {
                section.classList.add('visible');
            }, i * 200);
        });
    }, 200);
});

// Add animated floating effect to skill icons

document.querySelectorAll('.skill img').forEach((img, i) => {
    img.style.animation = `floatSkill 2.2s ease-in-out ${i * 0.13}s infinite alternate`;
});

// Floating keyframes for skill icons
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
@keyframes floatSkill {
  0% { transform: translateY(0) scale(1); }
  100% { transform: translateY(-10px) scale(1.08); }
}`;
document.head.appendChild(styleSheet);

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
