import React from 'react';
import constants from 'dotaconstants';
import { connect } from 'react-redux';
// import { Card } from 'material-ui/Card';
import { Tabs, Tab } from 'material-ui/Tabs';
import { Table as MaterialTable, TableRow, TableRowColumn, TableBody } from 'material-ui/Table';
import { getMatch, setMatchSort } from 'actions';
import { REDUCER_KEY } from 'reducers';
import { API_HOST } from 'config';
import { createTable } from '../Table';
import Table from '../Table/Table';
import MatchHeader from './MatchHeader';
import {
  heroTd,
  overviewColumns,
  abUpgradeColumns,
  benchmarksColumns,
  overallColumns,
  laningColumns,
  chatColumns,
  purchaseColumns,
  abilityUseColumns,
  itemUseColumns,
  purchaseTimesColumns,
  lastHitsTimesColumns,
  unitKillsColumns,
  actionsColumns,
  runesColumns,
} from './matchColumns.jsx';
import BuildingMap from '../BuildingMap/BuildingMap';
import { defaultSort } from '../../utility';
// import { TabBar } from '../TabBar';

const match = (state) => state[REDUCER_KEY].match;
const getMatchPlayers = (state) => state[REDUCER_KEY].match.match.players;
const getSortState = (state) => state[REDUCER_KEY].match.sortState;
const getSortField = (state) => state[REDUCER_KEY].match.sortField;
const getSortFn = (state) => state[REDUCER_KEY].match.sortFn;
const sortMatchPlayers = (state) => defaultSort(getMatchPlayers(state), getSortState(state), getSortField(state), getSortFn(state));
const MatchPlayersTable = createTable(
  match,
  (state, sortState) => (sortState ? sortMatchPlayers(state) : getMatchPlayers(state)),
  setMatchSort
);
const CastTable = ({ match, dataField, columns }) => (
  <Tabs>
    {match.players.map((p) =>
      (
      <Tab key={p.player_slot} icon={<img src={`${API_HOST}${constants.heroes[p.hero_id].img}`} height={30} role="presentation" />}>
        <Table
          data={p[dataField] || []}
          columns={columns}
        />
      </Tab>
      ))
    }
  </Tabs>);

const CrossTable = ({ match, field1, field2 }) => (
  <MaterialTable selectable={false}>
    <TableBody displayRowCheckbox={false}>
      <TableRow>
        <TableRowColumn>Hero</TableRowColumn>
        {match.players.slice(0, match.players.length / 2).map(p => (
          <TableRowColumn key={p.hero_id}>
            {heroTd(p, 'hero_id', p.hero_id, true)}
          </TableRowColumn>)
        )}
      </TableRow>
      {match.players.slice(match.players.length / 2, match.players.length).map(p => (<TableRow key={p.hero_id}>
        <TableRowColumn>{heroTd(p, 'hero_id', p.hero_id, true)}</TableRowColumn>
        {match.players.slice(0, match.players.length / 2).map(p2 => {
          const hero2 = constants.heroes[p2.hero_id] || {};
          return <TableRowColumn key={p2.hero_id}>{`${p[field1][hero2.name] || 0}/${p[field2][hero2.name] || 0}`}</TableRowColumn>;
        })}
      </TableRow>))}
    </TableBody>
  </MaterialTable>);

const mapStateToProps = (state, { params }) => ({
  matchId: params.match_id,
  match: state[REDUCER_KEY].match.match,
  loading: state[REDUCER_KEY].match.loading,
  user: state[REDUCER_KEY].metadata.user,
});

const mapDispatchToProps = (dispatch) => ({
  getMatch: (matchId) => dispatch(getMatch(matchId)),
});

class RequestLayer extends React.Component {
  componentDidMount() {
    this.props.getMatch(this.props.routeParams.match_id);
  }

  componentWillUpdate(nextProps) {
    if (this.props.match_id !== nextProps.match_id) {
      this.props.getMatch(nextProps.match_id);
    }
  }

  render() {
    const match = this.props.match;
    return (
      <div>
        <MatchHeader match={match} user={this.props.user} />
        <Tabs>
          <Tab label="Overview">
            <MatchPlayersTable columns={overviewColumns} />
            <MatchPlayersTable columns={abUpgradeColumns} />
            <BuildingMap match={match} loading={this.props.loading} />
          </Tab>
          <Tab label="Benchmarks">
            <MatchPlayersTable columns={benchmarksColumns(match)} />
          </Tab>
          <Tab label="Crosstables">
            <CrossTable match={match} field1="killed" field2="killed_by" />
            <CrossTable match={match} field1="damage" field2="damage_taken" />
          </Tab>
          <Tab label="Overall">
            <MatchPlayersTable columns={overallColumns} />
          </Tab>
          <Tab label="Laning">
            <MatchPlayersTable columns={laningColumns} />
          </Tab>
          <Tab label="Farm">
            <MatchPlayersTable columns={unitKillsColumns} />
            <MatchPlayersTable columns={lastHitsTimesColumns(match)} />
          </Tab>
          <Tab label="Purchases">
            <MatchPlayersTable columns={purchaseColumns} />
            <MatchPlayersTable columns={purchaseTimesColumns(match)} />
          </Tab>
          <Tab label="Abilities">
            <CastTable match={match} dataField="ability_uses_arr" columns={abilityUseColumns} />
          </Tab>
          <Tab label="Items">
            <CastTable match={match} dataField="item_uses_arr" columns={itemUseColumns} />
          </Tab>
          <Tab label="Objectives">
            <MatchPlayersTable columns={runesColumns} />
          </Tab>
          <Tab label="Actions">
            <MatchPlayersTable columns={actionsColumns} />
          </Tab>
          <Tab label="Analysis" />
          <Tab label="Cosmetics" />
          <Tab label="Chat">
            <Table data={(match.chat || []).map(c => Object.assign({}, c, match.players[c.slot]))} columns={chatColumns} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
