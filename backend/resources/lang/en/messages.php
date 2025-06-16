<?php

return [
    // General messages
    'success' => 'Operation successful.',
    'error' => 'An error occurred.',
    'forbidden' => 'Access forbidden.',
    'not_found' => 'Resource not found.',
    'validation_error' => 'Validation error.',
    'unauthorized' => 'Unauthorized.',

    // Authentication messages
    'login_success' => 'Login successful.',
    'login_error' => 'Invalid credentials.',
    'logout_success' => 'Logout successful.',
    'register_success' => 'Registration successful. Please login.',
    'password_reset_sent' => 'A password reset email has been sent.',
    'password_reset_success' => 'Password reset successful.',
    'password_reset_error' => 'Invalid or expired token.',
    'refresh_token_invalid' => 'Invalid refresh token.',

    // CRUD messages
    'created' => ':resource created successfully.',
    'updated' => ':resource updated successfully.',
    'deleted' => ':resource deleted successfully.',
    'retrieved' => ':resource retrieved successfully.',

    // Resources
    'resources' => [
        'account' => 'Account',
        'client' => 'Client',
        'project' => 'Project',
        'quote' => 'Quote',
        'quote_line' => 'Quote line',
        'invoice' => 'Invoice',
        'invoice_line' => 'Invoice line',
    ],

    // Validation messages
    'validation' => [
        'email' => [
            'required' => 'Email address is required.',
            'email' => 'Please enter a valid email address.',
            'exists' => 'No account is associated with this email address.',
            'unique' => 'This email address is already in use.',
        ],
        'password' => [
            'required' => 'Password is required.',
            'min' => 'Password must be at least :min characters.',
            'confirmed' => 'Password confirmation does not match.',
        ],
    ],
];
