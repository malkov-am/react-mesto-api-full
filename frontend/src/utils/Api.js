class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }
  // Обработчик ответа с сервера
  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(res.status);
  }
  // Запрос карточек с сервера
  _getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      credentials: 'include',
    }).then((res) => this._handleResponse(res));
  }
  // Запрос данных пользователя с сервера
  _getProfileData() {
    return fetch(`${this._baseUrl}/users/me`, {
      credentials: 'include',
    }).then((res) => this._handleResponse(res));
  }
  getInitialData() {
    return Promise.all([this._getInitialCards(), this._getProfileData()]);
  }
  // Отправка данных пользователя на сервер
  setProfileData({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, about: about }),
    }).then((res) => this._handleResponse(res));
  }
  // Добавление новой карточки на сервер
  addCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => this._handleResponse(res));
  }
  // Удаление карточки с сервера
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => this._handleResponse(res));
  }
  // Изменить статус лайка
  changeLikeCardStatus(cardId, isLiked) {
    return !isLiked ? this._addLike(cardId) : this._removeLike(cardId);
  }
  // Добавить лайк к карточке
  _addLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      credentials: 'include',
    }).then((res) => this._handleResponse(res));
  }
  // Удалить лайк с карточки
  _removeLike(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => this._handleResponse(res));
  }
  // Изменить аватар пользователя
  changeAvatar(avatarData) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarData),
    }).then((res) => this._handleResponse(res));
  }
}

const api = new Api({
  baseUrl: 'https://malkov.api.mesto.nomoredomains.sbs',
});

export default api;
