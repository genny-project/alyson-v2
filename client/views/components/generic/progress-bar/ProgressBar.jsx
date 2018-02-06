import './progressBar.scss';
import React, { Component } from 'react';
import { string, number, object } from 'prop-types';
import { IconSmall } from 'views/components';

class ProgressBar extends Component {

  static defaultProps = {
    className: '',
    progressCurrent: 0,
    iconStart: 'exposure_zero',
    iconProgress: 'local_shipping',
    iconEnd: 'place',
  }

  static propTypes = {
    className: string,
    style: object,
    progressCurrent: number,
    iconStart: string,
    iconProgress: string,
    iconEnd: string,
  }

  render() {

    const { className, progressCurrent, progressTotal, type, style, iconStart, iconEnd, iconProgress } = this.props;
    const componentStyle = { ...style, };

    const progressPercent = progressCurrent <= 100 ? progressCurrent : 100;


    return (
      <div className={`progress-bar ${className} `} style={componentStyle}>
        <div className="point-container">
          <div className="end-points">
            <IconSmall className='start-point' name={iconStart} />
            <IconSmall className='end-point' name={iconEnd} />
          </div>
          <div className="mid-points">
            {
              Array.from({ length: 11 }, (v, k) => <IconSmall key={ k } name="brightness_1" fontSize='4px' size={4} />)
            }
          </div>
          <div className="current-point">
            <div className="current-point-spacer" style={{ width: `calc(${progressPercent + '%'} - ( 24px / 100 * ${progressPercent}  )` }} />
            <IconSmall name={iconProgress} />
          </div>
          </div>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent + '%'}` }} />
          <div className="progress-bar-empty" />
        </div>
      </div>
    );
  }
}

export default ProgressBar;
