export const BASE_URL = 'https://malkov.api.mesto.nomoredomains.sbs';

function handleResponse(res) {
  return res.ok ? res.json() : Promise.reject(res.status);
}

export const register = ({ email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  }).then((res) => handleResponse(res));
};

export const authorize = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  }).then((res) => handleResponse(res));
};

export const checkToken = () => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => handleResponse(res));
};

export const logout = () => {
  return fetch(`${BASE_URL}/signout`, {
    method: 'GET',
    credentials: 'include',
  }).then((res) => handleResponse(res));
};
