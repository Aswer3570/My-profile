// Получаем данные из cookie
cookie_data = Cookies.get('client_id');

// Если куков нет, то редиректим обратно на вход
if(!cookie_data){
	window.location.replace('../');
}
else{
	$.ajax({
		type: 'post',
		url: '../backend/user.php',
		data: { client_id: cookie_data },
		success: function(data){
			resultObj = JSON.parse(data);
			if(resultObj === 'error'){
				Cookies.remove('client_id');
				window.location.replace('../');
			}
			else{
				$('#img').append('<img src="' + resultObj.image[0].url + '" class="avatar">');
				$('#name').append(resultObj.user.name);
				$('#surname').append(resultObj.user.surname);
				$('#patronymic').append(resultObj.user.patronymic);
				$('#login').append(resultObj.user.login);
				$('#description').append(resultObj.user.about);
			}
		},
		error: function(){
            alert('Ошибка сервера');
        }
	});
}

// Выход из аккаунта
$('#out').click(function(){
	Cookies.remove('client_id');
	window.location.replace('../');
});