import fetch from 'isomorphic-fetch';
import { HOST_URL } from '../actions';

const url = '/api/matches/';

const REQUEST = 'yasp/match/REQUEST';
const OK = 'yasp/match/OK';
const ERROR = 'yasp/match/ERROR';

export const matchActions = {
  REQUEST,
  OK,
  ERROR,
};

const getMatchRequest = () => ({ type: REQUEST });

const getMatchOk = (payload) => ({
  type: OK,
  payload,
});

const getMatchError = (payload) => ({
  type: ERROR,
  payload,
});

const matchApiCall = (matchId, host) => {
  fetch(`${host}${url}${matchId}`, { credentials: 'include' })
  .then(response => response.json())
  .catch(error => error);
};

export const getMatch = (matchId, host = HOST_URL) => (dispatch) => {
  dispatch(getMatchRequest());
  matchApiCall(matchId, host)
    .then(json => dispatch(getMatchOk(json)))
    .catch(error => dispatch(getMatchError(error)));
};
