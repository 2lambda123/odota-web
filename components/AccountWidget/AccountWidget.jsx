import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Spinner from '../Spinner';
import Error from '../Error';
import { REDUCER_KEY } from '../../reducers';
import { getPlayer } from '../../actions';
import styles from './AccountWidget.css';
import { API_HOST } from '../../config';
// import FontIcon from 'material-ui/FontIcon';
// import { PlayerPicture } from '../Player';

// Maybe we can factor out this ternary into a function?
/*
        <PlayerPicture noSteamLink link={`/players/${user.account_id}/overview`} playerId={user.account_id} />
        <FontIcon style={{ fontSize: 40 }} className="material-icons">
          exit_to_app
        </FontIcon>
*/
const AccountWidget = ({ loading, error, user, style }) => (
  <div style={style} className={styles.tabContainer}>
    {loading && !error && <Spinner />}
    {error && <Error />}
    {!error && !loading && user ? (
      <div>
        <Link className={styles.tab} to={`/players/${user.account_id}/overview`}>{"Profile"}</Link>
        <a className={styles.tab} href={`${API_HOST}/logout`}>{"Logout"}</a>
      </div>
    )
    : <a className={styles.tab} href={`${API_HOST}/login`}>Login</a>
    }
  </div>
);

export { AccountWidget };

const mapStateToProps = (state) => {
  const { error, loading, user } = state[REDUCER_KEY].gotMetadata;

  return {
    loading,
    error,
    user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getPlayer: (playerId) => dispatch(getPlayer(playerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountWidget);
