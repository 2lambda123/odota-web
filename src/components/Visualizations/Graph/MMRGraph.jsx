import React from 'react';
import npmColor from 'color';
import { Graph } from 'components/Visualizations';

const getXAxis = columns =>
  columns.length > 0 &&
  ({
    label: 'Date',
    tick: {
      format: x => columns[x].x.toDateString(),
    },
  });

const MMRGraph = ({ columns }) => (
  <Graph
    type="spline"
    columns={columns}
    name="Solo MMR"
    colors={{
      'Solo MMR': npmColor().rgb(102, 187, 255).rgbString(),
      'Party MMR': npmColor().rgb(255, 76, 76).rgbString(),
    }}
    noX
    hidePoints
    xAxis={getXAxis(columns)}
    otherColumnNames={[{ name: 'Party MMR', property: 'competitiveRank' }]}
  />
);

MMRGraph.propTypes = {
  columns: React.PropTypes.array.isRequired,
};

export default MMRGraph;
