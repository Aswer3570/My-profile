<?php 
include('data_base.php');

$name = $_POST['name'];
$surname = $_POST['surname'];
$patronymic = $_POST['patronymic'];
$about = $_POST['about'];
$login = $_POST['login'];
$password = $_POST['password'];

// Выполняем поиск логина по БД
$searchLogin = $pdo->prepare('SELECT login FROM `user` WHERE login LIKE ? LIMIT 1');
$searchLogin->execute([$login]);

if($searchLogin->rowCount() != 0){
    echo json_encode(array('result' => '1'));
}
else{
   	// Отзеркаливаем хеш пароля
    $password = strrev($password);

    // Создаём client_id
	$permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $client_id = str_shuffle($permitted_chars);
	$client_id = hash('sha256', $client_id);

	// Загрузка изображения на сервер
	// Папка в которую будет загружаться изображение
	$uploaddir = '../images/users/';
	// Имя которое будет присвоено изображению
	$apend = date('YmdHis') . rand(100,1000) . '.jpg'; 
	$uploadfile = "$uploaddir$apend"; 
	// Проверяем файл на тип и размер
	if(($_FILES['file']['type'] == 'image/gif' || $_FILES['file']['type'] == 'image/jpeg' || $_FILES['file']['type'] == 'image/png') && ($_FILES['file']['size'] != 0 and $_FILES['file']['size'] <= 512000)){ 
		// Перемещаем загруженное изображение в нужную нам директорию
  		if(move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)){ 
   			// Загружаем изображение
   			$size = getimagesize($uploadfile); 
   			// Получаем размер пикселей изображения 
     		if($size[0] < 900 && $size[1] < 1300){ 
				// Сохраняем текстовые данные в БД
				$sendDB = $pdo->prepare('INSERT INTO `user` (`name`, `surname`, `patronymic`, `about`, `login`, `password`, `client_id`) VALUES (:name, :surname, :patronymic, :about, :login, :password, :client_id)');
				$sendDB->execute(array('name' => $name, 'surname' => $surname, 'patronymic' => $patronymic, 'about' => $about, 'login' => $login, 'password' => $password, 'client_id' => $client_id));

				// Получаем id записанной записи
				$id_write = $pdo->lastInsertId();

				// Сохраняем файл в БД
				$sendDB = $pdo->prepare('INSERT INTO `images` (`url`, `foreign_key`) VALUES (:file, :foreign_key)');
				$sendDB->execute(array('file' => $uploadfile, 'foreign_key' => $id_write));

				// Отправляем coockie на фронт
				echo json_encode(array('result' => $client_id));
     		} 
     		else{
     			// Загружаемое изображение превышает допустимые нормы
     			echo json_encode(array('result' => '2'));
     			// удаление файла 
     			unlink($uploadfile); 
     		}	 
   		} 
   		else{
   			// Произошла неизвестная ошибка
   			echo json_encode(array('result' => '3'));
   		} 
	} 
	else{
		// Размер файла не должен превышать 512Кб
		echo json_encode(array('result' => '4'));
	}
}
?>