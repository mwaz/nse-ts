import React from 'react';
import { Chart } from 'react-charts';

const MyChart = () => {
 
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      // {
      //   label: 'Series 2',
      //   data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      // }
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )

  return (
  // const lineChart = (
    // A react-chart hyper-responsively and continuously fills the available
    // space of its parent element automatically
    <div className="chart-body"
      style={{
        background: 'rgba(0, 27, 45, 0.9)',
        width: '450px',
        padding: '5px 20px',
        height: '200px',
      }}
    >
      <Chart data={data} axes={axes} tooltip dark />
    </div>
  )
  // )
}

export default MyChart
