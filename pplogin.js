// Toggle between Login and Register
const container = document.getElementById('container');
const registerBtn = document.querySelector('.toggle-right .hidden');
const loginBtn = document.querySelector('.toggle-left .hidden');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Register form submission
document.querySelector('.sign-up form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Basic validation
    if (name === '') {
        nameInput.placeholder = 'Please fill in your name.';
        nameInput.value = ''; // Clear the current text
        nameInput.classList.add('error');
        return;
    } else {
        nameInput.classList.remove('error');
    }

    if (email === '') {
        emailInput.placeholder = 'Please fill in your email.';
        emailInput.value = ''; // Clear the current text
        emailInput.classList.add('error');
        return;
    } else {
        emailInput.classList.remove('error');
    }

    if (password === '') {
        passwordInput.placeholder = 'Please fill in your password.';
        passwordInput.value = ''; // Clear the current text
        passwordInput.classList.add('error');
        return;
    } else {
        passwordInput.classList.remove('error');
    }

    // API call to register user
    try {
        const response = await fetch('http://localhost:5000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        emailInput.placeholder = result.message;
        emailInput.value = ''; // Clear the current text
        emailInput.classList.add('success');
    } 
    catch (error) {
        emailInput.placeholder = 'ERROR: INVALID CREDENTIALS';
        emailInput.value = ''; // Clear the current text
        emailInput.classList.add('error');
        console.error('Registration error:', error);
    }
});

// Login form submission
document.querySelector('.sign-in form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    const email = emailInput.value;
    const password = passwordInput.value;

    // Basic validation
    if (email === '') {
        emailInput.placeholder = 'Please fill in your email.';
        emailInput.value = ''; // Clear the current text
        emailInput.classList.add('error');
        return;
    } else {
        emailInput.classList.remove('error');
    }

    if (password === '') {
        passwordInput.placeholder = 'Please fill in your password.';
        passwordInput.value = ''; // Clear the current text
        passwordInput.classList.add('error');
        return;
    } else {
        passwordInput.classList.remove('error');
    }

    // API call to login user
    try {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        emailInput.placeholder = result.message;
        emailInput.value = ''; // Clear the current text
        emailInput.classList.add('success');

        // Store the username in local storage
        localStorage.setItem('username', result.name);

        // Redirect to the search page after successful login
        window.location.href = 'ppsearch.html';

    } catch (error) {
        emailInput.placeholder = 'ERROR: INVALID CREDENTIALS';
        emailInput.value = ''; // Clear the current text
        emailInput.classList.add('error');
        console.error('Login error:', error);
    }
});

// Optional: Add CSS to highlight error fields
const style = document.createElement('style');
style.innerHTML = `
    .error {
        border: 1px solid red;
    }
    .success {
        border: 1px solid green;
    }
`;
document.head.appendChild(style);
