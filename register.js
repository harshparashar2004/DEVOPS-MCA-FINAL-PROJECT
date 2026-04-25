// Select the form and individual fields.
const registerForm = document.getElementById('register-form');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitBtn = document.getElementById('submitBtn');
const statusText = document.getElementById('statusText');

const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

// Simple email validation helper.
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Show an error message for the field.
function showError(element, message) {
    element.textContent = message;
}

// Clear all form error messages.
function clearErrors() {
    fullNameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    statusText.textContent = '';
}

// Show success message after registration.
function showSuccess(message) {
    statusText.textContent = message;
    statusText.style.color = 'var(--success)';
}

// Show failure feedback.
function showFailure(message) {
    statusText.textContent = message;
    statusText.style.color = 'var(--danger)';
}

// Toggle button loading state during submission.
function setLoading(isLoading) {
    submitBtn.classList.toggle('loading', isLoading);
    submitBtn.textContent = isLoading ? 'Creating account...' : 'Create Account';
}

// Validate the registration form values.
function validateForm() {
    clearErrors();

    let isValid = true;

    if (fullNameInput.value.trim().length < 3) {
        showError(fullNameError, 'Full name must be at least 3 characters.');
        isValid = false;
    }

    if (!isValidEmail(emailInput.value.trim())) {
        showError(emailError, 'Please enter a valid email address.');
        isValid = false;
    }

    if (passwordInput.value.length < 8) {
        showError(passwordError, 'Password must be at least 8 characters.');
        isValid = false;
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordError, 'Passwords do not match.');
        isValid = false;
    }

    return isValid;
}

// Form submit event handler.
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!validateForm()) {
        showFailure('Please correct the highlighted fields.');
        return;
    }

    setLoading(true);
    clearErrors();

    const formData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
    };

    try {
        // Placeholder POST request to /register endpoint.
        await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        // For now the UI is ready for backend integration.
        showSuccess('Registration successful — welcome to HARSH DEVOPS SOLUTIONS!');
        // Redirect to the main website after successful registration
        setTimeout(() => {
            window.location.href = 'portfolio.html';
        }, 1500); // Small delay to show success message
    } catch (error) {
        // This fallback preserves the demo flow when backend is not yet implemented.
        showSuccess('Account created successfully. Backend integration will be completed later.');
        // Also redirect in fallback case
        setTimeout(() => {
            window.location.href = 'portfolio.html';
        }, 1500);
    } finally {
        setLoading(false);
    }
});
