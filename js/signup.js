// js/signup.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const messageDiv = document.getElementById('signupMessage');
    const toast = document.getElementById('toast-notification');
    const toastMsg = document.getElementById('toast-message');
    if (toast) {
        toast.querySelector('.toast-close').onclick = function() {
            toast.style.display = 'none';
        };
    }
    if (!form) return;
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const password = formData.get('password');
        const picture = formData.get('picture');
        // Simple validation
        if (!name || !email || !password || !picture || picture.size === 0) {
            showMessage('Please fill in all fields and select a picture.', 'red');
            animateMessage('shake');
            return;
        }
        if (!validateEmail(email)) {
            showMessage('Please enter a valid email address.', 'red');
            animateMessage('shake');
            return;
        }
        button.disabled = true;
        button.textContent = 'Signing Up...';
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                showMessage(result.message, 'green');
                animateMessage('tada');
                form.reset();
                // Show toast notification with user's name
                if (toast && toastMsg) {
                    toastMsg.textContent = `You have successfully signed up (${name}), redirecting to profile...`;
                    toast.style.display = 'flex';
                    setTimeout(() => { toast.style.display = 'none'; }, 2000);
                }
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
            } else {
                showMessage(result.error || 'Signup failed.', 'red');
                animateMessage('shake');
            }
        } catch (err) {
            showMessage('Error connecting to server.', 'red');
            animateMessage('shake');
        }
        button.disabled = false;
        button.textContent = 'Sign Up';
    });

    function showMessage(msg, color) {
        messageDiv.textContent = msg;
        messageDiv.style.color = color;
    }
    function animateMessage(animation) {
        messageDiv.classList.remove('animate__animated', 'animate__tada', 'animate__shakeX');
        void messageDiv.offsetWidth;
        messageDiv.classList.add('animate__animated', animation === 'tada' ? 'animate__tada' : 'animate__shakeX');
        setTimeout(() => {
            messageDiv.classList.remove('animate__animated', 'animate__tada', 'animate__shakeX');
        }, 1000);
    }
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
