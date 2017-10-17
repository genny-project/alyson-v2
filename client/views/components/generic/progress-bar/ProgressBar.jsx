import './progressBar.scss';
import React, { Component } from 'react';
import { string, array, number } from 'prop-types';
import { IconSmall } from '../';

class ProgressBar extends Component {
  
  static defaultProps = {
    className: '',
    progressCurrent: 0,
    progressTotal: 0,
    type: 0,
  }

  static propTypes = {
    className: string,
    progressCurrent: number,
    progressTotal: number,
    type: number
  }

  render() {
    const { className, progressCurrent, progressTotal, type } = this.props;
    const progressPercent = progressCurrent / progressTotal * 100;
    return (
      <div className={`progress-bar ${className} ${type === 1 ? 'one' : type === 2 ? 'two' : ''} `}>

        { type === 1 ? (
          <div className="node-container one">
            <div className="node start" />
            {
              Array.from({ length: progressTotal }, (v, k) => <div className={`node ${ k + 1 < progressCurrent ? "complete" : k + 1 > progressCurrent ? "incomplete" : "current" } `} key={ k } ><div className="" /></div>)
            }
          </div>
        ) : null }

        { type === 2 ? (
          <div className="node-container two">
            <div className="end-points">
              <IconSmall name="exposure_zero" />
              <IconSmall name="place" />
            </div>
            <div className="mid-points">
              {
                Array.from({ length: 11 }, (v, k) => <IconSmall key={ k } name="brightness_1" size={4} />)
              }
            </div>
            <div className="current-point">
              <div className="current-point-spacer" style={{ width: `calc(${progressPercent + '%'} - ( 24px / 100 * ${progressPercent}  )` }} />
              <IconSmall name="local_shipping" />
            </div>
          </div>
        ) : null }

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent + '%'}` }} />
          <div className="progress-bar-empty" />
        </div>
      </div>
    );
  }
}

export default ProgressBar;
