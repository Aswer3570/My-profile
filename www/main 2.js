// Проверяем, если куки существуют, то редиректом пользователя обратно в его аккаунт
if(Cookies.get('client_id')){
	window.location.replace('http://localhost:8887/account/index.html');
}

// Функция переводящая страницу на другой язык
function langDom(lang){
	// Регистрация форма 1
	$("#form_title_reg").html(lang[0].form_title_reg);
	$("#name").attr('placeholder', lang[0].form_input[0].input_name);
	$("#surname").attr('placeholder', lang[0].form_input[0].input_surname);
	$("#patronymic").attr('placeholder', lang[0].form_input[0].input_patronymic);
	$("#about").attr('placeholder', lang[0].form_input[0].textarea_about);
	$("#input_submit_reg_next").val(lang[0].form_input[0].input_submit_reg_next);
	$("#login_link").html(lang[0].link[0].login_link);
	// Регистрация форма 2
	$("#form_title_reg2").html(lang[0].form_title_reg2);
	$("#login").attr('placeholder', lang[0].form_input[0].input_login);
	$("#password").attr('placeholder', lang[0].form_input[0].input_password);
	$("#repeatPassword").attr('placeholder', lang[0].form_input[0].input_repeatPassword);
	$("#upload_your_photo").html(lang[0].form_input[0].file[0].upload_your_photo);
	$("#photo_uploaded").html(lang[0].form_input[0].file[0].photo_uploaded);
	$("#input_submit_reg").val(lang[0].form_input[0].input_submit_reg);
	$("#uploaded_title").html(lang[0].form_input[0].uploaded_title);
	// Вход
	$("#form_title_log").html(lang[0].form_title_log);
	$("#login_login").attr('placeholder', lang[0].form_input[0].input_login);
	$("#password_login").attr('placeholder', lang[0].form_input[0].input_password);
	$("#input_submit_log").val(lang[0].form_input[0].input_submit_log);
	$("#back_link").html(lang[0].link[0].back_link);
	// Ошибки
	$("#errorServer_reg_title").html(lang[0].error[0].errorServer_reg_title);
	$("#errorServer_login_title").html(lang[0].error[0].errorServer_login_title);
	$("#errorPasswordsNotMatch").html(lang[0].error[0].errorPasswordsNotMatch);
	$("#errorHaveNotUploadedPhoto").html(lang[0].error[0].errorHaveNotUploadedPhoto);
	$("#errorLoginRegistered").html(lang[0].error[0].errorLoginRegistered);
	$("#errorPermissibleLimits").html(lang[0].error[0].errorPermissibleLimits);
	$("#errorUnknown").html(lang[0].error[0].errorUnknown);
	$("#error512KB").html(lang[0].error[0].error512KB);
	$("#errorPasswordLogin").html(lang[0].error[0].errorPasswordLogin);
}

// Получаем данные из JSON
$.getJSON('languages/lang.json', function(data){
	lang = Cookies.get('lang');
	if(lang){
		langDom(data[lang]);
		$("#selectLang").val(lang);
	} else {
		// Определяем язык у клиента
		language = window.navigator ? (window.navigator.language || window.navigator.systemLanguage || window.navigator.userLanguage) : "ru";
		language = language.substr(0, 2).toLowerCase();
		langDom(data[language]);
		$("#selectLang").val(language);
	}
	// Определяем какой язык выбрал пользователь
	$("#selectLang").change(function(){
		if(this.value === 'ru'){
			langDom(data[this.value]);
    		Cookies.set('lang', this.value, { expires: 30 });
		} else if(this.value === 'en'){
   			langDom(data[this.value]);
   			Cookies.set('lang', this.value, { expires: 30 });
		}
	});
});

// Функция разрешающая только английские символы
$("#login").keypress(function(event){
    return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122) || (event.charCode >= 48 && event.charCode <= 57)
});

// Функция показывающая форму входа в аккаунт
function login(){
	$('#regStage1').hide();
	$("#signInAccount").show();
}

// Функция скрывающая форму входа в аккаунт
function hideLogin(){
	$('#signInAccount').hide();
	$("#regStage1").show();
}

// Функция подсчёта количества введённых символов в "about"
function characters(){
	aboutLength = $("#about").prop('value').length;
	$("#limit_calculation").html(aboutLength + '/550');
	$("#about").prop('maxLength', 550);
}

