/* global window ace API_HOST */
import React from 'react';
import fetch from 'isomorphic-fetch';
import Spinner from 'components/Spinner';
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import queries from './queries';
// import {blue300} from 'material-ui/styles/colors';

/*
const ace = require('brace');
require('brace/mode/sql');
require('brace/theme/monokai');
*/

function jsonResponse(response) {
  return response.json();
}
/*
// TODO query builder
// hero_id,
// picks/bans,
// tower damage,
// hero damage,
// hero_healing,
// kills, deaths, assists,
// gpm, xpm, lh, dn,
// stat_t[minute], kills->>unit, purchase->>item, casts->>ability, uses->>item
// where (none, patch, league, hero, player)
// group by (none, hero, player, league, team, month), aggregation (none, count, avg, sum)
// order by (stat descending)
// limit (default 1000)
// basic player_match data: league.name as leaguename, h.localized_name, np.name, stat
// basic agg data: count(*), agg(stat)
*/
/*
`
SELECT ${}
FROM player_matches pm
LEFT JOIN notable_players np
ON pm.account_id = np.account_id
JOIN matches m
ON pm.match_id = m.match_id
JOIN heroes h
ON pm.hero_id = h.id
JOIN leagues le
ON m.leagueid = le.leagueid
WHERE ${}
GROUP BY ${}
ORDER BY ${}
LIMIT ${}
`
*/

// TODO autocompletion?
// TODO handle enter keypress
// TODO use table component
// TODO show error better
// TODO show curl example

class Explorer extends React.Component
{
  constructor() {
    super();
    this.state = {
      loading: false,
      result: {},
    };
    this.handleQuery = this.handleQuery.bind(this);
    this.handleExampleChange = this.handleExampleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
    this.handleRequestOpen = this.handleRequestOpen.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }
  componentDidMount() {
    const editor = ace.edit('editor');
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setMode('ace/mode/sql');
    editor.setShowPrintMargin(false);
    editor.setOptions({
      minLines: 10,
      maxLines: Infinity,
    });
    const sql = this.props && this.props.location && this.props.location.query && this.props.location.query.sql;
    if (sql) {
      editor.setValue(decodeURIComponent(sql));
    }
    this.editor = editor;
  }
  handleQuery() {
    this.setState(Object.assign({}, this.state, { loading: true }));
    const queryString = `?sql=${encodeURIComponent(this.editor.getSelectedText() || this.editor.getValue())}`;
    window.history.pushState('', '', queryString);
    fetch(`${API_HOST}/api/explorer${queryString}`).then(jsonResponse).then(this.handleResponse);
  }
  handleExampleChange(event, value) {
    this.editor.setValue(queries[value].sql);
    this.handleRequestClose();
  }
  handleResponse(json) {
    this.setState(Object.assign({}, this.state, {
      loading: false,
      open: false,
      result: json,
    }));
  }
  handleRequestOpen() {
    this.setState({
      open: true,
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  }
  render() {
    return (<div>
      <h3>Data Explorer
        <small> - Explore data from Dota 2 matches </small>
        <a href="https://github.com/odota/core/blob/master/sql/create_tables.sql">(Table Schema)</a>
      </h3>
      <div>
        <ul>
          <li>matches and player_matches tables only contain competitive matches in Professional and Premium tiers</li>
          <li>Queries run as read-only</li>
          <li>Queries time out after 30 seconds</li>
          <li>Select part of the input to send only that fragment</li>
        </ul>
        <div>
          <RaisedButton
            onClick={this.handleRequestOpen}
            label={'Examples'}
          />
          <Popover
            open={this.state.open}
            onRequestClose={this.handleRequestClose}
          >
            <Menu onChange={this.handleExampleChange}>
              {Object.keys(queries).filter(k => Boolean(queries[k].name)).map((k) => {
                const e = queries[k];
                return <MenuItem value={k} primaryText={e.name} />;
              })
              }
            </Menu>
          </Popover>
        </div>
        <div>
          <div id={'editor'} style={{ width: '100%', height: 200 }} />
          <RaisedButton
            style={{ margin: '5px' }}
            label={'Query'}
            onClick={this.handleQuery}
          />
        </div>
      </div>
      <Tabs>
        <Tab label={'Table'}>
          {!this.state.loading ?
            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                <TableRow>
                  {this.state.result.fields && !this.state.loading ?
                  this.state.result.fields.map(f => (<TableHeaderColumn>{f.name}</TableHeaderColumn>)) : []}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.state.result.rows && !this.state.loading ? this.state.result.rows.map(r => (<TableRow>
                  {Object.keys(r).map(k => <TableRowColumn>{r[k]}</TableRowColumn>)}
                </TableRow>)) : []}
              </TableBody>
            </Table> : <Spinner />
          }
        </Tab>
        <Tab label={'Raw'}>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
        </Tab>
      </Tabs>
    </div>);
  }
}

export default Explorer;
