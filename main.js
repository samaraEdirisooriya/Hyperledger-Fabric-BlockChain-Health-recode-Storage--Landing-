// Main JavaScript functionality for Hyperledger Fabric Medical Blockchain Landing Page

// Global variables
let particles = [];
let canvas;
let tutorialData = {
    patients: [],
    records: []
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeTutorialInterface();
    initializeP5Background();
});

// Initialize typewriter effect and other animations
function initializeAnimations() {
    // Typewriter effect for hero section
    const typed = new Typed('#typed-text', {
        strings: [
            'Hyperledger Fabric',
            'Medical Blockchain',
            'Secure Data Storage',
            'Healthcare Innovation'
        ],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // Animate network nodes
    anime({
        targets: '.network-node',
        scale: [0.8, 1.2, 0.8],
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
        delay: anime.stagger(500)
    });

    // Animate cards on hover
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                scale: 1,
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
    });
}

// Initialize scroll reveal effects
function initializeScrollEffects() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

// Initialize tutorial interface functionality
function initializeTutorialInterface() {
    const tutorialButtons = document.querySelectorAll('.tutorial-btn');
    const responseDisplay = document.getElementById('tutorial-response');
    const responseContent = document.getElementById('response-content');

    tutorialButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            handleTutorialAction(action, responseDisplay, responseContent);
        });
    });
}

// Handle tutorial actions with mock API responses
function handleTutorialAction(action, responseDisplay, responseContent) {
    let response = {};
    let loadingMessage = '';

    switch(action) {
        case 'register':
            loadingMessage = 'Registering patient on blockchain...';
            response = {
                "blockNumber": Math.floor(Math.random() * 100) + 1,
                "transactionID": generateTransactionId(),
                "status": "VALID",
                "patientId": "P" + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
                "timestamp": new Date().toISOString(),
                "creator": "doctor1"
            };
            break;

        case 'add-record':
            loadingMessage = 'Adding medical record to blockchain...';
            response = {
                "blockNumber": Math.floor(Math.random() * 100) + 1,
                "transactionID": generateTransactionId(),
                "status": "VALID",
                "recordType": "Weight",
                "value": Math.floor(Math.random() * 50) + 50 + " kg",
                "timestamp": new Date().toISOString(),
                "creator": "doctor1"
            };
            break;

        case 'query':
            loadingMessage = 'Querying patient records from blockchain...';
            response = {
                "patientId": "P003",
                "records": [
                    {
                        "createdAt": "2025-10-16T03:10:00Z",
                        "creator": "doctor1",
                        "title": "Weight",
                        "value": "78 kg"
                    },
                    {
                        "createdAt": "2025-10-16T02:45:00Z",
                        "creator": "doctor1", 
                        "title": "Blood Pressure",
                        "value": "120/80 mmHg"
                    }
                ],
                "queryTime": new Date().toISOString()
            };
            break;
    }

    // Show loading state
    responseContent.textContent = loadingMessage;
    responseDisplay.classList.remove('hidden');
    
    // Simulate API delay and show response
    setTimeout(() => {
        responseContent.textContent = JSON.stringify(response, null, 2);
        
        // Animate the response display
        anime({
            targets: responseDisplay,
            scale: [0.95, 1],
            opacity: [0.7, 1],
            duration: 500,
            easing: 'easeOutCubic'
        });
    }, 1500);
}

// Generate realistic transaction ID
function generateTransactionId() {
    const chars = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Initialize P5.js background animation
function initializeP5Background() {
    new p5((p) => {
        let nodes = [];
        let connections = [];
        
        p.setup = function() {
            const container = document.getElementById('p5-container');
            canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
            canvas.parent('p5-container');
            
            // Create network nodes
            for (let i = 0; i < 50; i++) {
                nodes.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6)
                });
            }
        };
        
        p.draw = function() {
            p.clear();
            
            // Update and draw nodes
            for (let node of nodes) {
                // Move nodes
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x < 0 || node.x > p.width) node.vx *= -1;
                if (node.y < 0 || node.y > p.height) node.vy *= -1;
                
                // Draw node
                p.fill(255, 255, 255, 100);
                p.noStroke();
                p.ellipse(node.x, node.y, node.size);
                
                // Draw connections to nearby nodes
                for (let other of nodes) {
                    let distance = p.dist(node.x, node.y, other.x, other.y);
                    if (distance < 100) {
                        let alpha = p.map(distance, 0, 100, 50, 0);
                        p.stroke(255, 255, 255, alpha);
                        p.strokeWeight(0.5);
                        p.line(node.x, node.y, other.x, other.y);
                    }
                }
            }
        };
        
        p.windowResized = function() {
            const container = document.getElementById('p5-container');
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        };
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navigation bar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('bg-white/98');
        nav.classList.remove('bg-white/95');
    } else {
        nav.classList.add('bg-white/95');
        nav.classList.remove('bg-white/98');
    }
});

// Button click handlers for hero section
document.addEventListener('click', (e) => {
    if (e.target.textContent === 'Explore Tutorial') {
        window.location.href = 'tutorial.html';
    } else if (e.target.textContent === 'View Research') {
        window.location.href = 'research.html';
    }
});

// Add loading animation for page transitions
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'fixed inset-0 bg-white/90 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.remove();
    }, 1000);
}

// Add loading to navigation links
document.querySelectorAll('nav a[href$=".html"]').forEach(link => {
    link.addEventListener('click', showLoading);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
    // Handle scroll-based animations here
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling for missing resources
window.addEventListener('error', (e) => {
    console.warn('Resource loading error:', e.message);
    // Graceful degradation - continue without the failed resource
});

// Initialize tooltips and help text
function initializeHelpSystem() {
    const helpElements = document.querySelectorAll('[data-help]');
    
    helpElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const helpText = e.target.dataset.help;
            showTooltip(e.target, helpText);
        });
        
        element.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
}

function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-50';
    tooltip.textContent = text;
    tooltip.id = 'tooltip';
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize help system when DOM is ready
document.addEventListener('DOMContentLoaded', initializeHelpSystem);