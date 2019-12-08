<?php 
include('data_base.php');

// Получаем данные с фронта
$data = $_POST['client_id'];

// Ищем в таблице нужного пользователя и формируем JSON
$searchUser = $pdo->prepare('SELECT * FROM `user` LEFT JOIN `images` ON user.id = images.foreign_key WHERE user.client_id = ? LIMIT 1');
$searchUser->execute([$data]);

if($row = $searchUser->fetch()){
	$json['user'] = [
		'name' => $row['name'],
		'surname' => $row['surname'],
		'patronymic' => $row['patronymic'],
		'login' => $row['login'],
		'about' => $row['about']
	];
	$json_img[] = [
		'url' => $row['url']
	];
	$json['image'] = $json_img;
	echo json_encode($json, JSON_UNESCAPED_UNICODE);
}
else{
	echo json_encode('error', JSON_UNESCAPED_UNICODE);
}
?>