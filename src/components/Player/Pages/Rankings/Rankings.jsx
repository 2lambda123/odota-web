import React from 'react';
import { connect } from 'react-redux';
import {
  getPlayerRankings,
  setPlayerRankingsSort,
} from 'actions';
import {
  sortPlayerRankings,
  transformPlayerRankingsById,
} from 'selectors';
import { playerRankings } from 'reducers';
import { createTable, TableContainer } from 'components/Table';
import playerRankingsColumns from './playerRankingsColumns';

const PlayerRankingsTable = createTable(
  playerRankings.getPlayerRankingsById,
  (state, sortState, playerId) => (sortState ? sortPlayerRankings(playerId)(state) : transformPlayerRankingsById(playerId)(state)),
  setPlayerRankingsSort
);

const Rankings = ({ playerId }) => (
  <div>
    <TableContainer title="Rankings Played">
      <PlayerRankingsTable columns={playerRankingsColumns} id={playerId} />
    </TableContainer>
  </div>
);

const getData = props => {
  props.getPlayerRankings(props.playerId);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.playerId !== nextProps.playerId) {
      getData(this.props);
    }
  }

  render() {
    return <Rankings {...this.props} />;
  }
}

const mapDispatchToProps = (dispatch) => ({
  getPlayerRankings: (playerId, options) => dispatch(getPlayerRankings(playerId, options)),
});

export default connect(null, mapDispatchToProps)(RequestLayer);
