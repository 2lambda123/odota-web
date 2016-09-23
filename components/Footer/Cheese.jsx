import React from 'react';
import { Link } from 'react-router';
import { Row, Col } from 'react-flexbox-grid';
import moment from 'moment';
import EditorAttachMoney from 'material-ui/svg-icons/editor/attach-money';
import CheeseCircle from '../Cheese';
import styles from './Footer.css';

export default () => (
  <Row middle="xs">
    <Col>
      <CheeseCircle />
    </Col>
    <Col xs>
      <big>Monthly Cheese Goal </big><small>Resets {moment().endOf('month').fromNow()}</small>
      <p>
        Reaching the goal every month keeps us running.
      </p>
      <p className={styles.links}>
        <Link to="/carry">
          <span>
            Help us out
          </span>
          <EditorAttachMoney style={{ verticalAlign: 'text-bottom', marginRight: -5 }} />
        </Link>
      </p>
    </Col>
  </Row>
);
