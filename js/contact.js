// Contact form handling

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };
            
            // Store in localStorage (in a real app, this would be sent to a server)
            let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
            contacts.push(formData);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            // Show success message
            showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
});
