// auth/service.js
const fetch = require('node-fetch');
const { GITHUB_AUTH_TOKEN_API_URL, GITHUB_AUTH_USER_API_URL } = require('./constants');


const requestGithubToken = (credentials) =>
  fetch(GITHUB_AUTH_TOKEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });

const requestGithubUserAccount = (token) =>
  fetch(`${GITHUB_AUTH_USER_API_URL}`, {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });

const authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return {
    ...githubUser,
    access_token,
  };
};

module.exports = {
  requestGithubToken,
  requestGithubUserAccount,
  authorizeWithGithub,
};
