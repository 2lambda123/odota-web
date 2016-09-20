import React from 'react';
import { CardActions } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import ActionUpdate from 'material-ui/svg-icons/action/update';
import ReactTooltip from 'react-tooltip';

export default () => (
  <CardActions style={{ width: '30%', boxSizing: 'border-box', padding: '15px 30px', textAlign: 'right' }}>
    <div style={{ display: 'inline-block' }}>
      <div data-tip data-for="update">
        <RaisedButton
          disabled
          icon={<ActionUpdate />}
          style={{ minWidth: 50 }}
        />
      </div>
      <ReactTooltip id="update" place="left" type="light" effect="float">
        <div style={{ textAlign: 'left' }}>
          Refresh Match History:
          If this player has recently changed their match privacy setting,
          this will queue a scan to find the missing matches.
        </div>
      </ReactTooltip>
    </div>
    <RaisedButton
      disabled
      label="Ask a Coach"
      labelPosition="before"
      icon={<img src="/assets/dotacoach-32x24.png" alt="DotaCoach" />}
      style={{ marginLeft: 15 }}
    />
  </CardActions>
);
