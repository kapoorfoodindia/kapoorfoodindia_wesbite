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
        contactForm.addEventListener('submit', async function(e) {
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

            // Use Formspree to send email
            e.preventDefault();
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
            try {
                const formData = new FormData(contactForm);
                const fullPhone = phoneDigits ? `${countryCodeSelect.value}${phoneDigits}` : '';
                formData.append('phoneFull', fullPhone);
                formData.append('page', window.location.href);

                const resp = await fetch(contactForm.action || 'https://formspree.io/f/mwpgdlaz', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });
                if (resp.ok) {
                    showNotification('Thank you! Your message has been sent.', 'success');
                    contactForm.reset();
                    setError(emailError, '');
                    setError(phoneError, '');
                } else {
                    showNotification('Unable to send message right now. Please try again later.', 'error');
                }
            } catch (err) {
                console.error(err);
                showNotification('Network error. Please try again.', 'error');
            } finally {
                if (submitBtn) { submitBtn.disabled = !isFormValid(); submitBtn.textContent = 'Send Message'; }
            }
        });
    }
    // Initialize submit button state on load
    updateSubmitState();
});
