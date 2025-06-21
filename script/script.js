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

// Enhanced copy to clipboard for phone and email with better feedback
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const value = this.getAttribute('data-copy');
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(value)
                .then(() => {
                    showCopyFeedback(this);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    fallbackCopy(this, value);
                });
        } else {
            fallbackCopy(this, value);
        }
    });
});

// Fallback copy method for browsers without clipboard API
function fallbackCopy(element, text) {
    const temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = text;
    temp.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback(element);
    } catch (err) {
        console.error('Fallback copy failed: ', err);
    }
    
    document.body.removeChild(temp);
}

// Show visual feedback for successful copy
function showCopyFeedback(element) {
    // Add copied class for CSS animation
    element.classList.add('copied');
    
    // Create and show a feedback message
    const feedback = document.createElement('div');
    feedback.className = 'copy-feedback';
    feedback.textContent = 'Copied!';
    feedback.style.position = 'fixed';
    feedback.style.zIndex = '9999';
    feedback.style.background = 'rgba(76, 175, 80, 0.9)';
    feedback.style.color = 'white';
    feedback.style.padding = '8px 12px';
    feedback.style.borderRadius = '4px';
    feedback.style.fontSize = '14px';
    feedback.style.transition = 'opacity 0.3s, transform 0.3s';
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(10px)';
    
    // Get position near the clicked button
    const rect = element.getBoundingClientRect();
    feedback.style.top = `${rect.top - 40}px`;
    feedback.style.left = `${rect.left + rect.width/2 - 30}px`;
    
    // Add to DOM
    document.body.appendChild(feedback);
    
    // Trigger animation
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove feedback element after animation
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            document.body.removeChild(feedback);
            element.classList.remove('copied');
        }, 300);
    }, 1500);
}

// Function to calculate and update job durations - enhanced version
function updateJobDurations() {
    const currentDate = new Date();
    
    document.querySelectorAll('.job-duration[data-start-date]').forEach(element => {
        const startDate = new Date(element.getAttribute('data-start-date'));
        const endDate = element.hasAttribute('data-end-date') 
            ? new Date(element.getAttribute('data-end-date')) 
            : currentDate;
        
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth() + (years * 12);
        
        const yearsText = Math.floor(months / 12);
        const monthsText = months % 12;
        
        let durationText = '';
        
        if (element.hasAttribute('data-end-date')) {
            // For previous jobs
            const startMonthYear = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const endMonthYear = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            durationText = `${startMonthYear} - ${endMonthYear} · `;
        } else {
            // For current job
            const startMonthYear = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            durationText = `${startMonthYear} - Present · `;
        }
        
        if (yearsText > 0) {
            durationText += `${yearsText} yr${yearsText > 1 ? 's' : ''} `;
        }
        
        if (monthsText > 0 || yearsText === 0) {
            durationText += `${monthsText} mo${monthsText > 1 ? 's' : ''}`;
        }
        
        element.textContent = durationText;
        element.setAttribute('title', `Duration updated on ${currentDate.toLocaleDateString()}`);
    });
}

// Initialize the multiple roles functionality
function initMultipleRoles() {
    // Create toggle buttons for companies with multiple roles
    document.querySelectorAll('.work-card').forEach(workCard => {
        // Check if this company has multiple roles data
        if (workCard.hasAttribute('data-has-multiple-roles')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'company-roles-toggle';
            toggleBtn.textContent = '+ Show all roles';
            toggleBtn.setAttribute('aria-expanded', 'false');
            
            // Create multiple roles container
            const rolesContainer = document.createElement('div');
            rolesContainer.className = 'multiple-roles';
            
            // Get the company name for data binding
            const companyName = workCard.querySelector('.company-name').textContent;
            
            // Example structured data for multiple roles
            // In a real scenario, this would likely come from your data source
            const exampleRoles = [
                {
                    title: "Software Engineer II",
                    startDate: "2022-01",
                    endDate: "2022-12",
                    description: "Developed core features for the cloud platform"
                },
                {
                    title: "Senior Software Engineer",
                    startDate: "2023-01",
                    endDate: "",  // Empty for current role
                    description: "Leading development team and architecting new solutions"
                }
            ];
            
            // Only add for Microsoft as an example
            if (companyName === "Microsoft") {
                // Create role items
                exampleRoles.forEach(role => {
                    const roleItem = document.createElement('div');
                    roleItem.className = 'role-item';
                    
                    const startDate = new Date(role.startDate);
                    const endDate = role.endDate ? new Date(role.endDate) : new Date();
                    
                    const startMonthYear = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    const endMonthYear = role.endDate ? 
                        new Date(role.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 
                        'Present';
                    
                    roleItem.innerHTML = `
                        <div class="role-title">${role.title}</div>
                        <div class="role-duration">${startMonthYear} - ${endMonthYear}</div>
                        <div class="role-desc">${role.description}</div>
                    `;
                    
                    rolesContainer.appendChild(roleItem);
                });
                
                // Insert the roles container and button
                const jobMeta = workCard.querySelector('.job-meta');
                jobMeta.parentNode.insertBefore(rolesContainer, jobMeta.nextSibling);
                jobMeta.parentNode.insertBefore(toggleBtn, rolesContainer);
                
                // Add toggle functionality
                toggleBtn.addEventListener('click', () => {
                    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                    toggleBtn.setAttribute('aria-expanded', !isExpanded);
                    toggleBtn.textContent = isExpanded ? '+ Show all roles' : '- Hide roles';
                    rolesContainer.classList.toggle('visible');
                });
            }
        }
    });
}

// Update job durations automatically every day
function setupAutomaticDurationUpdates() {
    // Update once on load
    updateJobDurations();
    
    // Check if we've updated today
    const today = new Date().toLocaleDateString();
    const lastUpdated = localStorage.getItem('lastDurationUpdate');
    
    if (lastUpdated !== today) {
        // Save that we've updated today
        localStorage.setItem('lastDurationUpdate', today);
    }
    
    // Set a check every hour in case the page stays open
    setInterval(() => {
        const currentDay = new Date().toLocaleDateString();
        const savedDay = localStorage.getItem('lastDurationUpdate');
        
        if (savedDay !== currentDay) {
            updateJobDurations();
            localStorage.setItem('lastDurationUpdate', currentDay);
        }
    }, 3600000); // Check every hour
}

// Call when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setupAutomaticDurationUpdates();
    initMultipleRoles();
    
    // Rest of your existing code
    // ...existing code...
});
