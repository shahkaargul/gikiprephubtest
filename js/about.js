document.addEventListener('DOMContentLoaded', function() {
    // Animate stats counters
    const statCards = document.querySelectorAll('.stat-card');
    
    const animateCounters = () => {
        statCards.forEach(card => {
            const targetNumber = parseInt(card.querySelector('.stat-number').textContent);
            const statNumber = card.querySelector('.stat-number');
            let current = 0;
            const increment = targetNumber / 30;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNumber) {
                    clearInterval(timer);
                    current = targetNumber;
                }
                statNumber.textContent = Math.floor(current) + (targetNumber > 100 ? '+' : '');
            }, 30);
        });
    };

    // Trigger animation when stats come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
