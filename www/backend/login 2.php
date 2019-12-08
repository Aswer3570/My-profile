<?php 
include('data_base.php');

$login = $_POST['login'];
$password = $_POST['password'];

// Отзеркаливаем хеш пароля
$password = strrev($password);

// Делаем запрос в БД
$searchLogin = $pdo->prepare('SELECT login, password, client_id FROM `user` WHERE login = ? LIMIT 1');
$searchLogin->execute([$login]);
$row = $searchLogin->fetch();

// Получаем данные из БД
$loginDB = $row['login'];
$passwordDB = $row['password'];
$client_idDB = $row['client_id'];

// Проверяем данные пользователя с данными из БД
if($loginDB != $login || $passwordDB != $password){
	// Неверные логин или пароль
    echo json_encode(array('result' => '5'));
} 
else{
    echo json_encode(array('result' => $client_idDB));
}
?>