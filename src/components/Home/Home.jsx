import React from 'react';
import { connect } from 'react-redux';

const Home = () => (
  <div>This is a home page!</div>
);

function mapStateToProps(data) {
  return { content: data.content };
}

export default connect(mapStateToProps)(Home);