// Автоматический ресайз textarea
$(function(){
	$('textarea').autoResize({
		extraSpace: 0
	});
});

// Функция фильтрации вводимых символов
function escapeRegExp(string){
    var htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return string.replace(/[&<>"']/g, function(match){
        return htmlEscapes[match];
    });
};

// Экранирование и валидация формы
function validation(data){
	if(data.prop('value') === ''){
		$('#' + data.prop('id')).addClass("error_message_input");
		return errorValidation = true;
	} else {
		return escapeRegExp(data[0].value);
	}
}

// Стилизуем загрузку изображения
$('#file').change(function(){
	file = this.value;
    if(file){
    	$('#not_add').hide();
		$("#add").show();
		$('#errorHaveNotUploadedPhoto').hide();
    }
});

// Функция отключения ошибок
function removeErrors(data){
	if(data.value != ''){
		$('#' + data.id).removeClass("error_message_input");
		$('#errorPasswordsNotMatch').hide();
		$("#errorLoginRegistered").hide();
		$("#errorPasswordLogin").hide();
	}
}

// Первая стадия регистрации
$('#form_regStage1').submit(function(event){
	event.preventDefault();

	// Валидация и экранирование формы
	name = validation($("#name"));
	surname = validation($("#surname"));
	patronymic = validation($("#patronymic"));
	about = validation($("#about"));

	if(name != true && surname != true && patronymic != true && about != true){
		$('#regStage1').hide();
		$("#regStage2").show();
	}
});

// Вторая стадия регистрации
$('#form_regStage2').submit(function(event){
	event.preventDefault();

	// Валидация и экранирование формы
	login = validation($("#login"));
	password = validation($("#password"));
	repeatPassword = validation($("#repeatPassword"));

	// Хешируем пароль
	passwordSHA256 = sha256(password);

	if(login != true && password != true && repeatPassword != true){
		if(password != repeatPassword){
			$('#password').addClass("error_message_input");
			$('#repeatPassword').addClass("error_message_input");
			$("#errorPasswordsNotMatch").show();
		} else {
			if(file.value === ''){
				$("#errorHaveNotUploadedPhoto").show();
			} else {
				// Получаем данные
				form_data = new FormData();
    			form_data.append('file', $('#file').prop('files')[0]);
    			form_data.append('name', name);
    			form_data.append('surname', surname);
    			form_data.append('patronymic', patronymic);
    			form_data.append('about', about);
    			form_data.append('login', login);
    			form_data.append('password', passwordSHA256);

    			// Отправляем полученные данные на сервер
    			$.ajax({
					type: 'post',
					url: 'backend/registration.php',
					contentType: false,
      				processData: false,
					data: form_data,
					success: function(data){

						console.log(data);

						resultObj = JSON.parse(data);
						if(resultObj.result === '1'){
							$('#login').addClass("error_message_input");
							$("#errorLoginRegistered").show();
						} else if(resultObj.result === '2'){
							$("#errorPermissibleLimits").show();
						} else if(resultObj.result === '3'){
							$("#errorUnknown").show();
						} else if(resultObj.result === '4'){
							$("#error512KB").show();
						} else {
							// Создаём сессию на 30 суток
							Cookies.set('client_id', resultObj.result, { expires: 30 });
							window.location.replace('http://localhost:8887/account/index.html');
						}
					},
					error: function(){
						$("#errorServer_reg").show();
        			}
				});
			}
		}
	}
});

// Вход
$('#form_login').submit(function(event){
	event.preventDefault();

	login = validation($("#login_login"));
	password = validation($("#password_login"));
	// Хешируем пароль
	passwordSHA256 = sha256(password);

	if(login != true && password != true){
		$.ajax({
			type: 'post',
			url: 'backend/login.php',
			data: { login: login, password: passwordSHA256 },
			success: function(data){
				resultObj = JSON.parse(data);

				if(resultObj.result === '5'){
					$('#login_login').addClass("error_message_input");
					$('#password_login').addClass("error_message_input");
					$("#errorPasswordLogin").show();
				} else {
					// Создаём сессию на 30 суток
					Cookies.set('client_id', resultObj.result, { expires: 30 });
					window.location = "http://localhost:8887/account/index.html";
				}
			},
			error: function(){
				$("#errorServer_login").show();
        	}
		});
	}
});