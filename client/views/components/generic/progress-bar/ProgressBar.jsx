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
  }

  static propTypes = {
    className: string,
    currentNode: number,
    nodeCount: number
  }

  // state = {
  //   progress: this.props.currentNode / this.props.nodeCount * 100 + '%',
  // }

  render() {
    const { className, currentNode, nodeCount } = this.props;
    //const { progress } = this.state;
    const progress = currentNode / nodeCount * 100 + '%';
    console.log(progress);
    return (
      <div className={`progress-bar ${className}`}>
        <div className="node-container">
          <div className="node start" />
           {
                Array.from({ length: nodeCount }, (v, k) => <div className={`node ${ k < currentNode ? "complete" : "incomplete" } `} key={ k } ><div className="" /></div>)
            }
        </div>
         <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: progress }} />
          <div className="progress-bar-empty" />
        </div>
      </div>
    );
  }
}

export default ProgressBar;
