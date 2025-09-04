// profile.js
// Fetch and display user profile after login

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('student_token');
    const profileContainer = document.querySelector('.profile-container');
    const profileCard = document.querySelector('.profile-card');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Show loading spinner
    const loading = document.createElement('div');
    loading.textContent = 'Loading profile...';
    loading.style.padding = '2rem';
    loading.style.fontSize = '1.2rem';
    loading.style.color = '#3498db';
    profileContainer.insertBefore(loading, profileCard);
    profileCard.style.display = 'none';
    try {
        const response = await fetch('http://localhost:5000/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            loading.textContent = 'Session expired. Please log in again.';
            setTimeout(() => { window.location.href = 'login.html'; }, 1500);
            return;
        }
        const data = await response.json();
        document.getElementById('profile-name').textContent = data.name;
        document.getElementById('profile-email').textContent = data.email;
        const profilePic = document.getElementById('profile-pic');
        profilePic.src = data.picture_url;
        profilePic.onerror = function() {
            profilePic.src = 'assets/images/default-profile.png';
        };
        // Animate profile card in
        profileCard.classList.add('animate__animated', 'animate__fadeInDown');
        profileCard.style.display = 'flex';
        loading.remove();
    } catch (err) {
        loading.textContent = 'Error loading profile. Please try again.';
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
    }
});

document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('student_token');
    window.location.href = 'login.html';
});
