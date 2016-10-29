import React from 'react';
import {
  connect,
} from 'react-redux';
import {
  getPlayerItems,
} from 'actions';
import {
  playerItems,
} from 'reducers';
import Table from 'components/Table';
import Container from 'components/Container';
import {
  TableFilterForm,
} from 'components/Form';
import playerItemsColumns from './playerItemsColumns';

const Items = ({
  data,
  error,
  loading,
}) => (
  <div>
    <TableFilterForm />
    <Container title="Items" error={error} loading={loading}>
      <Table paginated columns={playerItemsColumns} data={data} />
    </Container>
  </div>
);

const getData = (props) => {
  props.getPlayerItems(props.playerId, props.location.query);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.playerId !== nextProps.playerId || this.props.location.key !== nextProps.location.key) {
      getData(this.props);
    }
  }

  render() {
    return <Items {...this.props} />;
  }
}

const mapStateToProps = (state, { playerId }) => ({
  data: playerItems.getItemsList(state, playerId),
  loading: playerItems.getLoading(state, playerId),
  error: playerItems.getError(state, playerId),
});

const mapDispatchToProps = dispatch => ({
  getPlayerItems: (playerId, options) => dispatch(getPlayerItems(playerId, options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
