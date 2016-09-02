import React from 'react';
import { connect } from 'react-redux';
// import { Card } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { createTable } from '../Table';
import { getMatch, setMatchSort } from '../../actions';
import {
  overviewColumns,
  abUpgradeColumns,
  benchmarksColumns,
} from './matchColumns.jsx';
import { sortMatch, transformMatch } from '../../selectors';
import BuildingMap from '../BuildingMap/BuildingMap';
import { REDUCER_KEY } from '../../reducers';

const match = (state) => state[REDUCER_KEY].gotMatch.match;
const MatchTable = createTable(
  match,
  (state, sortState) => (sortState ? sortMatch(state) : transformMatch(state)),
  setMatchSort
);

const mapStateToProps = (state, { params }) => ({
  matchId: params.match_id,
  match: state[REDUCER_KEY].gotMatch.match,
  loading: state[REDUCER_KEY].gotMatch.loading,
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
    return (
      <div>
        <div>
          <div>{`Match ${this.props.match.match_id}`}</div>
          <div>{this.props.match.radiant_win ? 'Radiant Victory' : 'Dire Victory'}</div>
          <RaisedButton href={`/request#${this.props.match.match_id}`} label={'Parse Replay'} />
          <RaisedButton href={this.props.match.replay_url} label={'Download Replay'} />
          <RaisedButton label={'Jist.tv'} />
          <RaisedButton label={'DotaCoach'} />
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Region</th>
                <th>Duration</th>
                <th>Ended</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.props.match.game_mode}</td>
                <td>{this.props.match.region}</td>
                <td>{this.props.match.duration}</td>
                <td>{this.props.match.start_time + this.props.match.duration}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <MatchTable columns={overviewColumns} />
        <MatchTable columns={abUpgradeColumns} />
        <BuildingMap match={this.props.match} loading={this.props.loading} />
        <MatchTable columns={benchmarksColumns(this.props.match)} />
      </div>
    );
  }
  // TODO party indicator
  // Overall (stacks/stuns/dead/biggest hit)
  // Laning (lane, eff/lh/dn, lane map)
  // skills (casts/hits/damage)
  // items (casts/hits/damage)
  // purchase counts
  // purchase times
  // Hero kill times
  // Ward maps
  // Unit kills
  // Last Hits
  // Graphs
  // Stuns/Dead/biggest hit
  // Teamfights
  // Chat
  // Analysis
  // Combat
  // Gold/XP sources
  // Streaks
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
