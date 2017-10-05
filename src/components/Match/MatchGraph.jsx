import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import c3 from 'c3';
import {
  formatSeconds,
  getLevelFromXp,
} from 'utility';
import styled from 'styled-components';
import playerColors from 'dotaconstants/build/player_colors.json';
import strings from 'lang';
import Heading from 'components/Heading';

const colorArray = Object.keys(playerColors).map(k => playerColors[k]);

const StyledMatchGraph = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;`;

const drawGraphs = (props, id) => {
  if (props.match && props.match.graphData) {
    const data = props.match.graphData[props.type];
    const color = props.type === 'difference' ? null : {
      pattern: colorArray,
    };
    const type = props.type === 'difference' ? 'area-spline' : 'spline';
    const valueFormat = props.type === 'xp' ? xp => `${xp} - ${strings.th_level} ${getLevelFromXp(xp)}` : undefined;
    c3.generate({
      bindto: `#${id}`,
      data: {
        x: 'time',
        columns: data,
        type,
      },
      color,
      axis: {
        x: {
          tick: {
            format(x) {
              return formatSeconds(x);
            },
          },
          label: 'Time',
        },
        y: {
          label: props.type,
        },
      },
      zoom: {
        enabled: true,
        rescale: true,
      },
      tooltip: {
        contents(d, defaultTitleFormat, defaultValueFormat, _color) {
          return this.getTooltipContent(d, defaultTitleFormat, valueFormat || defaultValueFormat, _color);
        },
        order: (a, b) => {
          if (props.type === 'difference') return a.id - b.id;
          return b.value - a.value;
        },
      },
    });
  }
};

class MatchGraph extends Component {
  componentWillMount() {
    this.id = `a-${uuid.v4()}`;
  }
  componentDidMount() {
    drawGraphs(this.props, this.id);
  }
  componentWillUpdate(nextProps) {
    drawGraphs(nextProps, this.id);
  }

  render() {
    return (<div>
      <Heading title={strings[`heading_graph_${this.props.type}`]} />
      <StyledMatchGraph id={this.id} />
    </div>);
  }
}

MatchGraph.propTypes = {
  type: PropTypes.string,
};

export default MatchGraph;
