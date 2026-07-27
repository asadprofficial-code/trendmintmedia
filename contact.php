<?php
// ============================================================
//  TrendMint Media — contact.php
//  Handles the contact form submission from index.html (#contact-form).
//  Previously the form only faked a success message client-side and
//  never sent the message anywhere — this is the missing backend.
// ============================================================

header('Content-Type: application/json');

$TO_EMAIL = 'hello@trendmintmedia.com';

function respond($success, $error = '') {
    echo json_encode(['success' => $success, 'error' => $error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    respond(false, 'Method not allowed');
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    respond(false, 'Name, email, and message are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    respond(false, 'Please provide a valid email address.');
}

// Strip anything that could be used for header injection.
$stripHeaderChars = function ($v) {
    return str_replace(["\r", "\n", "%0a", "%0d"], '', $v);
};
$name  = $stripHeaderChars($name);
$email = $stripHeaderChars($email);
$phone = $stripHeaderChars($phone);

$subject = 'New contact form message — TrendMint Media';
$body = "Name: $name\nEmail: $email\nPhone: " . ($phone !== '' ? $phone : 'n/a') . "\n\nMessage:\n$message\n";

$headers = "From: TrendMint Media <no-reply@trendmintmedia.com>\r\n";
$headers .= "Reply-To: $name <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($TO_EMAIL, $subject, $body, $headers);

if (!$sent) {
    http_response_code(500);
    respond(false, 'Could not send your message right now. Please try again later or email us directly.');
}

respond(true);
