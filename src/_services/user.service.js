import 'whatwg-fetch';

import { setHeader } from '../_helpers';
import { SERVER_URL } from '../_constants';

export const userService = {
    addUser,
    updateUser,
    getAllUsers,
    getUserById,
    setAvatar
};

function addUser(user) {
  return fetch(`${SERVER_URL}/user/create`, setHeader('POST', user)).then((response) => {
    const token = response.headers.get('x-auth');
    if(token) {
      localStorage.setItem('userToken', token);
    }
    return response.json();
  }).then((userInfo) => {
      if(userInfo) {
       localStorage.setItem('userInfo', JSON.stringify(userInfo));
     }
     return userInfo;
  });
}

function updateUser(userId, user) {
  return fetch(`${SERVER_URL}/user/${userId}`, setHeader('PUT', user, true)).then((response) => response.json());
}

function getAllUsers() {
  return fetch(`${SERVER_URL}/user/list/all`, setHeader('GET', null, true)).then((response) => response.json());
}

function getUserById(userId) {
  return fetch(`${SERVER_URL}/user/${userId}`, setHeader('GET', null, true)).then((response) => response.json());
}

function setAvatar(data) {
  return fetch(`${SERVER_URL}/user/avatar`, setHeader('POST', data, true, true)).then((response) => response.json());
}