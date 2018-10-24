import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import heroes from 'dotaconstants/build/heroes.json';
import Heading from '../Heading';
import Spinner from '../Spinner';
import strings from '../../lang';
import { getLive } from '../../actions';
import { TableHeroImage } from '../Visualizations';
import { formatSeconds } from '../../utility';

class Live extends React.Component {
  componentDidMount() {
    this.props.dispatchLive();
  }
  render() {
    const { data, loading } = this.props;
    data.sort((a, b) => b.sort_score - a.sort_score);
    if (loading) {
      return <Spinner />;
    }
    return (
      <div>
        <Heading title={strings.header_live} />
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {data.map(game => (
            <div style={{ width: '25%' }}>
              <a href={`steam://rungameid/570//watch_server ${game.server_steam_id}`}>Watch Game</a>
              <div>{game.spectators} watching</div>
              <div>{formatSeconds(game.game_time)}</div>
              {game.average_mmr ? <div>{game.average_mmr} Average MMR</div> : null}
              <div>{game.radiant_score} - {game.dire_score}</div>
              <div>{game.radiant_lead} Radiant lead</div>
              <div>
                {game.players.filter((player, i) => i < 5).map(player => (
                  <div>
                    <TableHeroImage
                      image={heroes[player.hero_id] && process.env.REACT_APP_API_HOST + heroes[player.hero_id].img}
                      title={player.name}
                      accountId={player.account_id}
                      heroName={heroes[player.hero_id] ? heroes[player.hero_id].localized_name : strings.general_no_hero}
                    />
                  </div>))}
              </div>
              <div>
                {game.players.filter((player, i) => i >= 5).map(player => (
                  <div>
                    <TableHeroImage
                      image={heroes[player.hero_id] && process.env.REACT_APP_API_HOST + heroes[player.hero_id].img}
                      title={player.name}
                      accountId={player.account_id}
                      heroName={heroes[player.hero_id] ? heroes[player.hero_id].localized_name : strings.general_no_hero}
                    />
                  </div>))}
              </div>
            </div>))}
        </div>
      </div>);
  }
}

Live.propTypes = {
  dispatchLive: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool,
};

const mapStateToProps = state => ({
  data: state.app.live.data,
  loading: state.app.live.loading,
});

const mapDispatchToProps = dispatch => ({
  dispatchLive: info => dispatch(getLive(info)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Live);
