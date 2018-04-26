import React, { Component } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import { array, object, number, string } from 'prop-types';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  github,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class GennyPieChart extends Component {
  static propTypes = {
    data: array,
    colors: array,
    containerHeight: number,
    containerWidth: number,
    root: string,
    only: array,
    except: array,
  };

  static defaultProps = {
    root: '',
    only: [],
    except: [],
  };

  getData = () => {
    const { root, only, except } = this.props;
    console.log(root, only, 'log the props dashboard');

    if (root) {
      const datas = BaseEntityQuery.getEntityChildren(root);
      console.log(datas, 'log datas');

      if (only && only.length > 0) {
        const filtered = only.map(data => {
          const data1 = datas.filter(dd => {
            return dd.code === data;
          });
          return data1;
        });

        console.log(filtered, 'filtered only');
        const req = filtered.map(ff => {
          return { name: 'asdad', value: 4 };
        });
        console.log(req, 'final data returned');
        return req;
      }

      return null;
    }
  };

  render() {
    const { data, colors, containerHeight, containerWidth, root } = this.props;
    return (
      <div className="genny-pie-chart">
        <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
          <Pie
            data={this.getData()}
            cx={300}
            cy={200}
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={containerHeight / 2}
            fill="#8884d8"
          >
            {this.getData().map((entry, index) => (
              <Cell fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </div>
    );
  }
}

export default GennyPieChart;
