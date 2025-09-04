document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality (consistent with other pages)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Merit list data (you would replace this with actual image paths)
    const meritLists = [
        { 
            year: "2024", 
            title: "2024 Merit List", 
            img: "assets/images/2024.jpg",
        },
        { 
            year: "2025", 
            title: "2025 Merit List", 
            img: "assets/images/2025.jpg",
        },
    ];
    
    // Function to render merit lists
    function renderMeritLists(filterYear = 'all') {
        const container = document.querySelector('.merit-container');
        container.innerHTML = '';
        
        const filteredLists = filterYear === 'all' 
            ? meritLists 
            : meritLists.filter(list => list.year === filterYear);
            
        if (filteredLists.length === 0) {
            container.innerHTML = '<p class="no-results">No merit lists found for the selected year.</p>';
            return;
        }
        
        filteredLists.forEach(list => {
            const card = document.createElement('div');
            card.className = 'merit-card animate__animated animate__fadeIn';
            card.innerHTML = `
                <img src="${list.img}" alt="${list.title}" class="merit-img" loading="lazy">
                <div class="merit-info">
                    <h3>${list.title}</h3>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    // Year filter functionality
    const yearButtons = document.querySelectorAll('.year-btn');
    yearButtons.forEach(button => {
        button.addEventListener('click', function() {
            yearButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const year = this.getAttribute('data-year');
            renderMeritLists(year);
        });
    });
    
    // Syllabus tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Initial render
    renderMeritLists();
});