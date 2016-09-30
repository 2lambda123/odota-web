import {
  heroes,
  lane_ids as laneIds,
  patch,
  game_mode as gameMode,
  lobby_type as lobbyType,
  region,
} from 'dotaconstants';

export const heroConfig = {
  text: 'localized_name',
  value: 'id',
};
export const genericConfig = {
  text: 'text',
  value: 'id',
};

// This has to be a list in order to pass it in.
// We should consider refactoring all these kinds of objects into lists. I understand
// they are probably built like this to allow map key access but it would be nice if I didn't
// have to convert them all into arrays.
export const heroList = Object.keys(heroes).map(id => ({
  ...heroes[id],
}));
export const laneList = Object.keys(laneIds).map(id => ({
  text: laneIds[id],
  id: Number(id),
}));
export const patchList = patch.map((patch, index) => ({
  text: patch.name,
  id: index,
}));
export const modeList = Object.keys(gameMode).map(id => ({
  text: gameMode[id].name,
  id,
}));
export const lobbyTypeList = Object.keys(lobbyType).map(id => ({
  text: lobbyType[id].name,
  id,
}));
export const regionList = Object.keys(region).map(id => ({
  text: region[id],
  id: Number(id),
}));

export const factionList = [{
  text: 'dire',
  id: 0,
}, {
  text: 'radiant',
  id: 1,
}];
export const resultList = [{
  text: 'loss',
  id: 0,
}, {
  text: 'win',
  id: 1,
}];
export const dateList = [{
  text: 'last week',
  id: 7,
}, {
  text: 'last month',
  id: 30,
}, {
  text: 'last 3 months',
  id: 90,
}, {
  text: 'last 6 months',
  id: 180,
}];
