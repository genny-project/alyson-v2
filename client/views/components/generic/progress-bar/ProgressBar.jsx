import './progressBar.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { string, array, number } from 'prop-types';
import { IconSmall } from '../';

class ProgressBar extends GennyComponent {
  
  static defaultProps = {
    className: '',
    currentNode: 0,
    nodeCount: 0,
    type: 0,
  }

  static propTypes = {
    className: string,
    currentNode: number,
    nodeCount: number,
    type: number
  }

  render() {
    const { className, currentNode, nodeCount, type } = this.props;
    const progress = currentNode / nodeCount * 100 + '%';
    return (
      <div className={`progress-bar ${className} ${type === 1 ? 'one' : type === 2 ? 'two' : ''} `}>
        { type === 1 ? (
          <div className="node-container one">
            <div className="node start" />
            {
              Array.from({ length: nodeCount }, (v, k) => <div className={`node ${ k + 1 < currentNode ? "complete" : k + 1 > currentNode ? "incomplete" : "current" } `} key={ k } ><div className="" /></div>)
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
            
          </div>
        ) : null }

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: progress }} />
          <div className="progress-bar-empty" />
        </div>
      </div>
    );
  }
}

export default ProgressBar;
