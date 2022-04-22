<?php

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$name = $_POST['user-name'];
$phone = $_POST['user-phone'];

//$mail->SMTPDebug = 3;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.mail.ru';  																							// Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'mr.coctail@mail.ru'; // Ваш логин от почты с которой будут отправляться письма
$mail->Password = 'awzsexdr1234554321'; // Ваш пароль от почты с которой будут отправляться письма
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465; // TCP port to connect to / этот порт может отличаться у других провайдеров

$mail->setFrom('mr.coctail@mail.ru'); // от кого будет уходить письмо?
$mail->addAddress('hello@russiandino.ru');     // Кому будет уходить письмо
//$mail->addReplyTo('info@example.com', 'Information');
//$mail->addCC('cc@example.com');
//$mail->addBCC('bcc@example.com');
//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = 'Контакты пользователя с сайта РД';
$mail->Body    = '' .$name . ' оставил заявку, его телефон ' .$phone. '<br>Электронная почта: ';
$mail->AltBody = '';

if(!$mail->send()) {
    echo 'Error';
} else {
    exit('<meta http-equiv="refresh" content="0; url="index.html" />');
}
?>
