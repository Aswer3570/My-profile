<?php 
$user = 'root';
$password = 'PASSWORD';

$option = array(
    PDO::ATTR_ERRMODE  => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
);

try{ 
	$pdo = new PDO('mysql:host=mysql;dbname=my_profile;charset=utf8', $user, $password, $option); 
} 
catch(PDOException $e){
	die('Error — ' . $e->getMessage());
}
?>