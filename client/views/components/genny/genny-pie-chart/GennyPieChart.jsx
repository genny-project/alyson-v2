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

  state = {
    pieData: [{ name: '', value: 0 }],
  };

  getData = () => {
    const { root, only, except } = this.props;
    console.log(root, only, 'log the props dashboard');
    if (root) {
      const datas = BaseEntityQuery.getEntityChildren(root);

      /* logic if baseentities are supllied on only as a prop */
      /* filter the data the we only want to display on the pie chart  */
      /* the data we only want comes from the only props */
      if (only && only.length > 0) {
        const filtered = only.map(data => {
          const data1 = datas.filter(dd => {
            return dd.code === data;
          });
          return data1;
        });

        /* merge the array since the output given by filtered is array inside an array */
        const finalData = [].concat.apply([], filtered);

        /* only map it to only include name and value fields */
        const response = finalData
          .map(ff => {
            return { name: ff.name, value: ff.children.length };
          })
          .filter(data => {
            return data.value > 0;
          });

        return response;
      }

      /* logic if baseentities are supllied on except as a prop */
      if (except && except.length > 0) {
        const filtered = only.map(data => {
          const data1 = datas.filter(dd => {
            return dd.code != data;
          });
          return data1;
        });

        /* merge the array since the output given by filtered is array inside an array */
        const finalData = [].concat.apply([], filtered);

        /* only map it to only include name and value fields */
        const response = finalData
          .map(ff => {
            return { name: ff.name, value: ff.children.length };
          })
          .filter(data => {
            return data.value > 0;
          });

        return response;
      }

      return null;
    }
  };

  render() {
    const { data, colors, containerHeight, containerWidth, root } = this.props;
    return (
      <div className="genny-pie-chart">
        {this.getData().length < 1 ? (
          <div
            style={{
              height: 200,
              width: 250,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              boxShadow: '0px 0px 5px 1px #ded9d9',
            }}
          >
            <p> No data to display </p>
          </div>
        ) : (
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
        )}
      </div>
    );
  }
}

export default GennyPieChart;
