'use strict';

document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function tabHideContent() {
		tabsContent.forEach(item => {
			item.style.display = 'none';
		});
		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].style.display = 'block';
		tabs[i].classList.add('tabheader__item_active');
	}



	tabHideContent();
	showTabContent();

	tabsParent.addEventListener('click', (e) => {
		const target = e.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					tabHideContent();
					showTabContent(i);
				}
			});
		}
	});

	//Modal
	//---Переменные для кода
	const openIcon = document.querySelectorAll('[data-modal]'),
		closeIcon = document.querySelector('[data-close]'),
		body = document.querySelector('body'),
		timerId = setTimeout(showModal, 5000),
		modal = document.querySelector('.modal');
	//========================================

	//---Функции
	function removeShow() {
		modal.classList.remove('show');
		body.classList.remove('stop-scroll');
	}

	function showModal() {
		modal.classList.add('show');
		body.classList.add('stop-scroll');
		clearInterval(timerId);
	}

	function showModalByScroll() {
		if (window.pageYOffset + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
			showModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}
	//=======================================

	//Код позволяющий открыть окно
	openIcon.forEach(item => {
		item.addEventListener('click', showModal);
	});

	window.addEventListener('scroll', showModalByScroll);
	//==============================

	//Код позволяющий закрыть окно
	document.addEventListener('keydown', e => {
		if (e.code === 'Escape' && modal.classList.contains('show')) {
			console.log('lala');
			removeShow();
		}
	});

	modal.addEventListener('click', e => {
		const modalTarget = e.target;
		if (modalTarget && modalTarget === modal) {
			removeShow();
		}
	});
	closeIcon.addEventListener('click', removeShow);
	//============================
	//Class
	//Переменные
	const flexBox = document.querySelector('.menu__field'),
		foodsCard = document.querySelectorAll('.menu__item'),
		textFood = prompt();
	//===============
	//Конструктор
	class CardConstructor {
		constructor(img, alt, title, text, cost) {
			this.img = img;
			this.alt = alt;
			this.title = title;
			this.text = text;
			this.cost = cost;
		}
		createNewElemet() {
			const foodCard = document.createElement('div');
			flexBox.querySelector('.container').append(foodCard);
			foodCard.classList.add('menu__item');
			foodCard.innerHTML = `<img src="${this.img}" alt="${this.alt}">
				<h3 class="menu__item-subtitle" >${this.title}</h3>
          <div class="menu__item-descr">${this.text}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.cost}</span> грн/день</div>
					</div>`;
			console.log(foodCard);
		}
	}
	//===============
	const firstCard = new CardConstructor('img/tabs/elite.jpg', 'HI', 'DINNER', textFood, 999);
	console.log(firstCard);
	firstCard.createNewElemet();
	flexBox.querySelector('.container').style.flexWrap = 'wrap';
	flexBox.querySelector('.container').querySelectorAll('.menu__item').forEach(item => {
		item.style.flex = '0 0 30%';
	});

	//FORMS
	const forms = document.querySelectorAll('form');//Добавляем всеформы в одну переменную
	const message = {//Хранилище в виде объекта для сообщений о статусе отправки
		loading: 'Загрузка',
		success: 'Спасибо! Скоро мы с вами свяжемся',
		failure: 'Что то пошло не так'
	};



	function postData(form) {//Создаем функцию которая будет отправлять данные на сервер
		form.addEventListener('submit', (e) => {//Функция будет срабатывать по нажатию кнопки отправить
			e.preventDefault();//Отменяем все эфекты по умолчанию в том числе и обновление страницы
			const statusMessage = document.createElement('div');//Создаем блок в который будет выводится сообзение о статусе отправки
			statusMessage.classList.add('status');//Дьавляем класс 
			statusMessage.textContent = message.loading;//Первым в вышесозданный блок добавляем сообщение которое говорит что идет загрузка
			form.append(statusMessage);//Добавляем этот блок в конец формы
			const request = new XMLHttpRequest();//Создаем объект XMLHttpRequest с помощю которого мы и будем отправлять форму
			request.open('POST', 'server.php');//Устанавливаем тип отправки и указываем адресс куда отправляем 
			request.setRequestHeader('Content-type', 'application/json');//Укащываем тип отправляемого формата данных
			const formData = new FormData(form);//Создаем объект FormData который собирает информацию введенную пользователем

			const object = {};//Объект в который будет перемещены данные из объекта FormData да бы перевести их в json формат
			formData.forEach((value, key) => {//Перенрсим данные с помощю forEach
				object[key] = value;
			});

			const json = JSON.stringify(object);//Конвертируем данные в JSON

			request.send(json);//и отправляем данные на сервер

			request.addEventListener('load', () => {//Что происзодит после отправки формы
				if (request.status === 200) {//Если данные удачно отправились
					console.log(request.response);//Выодит эти данные в консоль
					statusMessage.textContent = message.success;//Меняем статус сообзения на успешно
					form.reset();//Чистим форму
					setTimeout(() => { statusMessage.remove() }, 2000);//Через 2 сек убираем сообзение
				} else {
					statusMessage.textContent = message.failure;//Если отправка не произошла то выводим сообщение об ошибке
				}
			});
		});
	}

	forms.forEach(item => {
		postData(item);
	});
});