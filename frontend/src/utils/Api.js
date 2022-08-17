class Api {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }
  // Обработчик ответа с сервера
  _handleResponse(res) {
    return res.ok ? res.json() : Promise.reject(res.status);
  }
  // Запрос карточек с сервера
  _getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }
  // Запрос данных пользователя с сервера
  _getProfileData(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }
  getInitialData(token) {
    return Promise.all([this._getInitialCards(token), this._getProfileData(token)]);
  }
  // Отправка данных пользователя на сервер
  setProfileData({ name, about }, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, about: about }),
    }).then((res) => this._handleResponse(res));
  }
  // Добавление новой карточки на сервер
  addCard({ name, link }, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then((res) => this._handleResponse(res));
  }
  // Удаление карточки с сервера
  deleteCard(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }
  // Изменить статус лайка
  changeLikeCardStatus(cardId, isLiked, token) {
    return !isLiked ? this._addLike(cardId, token) : this._removeLike(cardId, token);
  }
  // Добавить лайк к карточке
  _addLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }
  // Удалить лайк с карточки
  _removeLike(cardId, token) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }).then((res) => this._handleResponse(res));
  }
  // Изменить аватар пользователя
  changeAvatar(avatarData, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(avatarData),
    }).then((res) => this._handleResponse(res));
  }
}

const api = new Api({
  baseUrl: 'http://malkov.api.mesto.nomoredomains.sbs',
});

export default api;
