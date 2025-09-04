// profile-widget.js
// Show mini profile in navbar if logged in

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('student_token');
    const navbar = document.querySelector('.navbar');
    if (!token || !navbar) return;
    try {
        const response = await fetch('http://localhost:5000/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) return;
        const data = await response.json();
        // Create profile widget
        const profileWidget = document.createElement('div');
        profileWidget.className = 'profile-widget';
        profileWidget.innerHTML = `
            <img src="${data.picture_url}" alt="Profile" class="profile-widget-img">
            <span class="profile-widget-name">${data.name}</span>
            <a href="profile.html" class="profile-widget-link">View Profile</a>
        `;
        // Insert into navbar
        navbar.appendChild(profileWidget);
    } catch (err) {
        // Fail silently
    }
});
