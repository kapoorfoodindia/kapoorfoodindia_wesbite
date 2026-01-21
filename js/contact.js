// Contact form handling

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const countryCodeSelect = document.getElementById('countryCode');
    const nameInput = document.getElementById('name');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');

    // Check if returning from successful submission
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('submitted') === 'true') {
        showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const validateEmail = (value) => {
        // Rule: must contain '@' and at least one '.' after '@'
        if (!value) return false;
        const at = value.indexOf('@');
        if (at <= 0) return false; // requires something before '@'
        const domain = value.slice(at + 1);
        if (!domain || !domain.includes('.')) return false; // allow single or multiple dots
        if (/\s/.test(value)) return false; // no spaces
        return true;
    };

    const validatePhone = (digits) => {
        // Only digits allowed; at least 7 digits to be reasonable
        return /^\d{7,}$/.test(digits);
    };

    const setError = (el, message) => {
        el.textContent = message || '';
    };

    const isFormValid = () => {
        const emailOk = validateEmail(emailInput.value);
        const phoneDigits = phoneInput.value || '';
        const phoneOk = !phoneDigits || validatePhone(phoneDigits);
        const nameOk = (nameInput.value || '').trim().length > 0;
        const subjectOk = (subjectInput.value || '').trim().length > 0;
        const messageOk = (messageInput.value || '').trim().length > 0;
        return emailOk && phoneOk && nameOk && subjectOk && messageOk;
    };

    const updateSubmitState = () => {
        if (submitBtn) submitBtn.disabled = !isFormValid();
    };

    if (phoneInput) {
        // Strip non-digits on input
        phoneInput.addEventListener('input', () => {
            const cleaned = phoneInput.value.replace(/[^\d]/g, '');
            if (cleaned !== phoneInput.value) phoneInput.value = cleaned;
            if (cleaned && validatePhone(cleaned)) {
                setError(phoneError, '');
            }
            updateSubmitState();
        });
        phoneInput.addEventListener('blur', () => {
            const ok = !phoneInput.value || validatePhone(phoneInput.value);
            setError(phoneError, ok ? '' : 'Invalid Phone Number');
            updateSubmitState();
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const ok = validateEmail(emailInput.value);
            setError(emailError, ok ? '' : 'Invalid Email');
            updateSubmitState();
        });
        emailInput.addEventListener('input', updateSubmitState);
    }

    if (nameInput) nameInput.addEventListener('input', updateSubmitState);
    if (subjectInput) subjectInput.addEventListener('change', updateSubmitState);
    if (messageInput) messageInput.addEventListener('input', updateSubmitState);

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Validate before submit
            const emailOk = validateEmail(emailInput.value);
            const phoneDigits = phoneInput.value || '';
            const phoneOk = !phoneDigits || validatePhone(phoneDigits);
            const nameOk = (nameInput.value || '').trim().length > 0;
            const subjectOk = (subjectInput.value || '').trim().length > 0;
            const messageOk = (messageInput.value || '').trim().length > 0;
            setError(emailError, emailOk ? '' : 'Invalid Email');
            setError(phoneError, phoneOk ? '' : 'Invalid Phone Number');
            updateSubmitState();
            if (!(emailOk && phoneOk && nameOk && subjectOk && messageOk)) {
                e.preventDefault();
                return;
            }

            // Add full phone number to a hidden field before submission
            if (phoneDigits) {
                let fullPhoneInput = contactForm.querySelector('input[name="phoneFull"]');
                if (!fullPhoneInput) {
                    fullPhoneInput = document.createElement('input');
                    fullPhoneInput.type = 'hidden';
                    fullPhoneInput.name = 'phoneFull';
                    contactForm.appendChild(fullPhoneInput);
                }
                fullPhoneInput.value = `${countryCodeSelect.value}${phoneDigits}`;
            }

            // Show sending state (form will submit normally to Formsubmit.co)
            if (submitBtn) { 
                submitBtn.disabled = true; 
                submitBtn.textContent = 'Sending...'; 
            }
            // Let the form submit naturally - Formsubmit.co handles the rest
        });
    }
    // Initialize submit button state on load
    updateSubmitState();
});
