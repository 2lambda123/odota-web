import { createSelector } from 'reselect';
import { REDUCER_KEY } from '../reducers';
import transformPlayerMatches from './transformPlayerMatches';
// TODO - want to just reverse the order of the matches if we are swapping that sort. Otherwise we start from scratch

const getSortState = (state) => state[REDUCER_KEY].gotPlayer.matches.sortState;
const getSortField = (state) => state[REDUCER_KEY].gotPlayer.matches.sortField;
const getSortFn = (state) => state[REDUCER_KEY].gotPlayer.matches.sortFn;

const sortPlayerMatches = createSelector(
  [transformPlayerMatches, getSortState, getSortField, getSortFn],
  (matches, sortState, sortField, sortFn) => (sortState === 'desc' ? matches.reverse() : sortFn(matches, sortField))
);


export default sortPlayerMatches;
