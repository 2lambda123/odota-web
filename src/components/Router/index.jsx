import React from 'react';
import { Provider } from 'react-redux';
import {
  Router,
  Route,
  browserHistory,
  IndexRoute,
} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from 'components/App';
import Match from 'components/Match';
import Player from 'components/Player';
import Home from 'components/Home';
import Search from 'components/Search';
import Explorer from 'components/Explorer';
import FourOhFour from 'components/FourOhFour';
import { Heroes } from 'components/Heroes';
import Request from 'components/Request';
import Distributions from 'components/Distributions';
import store from 'store';

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

export default () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="search" component={Search} />
        <Route path="matches/:match_id" component={Match}>
          <Route path=":info" />
        </Route>
        <Route path="players/:accountId" component={Player}>
          <Route path=":info">
            <Route path=":subInfo" />
          </Route>
        </Route>
        <Route path="explorer" component={Explorer} />
        <Route path="heroes(/:hero_id)" component={Heroes}>
          <Route path=":info" />
        </Route>
        <Route path="request" component={Request} />
        <Route path="distributions" component={Distributions} />
        <Route path="carry" />
        <Route path="status" />
        <Route path="*" component={FourOhFour} />
      </Route>
    </Router>
  </Provider>
);
