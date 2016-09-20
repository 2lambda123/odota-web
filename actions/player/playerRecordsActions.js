import fetch from 'isomorphic-fetch';
import { API_HOST } from '../';
import { playerRecords } from '../../reducers';
import { getUrl } from '../utility';

// const excludedOptions = ['limit'];
const url = playerId => `/api/players/${playerId}/records`;

const REQUEST = 'yasp/playerRecords/REQUEST';
const OK = 'yasp/playerRecords/OK';
const ERROR = 'yasp/playerRecords/ERROR';
const SORT = 'yasp/playerRecords/SORT';

export const playerRecordsActions = {
  REQUEST,
  OK,
  ERROR,
  SORT,
};

export const setPlayerRecordsSort = (sortField, sortState, sortFn, id) => ({
  type: SORT,
  sortField,
  sortState,
  sortFn,
  id,
});

export const getPlayerRecordsRequest = (id) => ({ type: REQUEST, id });

export const getPlayerRecordsOk = (payload, id) => ({
  type: OK,
  payload,
  id,
});

export const getPlayerRecordsError = (payload, id) => ({
  type: ERROR,
  payload,
  id,
});

export const getPlayerRecords = (playerId, options = {}, host = API_HOST) => (dispatch, getState) => {
  if (playerRecords.isLoaded(getState(), playerId)) {
    dispatch(getPlayerRecordsOk(playerRecords.getRecordsList(getState(), playerId), playerId));
  } else {
    dispatch(getPlayerRecordsRequest(playerId));
  }
  // const modifiedOptions = getModifiedOptions(options, excludedOptions);

  return fetch(`${host}${getUrl(playerId, options, url)}`, { credentials: 'include' })
    .then(response => response.json())
    .then(json => Object.keys(json).map(key => ({
      name: key,
      value: json[key][key],
      hero_id: json[key].hero_id,
      start_time: json[key].start_time,
      match_id: json[key].match_id,
    })))
    .then(json => dispatch(getPlayerRecordsOk(json, playerId)))
    .catch(error => dispatch(getPlayerRecordsError(error, playerId)));
};
