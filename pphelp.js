document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact form');
    const submitBtn = document.querySelector('.contact form .btn-box');

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const phone = document.getElementById('number');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        const formData = {
            name: name.value.trim(),
            phone: phone.value.trim(),
            email: email.value.trim(),
            message: message.value.trim()
        };

        if (formData.name && formData.phone && formData.email && formData.message) {
            fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Update placeholders with success message
                name.placeholder = 'Message sent successfully';
                phone.placeholder = 'Message sent successfully';
                email.placeholder = 'Message sent successfully';
                message.placeholder = 'Message sent successfully';

                // Reset form after successful submission
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                // Update placeholders with error message
                name.placeholder = 'Error sending message';
                phone.placeholder = 'Error sending message';
                email.placeholder = 'Error sending message';
                message.placeholder = 'Error sending message';
            });
        } else {
            // Update placeholders to prompt user to fill out all fields
            name.placeholder = 'Please enter your name';
            phone.placeholder = 'Please enter your phone number';
            email.placeholder = 'Please enter your email';
            message.placeholder = 'Please enter your message';
        }
    });
});
