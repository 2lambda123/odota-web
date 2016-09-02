import React from 'react';
import { connect } from 'react-redux';

import { REDUCER_KEY } from './../../reducers';
import HeroList from './HeroList';
import style from './Heroes.css';

const HeroesIndex = ({ heroes }) => (
  <div>
    <h1 className={style.Header}>Heroes</h1>
    <HeroList heroes={heroes} />
  </div>
);

const mapStateToProps = (state) => ({
  heroes: state[REDUCER_KEY].heroes,
});

export default connect(mapStateToProps)(HeroesIndex);
