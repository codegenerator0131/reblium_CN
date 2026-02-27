export function validateEmail(email: string): { isValid: boolean; error: string } {
    if (!email) {
        return { isValid: false, error: 'Email is required.' };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Basic format check
    if (!trimmedEmail.includes('@')) {
        return { isValid: false, error: 'Email must contain @ symbol.' };
    }

    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!re.test(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address.' };
    }

    return { isValid: true, error: '' };
}

export function validatePassword(password: string): { isValid: boolean; error: string } {
    if (!password || password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long.' };
    }

    const checks = [
        { regex: /[a-z]/, error: 'Password must contain at least one lowercase letter.' },
        { regex: /[A-Z]/, error: 'Password must contain at least one uppercase letter.' },
        { regex: /[0-9]/, error: 'Password must contain at least one number.' },
        { regex: /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/, error: 'Password contains invalid characters.' }
    ];

    for (const check of checks) {
        if (!check.regex.test(password)) {
            return { isValid: false, error: check.error };
        }
    }

    return { isValid: true, error: '' };
}