import React from 'react';
import { connect } from 'react-redux';
import { openMenu } from 'actions';
import { Link } from 'react-router';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
// import FlatButton from 'material-ui/FlatButton';
// import IconButton from 'material-ui/IconButton/IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
// import MenuItem from 'material-ui/MenuItem';
// import IconMenu from 'material-ui/IconMenu';
// import AppBar from 'material-ui/AppBar';
import strings from 'lang';
import AccountWidget from '../AccountWidget';
import styles from './Header.css';
import SearchForm from '../Search/SearchForm';
import AppLogo from '../App/AppLogo';

const navbarPages = [{
  name: strings.request,
  path: '/request',
}, {
  name: strings.distributions,
  path: '/distributions',
}, {
  name: strings.heroes,
  path: '/heroes',
}, {
  name: strings.ingame,
  sponsored: true,
  path: '/become-the-gamer',
}, {
  name: strings.blog,
  path: '//odota.github.io/blog',
  external: true,
}];

// openMenu
const Header = ({ location }) => (
  <div>
    <Toolbar className={styles.header}>
      <ToolbarGroup className={styles.verticalAlign}>
        <AppLogo style={{ marginRight: 10 }} />
      </ToolbarGroup>
      <ToolbarGroup className={styles.verticalAlign}>
        {navbarPages.map((page) => (
          <div key={page.name} className={styles.tabContainer}>
            {page.external ?
              <a href={page.path} className={styles.tab}>{page.name}</a> :
              <Link to={page.path} className={styles.tab}>{page.name}</Link>}
          </div>
        ))}
      </ToolbarGroup>
      <ToolbarGroup className={styles.verticalAlign} style={{ marginLeft: 20 }}>
        <ActionSearch style={{ marginRight: 8, opacity: '.6' }} />
        <SearchForm location={location} />
      </ToolbarGroup>
      <ToolbarGroup className={styles.verticalAlign} style={{ marginLeft: 'auto' }}>
        <AccountWidget />
      </ToolbarGroup>
    </Toolbar>
  </div>
);

const mapDispatchToProps = (dispatch) => ({
  openMenu: () => dispatch(openMenu()),
});

export default connect(null, mapDispatchToProps)(Header);
