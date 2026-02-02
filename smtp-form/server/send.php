<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Validate input
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$name  = trim($_POST['name'] ?? '');

if (!$email || !$name) {
    http_response_code(400);
    exit('Invalid input');
}

$mail = new PHPMailer(true);

try {
    // SMTP configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'dhanushpthampi@gmail.com'; // your Gmail
    $mail->Password = 'qwhqyrlnovdumhpi';         // your 16-char app password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Sender & recipient
    $mail->setFrom('dhanushpthampi@gmail.com', 'Red Gravity');
    $mail->addAddress($email, $name);                 // recipient
    $mail->addReplyTo('dhanushpthampi@gmail.com', 'Red Gravity Support');

    // Email content
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);  // enable HTML

    $mail->Subject = 'Grow Your Business Online';
    $mail->Body = "
        <html>
        <body>
            <h3>Hi $name,</h3>
            <p>If you want to grow your business and actually get clients from online, 
            contact us at <a href='https://redgravity.in'>Red Gravity</a> — we can help you out.</p>
            <p>Best regards,<br><strong>Red Gravity</strong></p>
        </body>
        </html>
    ";
    $mail->AltBody = "Hi $name,\n\nIf you want to grow your business and get clients from online, visit Red Gravity at https://redgravity.in/.\n\nBest regards,\nRed Gravity";

    $mail->send();
    echo 'Email sent successfully';

} catch (Exception $e) {
    error_log($mail->ErrorInfo); // logs for debugging
    http_response_code(500);
    echo 'Failed to send email';
}
