const contentEl = document.getElementById('content');
const navLinksEl = document.getElementById('nav-links');

// Initial state
let writeupsData = null;

// Configure Marked.js
marked.setOptions({
    highlight: function(code, lang) {
        if (Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
    },
    headerIds: true,
    gfm: true,
    breaks: true
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typewriter(text, elementId) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        el.innerHTML += text[i];
        await sleep(50 + Math.random() * 50);
    }
}

async function init() {
    try {
        // Setup initial loading state with cursor
        contentEl.innerHTML = `<div class="loading"><span id="typewriter"></span><span class="cursor"></span></div>`;
        
        // Type out the initializing message
        await typewriter('SYSTEM_INITIALIZING...', 'typewriter');
        
        // Artificial delay for effect
        await sleep(1500);

        const response = await fetch('writeups.json');
        writeupsData = await response.json();
        
        renderNavbar();
        handleRoute();
        setupMobileMenu();
        
        window.addEventListener('hashchange', handleRoute);
    } catch (err) {
        console.error('Failed to initialize app:', err);
        contentEl.innerHTML = `<div class="error">ERROR: SYSTEM_DATABASE_NOT_FOUND</div>`;
    }
}

function setupMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        navLinksEl.classList.toggle('active');
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!navLinksEl.contains(e.target) && !toggle.contains(e.target)) {
            navLinksEl.classList.remove('active');
        }
    });
}

function renderNavbar() {
    let html = `<a href="#/" class="nav-link">HOME</a>`;
    Object.keys(writeupsData.categories).forEach(cat => {
        html += `<a href="#/${cat}" class="nav-link">${cat}</a>`;
    });
    navLinksEl.innerHTML = html;
}

function handleRoute() {
    const hash = window.location.hash || '#/';
    
    // Close mobile menu on navigation
    navLinksEl.classList.remove('active');
    
    if (hash === '#/') {
        renderHome();
    } else {
// ... existing code ...
        const parts = hash.split('/').filter(p => p && p !== '#');
        if (parts.length === 1) {
            renderCategory(parts[0]);
        } else if (parts.length === 2) {
            renderWriteup(parts[0], parts[1]);
        }
    }
    
    // Update active nav link
    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
        const currentHash = l.getAttribute('href');
        if (hash === currentHash || (hash.startsWith(currentHash) && currentHash !== '#/')) {
            l.className = 'nav-link active';
        } else {
            l.className = 'nav-link';
        }
    });
    
    window.scrollTo(0, 0);
}

function renderHome() {
    let recentHtml = '';
    const allWriteups = [];
    
    Object.keys(writeupsData.categories).forEach(cat => {
        writeupsData.categories[cat].forEach(w => {
            allWriteups.push({ ...w, category: cat });
        });
    });
    
    // Sort by date descending
    allWriteups.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const recent = allWriteups.slice(0, 6);
    
    contentEl.innerHTML = `
        <div class="hero">
            <h1 class="terminal-text">ALEX_SECURITY</h1>
            <p>High-end cybersecurity research and CTF writeups.</p>
        </div>
        
        <h2 class="section-title">RECENT_LOGS</h2>
        <div class="cards-grid">
            ${recent.map(w => `
                <a href="#/${w.category}/${w.slug}" class="card">
                    <span class="card-category">${w.category}</span>
                    <h3>${w.title}</h3>
                    <span class="card-date">${w.date}</span>
                </a>
            `).join('')}
        </div>
    `;
}

function renderCategory(category) {
    const writeups = writeupsData.categories[category];
    if (!writeups) return (contentEl.innerHTML = 'CATEGORY_NOT_FOUND');
    
    contentEl.innerHTML = `
        <h2 class="section-title">${category.toUpperCase()}</h2>
        <div class="cards-grid">
            ${writeups.map(w => `
                <a href="#/${category}/${w.slug}" class="card">
                    <h3>${w.title}</h3>
                    <span class="card-date">${w.date}</span>
                </a>
            `).join('')}
        </div>
    `;
}

async function renderWriteup(category, slug) {
    contentEl.innerHTML = `<div class="loading">FETCHING_FILE_${category.toUpperCase()}_${slug.toUpperCase()}...</div>`;
    
    try {
        const filePath = `writeups/${category}/${slug}.md`;
        const response = await fetch(filePath);
        if (!response.ok) throw new Error('File not found');
        
        let text = await response.ok ? await response.text() : 'WRITEUP_CONTENT_MISSING';
        
        // Basic Frontmatter Removal (if present)
        if (text.startsWith('---')) {
            const lines = text.split('\n');
            let endIdx = -1;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '---') {
                    endIdx = i;
                    break;
                }
            }
            if (endIdx !== -1) {
                text = lines.slice(endIdx + 1).join('\n');
            }
        }
        
        const writeupInfo = writeupsData.categories[category].find(w => w.slug === slug);
        
        contentEl.innerHTML = `
            <div id="writeup-content">
                <header class="writeup-header">
                    <span class="terminal-text" style="font-size: 0.8rem">${category.toUpperCase()}</span>
                    <h1>${writeupInfo ? writeupInfo.title : slug}</h1>
                    <p>PUB_DATE: ${writeupInfo ? writeupInfo.date : 'UNKNOWN'}</p>
                </header>
                <div class="prose">
                    ${marked.parse(text)}
                </div>
            </div>
        `;
        
        // Re-highlight code blocks
        Prism.highlightAll();
    } catch (err) {
        contentEl.innerHTML = `<div class="error">ERROR: FILE_LOAD_FAILED</div>`;
    }
}

// Start the app
init();
