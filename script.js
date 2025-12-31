// Email obfuscation - decode on page load
(function() {
    const obfuscated = [13, 111, 110, 111, 124, 77, 128, 129, 114, 131, 114, 123, 128, 59, 114, 113, 130];
    
    function decodeEmail() {
        try {
            // Decode using reverse character code shift
            const offset = obfuscated[0];
            const charCodes = obfuscated.slice(1);
            const email = String.fromCharCode(...charCodes.map(c => c - offset));
            
            const emailLink = document.getElementById('email-link');
            const emailText = document.getElementById('email-text');
            
            if (emailLink && emailText) {
                emailLink.href = 'mailto:' + email;
                emailText.textContent = email;
                return true;
            }
            return false;
        } catch (e) {
            console.error('Email decoding error:', e);
            // Fallback if decoding fails
            const emailLink = document.getElementById('email-link');
            const emailText = document.getElementById('email-text');
            if (emailLink && emailText) {
                emailLink.href = '#';
                emailText.textContent = 'Email unavailable';
            }
            return false;
        }
    }
    
    // Try multiple methods to ensure it runs
    function attemptDecode() {
        if (decodeEmail()) {
            return; // Success
        }
        
        // If elements not found yet, try again after a short delay
        setTimeout(() => {
            if (!decodeEmail()) {
                // Last resort: try one more time after longer delay
                setTimeout(decodeEmail, 100);
            }
        }, 50);
    }
    
    // Decode email when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptDecode);
    } else {
        // DOM already loaded, try immediately
        attemptDecode();
    }
    
    // Also try on window load as a fallback
    window.addEventListener('load', decodeEmail);
})();

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only process links that start with # and have a valid target (skip # alone, mailto:, etc.)
        if (!href || !href.startsWith('#') || href === '#') {
            return; // Let the link work normally
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const targetId = target.getAttribute('id');
            
            // Immediately highlight the clicked section
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('active');
                }
            });
            
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update after scroll animation completes (smooth scroll typically takes ~500ms)
            setTimeout(() => {
                updateActiveNav();
            }, 500);
        }
    });
});

// Highlight active navigation item on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const navbarOffset = 100; // Account for navbar height and some threshold
    const viewportTop = scrollPosition + navbarOffset;

    // Check if we're at or near the bottom of the page
    const isNearBottom = scrollPosition + windowHeight >= documentHeight - 100;
    
    if (isNearBottom && sections.length > 0) {
        // If near bottom, activate the last section
        const lastSection = sections[sections.length - 1];
        current = lastSection.getAttribute('id');
    } else {
        // Simple approach: find the section whose top is closest to but above the viewport top
        // This is the standard scrollspy behavior
        let bestSection = null;
        let bestDistance = Infinity;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            
            // Only consider sections that are at or above the viewport top
            if (sectionTop <= viewportTop) {
                const distance = viewportTop - sectionTop;
                // Prefer the section that is closest to the viewport top (most recently scrolled past)
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestSection = section;
                }
            }
        });

        if (bestSection) {
            current = bestSection.getAttribute('id');
        } else if (sections.length > 0) {
            // If no section is above viewport top, use the first section
            current = sections[0].getAttribute('id');
        }
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update on scroll
window.addEventListener('scroll', updateActiveNav);

// Update on page load and resize
updateActiveNav();
window.addEventListener('resize', updateActiveNav);

