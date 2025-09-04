// js/login.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm') || document.getElementById('loginForm');
    const messageDiv = document.getElementById('loginMessage');
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
        const email = formData.get('email').trim();
        const password = formData.get('password');
        if (!email || !password) {
            showMessage('Please fill in all fields.', 'red');
            animateMessage('shake');
            return;
        }
        button.disabled = true;
        button.textContent = 'Logging In...';
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const result = await response.json();
            if (response.ok) {
                showMessage('Login successful!', 'green');
                animateMessage('tada');
                localStorage.setItem('student_token', result.token);
                // Show toast notification with user's email
                if (toast && toastMsg) {
                    toastMsg.textContent = `You have logged in (${email}), redirecting to profile...`;
                    toast.style.display = 'flex';
                    setTimeout(() => { toast.style.display = 'none'; }, 1200);
                }
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1200);
            } else {
                showMessage(result.error || 'Login failed.', 'red');
                animateMessage('shake');
            }
        } catch (err) {
            showMessage('Error connecting to server.', 'red');
            animateMessage('shake');
        }
        button.disabled = false;
        button.textContent = 'Login';
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
});
