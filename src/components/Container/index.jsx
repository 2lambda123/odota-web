import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'react-content-loader';
import Heading from '../Heading';
import Error from '../Error';

export const AsyncContainer = ({ loading, error, children }) => {
  if (error) {
    return <Error />;
  }
  if (loading) {
    return <List />;
  }
  return children;
};

const {
  bool, node, string, shape,
} = PropTypes;

AsyncContainer.propTypes = {
  loading: bool,
  error: bool,
  children: node,
};

const Container = ({
  title, subtitle, style, className, children, error, loading, hide, titleTo,
}) => (!hide ? (
  <div className={className} style={{ ...style }}>
    {title && <Heading title={title} subtitle={subtitle} titleTo={titleTo} />}
    <AsyncContainer error={error} loading={loading}>
      {children}
    </AsyncContainer>
  </div>
) : null);

Container.propTypes = {
  title: string,
  subtitle: string,
  style: shape({}),
  className: string,
  loading: bool,
  error: bool,
  children: node,
  hide: bool,
  titleTo: string,
};

export default Container;
