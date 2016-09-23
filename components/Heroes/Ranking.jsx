import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import { ranking } from './../../reducers';
import { getRanking } from './../../actions';

import style from './Heroes.css';
import RankingTable from './RankingTable';

class Ranking extends Component {

  componentDidMount() {
    if (this.props.routeParams && this.props.routeParams.hero_id) {
      this.props.getRanking(this.props.routeParams.hero_id);
    }
  }

  renderLoading() {
    return (
      <div className={style.Loading}>
        <CircularProgress color="#fff" />
      </div>
    );
  }

  renderRanking(hero, rankings) {
    return (
      <div>
        <RankingTable rankings={rankings} />
      </div>
    );
  }

  render() {
    const { isLoading, isError, rankings, hero } = this.props;

    return (
      <div>
        {isLoading || isError || rankings === null ?
          this.renderLoading() : this.renderRanking(hero, rankings)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  rankings: ranking.getRankings(state),
  isLoading: ranking.getLoading(state),
  isError: ranking.getError(state),
});

const mapDispatchToProps = (dispatch) => ({
  getRanking: (heroId) => dispatch(getRanking(heroId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Ranking);
