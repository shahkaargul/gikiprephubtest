document.addEventListener('DOMContentLoaded', function() {
    // Animation for avatar
    const avatar = document.querySelector('.creator-avatar');
    if (avatar) {
        setTimeout(() => {
            avatar.style.transform = 'scale(1.1)';
            setTimeout(() => {
                avatar.style.transform = 'scale(1)';
            }, 300);
        }, 500);
    }
    
    // Social links interaction
    const socialLinks = document.querySelectorAll('.social-icon');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
