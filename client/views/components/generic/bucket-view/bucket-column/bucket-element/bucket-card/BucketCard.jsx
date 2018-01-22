import './bucketCard.scss';
import React, { Component } from 'react';
import { string, bool, number, func, object, any } from 'prop-types';
import { IconSmall, ProgressBar, Dropdown } from 'views/components';

class BucketCard extends Component {
  static defaultProps = {
    className: '',
    title: '',
    description: '',
    isVisible: false,
    level: '',
    showProgress: false,
    progressTotal: null,
    progressCurrent: null,
  }

  static propTypes = {
    className: string,
    title: string,
    description: string,
    isVisible: bool,
    level: string,
    showProgress: bool,
    progressTotal: number,
    progressCurrent: number,
    showMovingOptions: func,
    style: object,
    layout: any,
    backgroundColor: string,
    onClick: func,
  }

  state = {
      isShowingOptions: false,
      isOpen: this.props.isVisible ? this.props.isVisible : false
  }

  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  shouldComponentUpdate(nextProps, nextState) {

    nextState.isOpen = this.state.isOpen;
    return true;
 }

  toggleOptions = () => {

      this.setState({
          isShowingOptions: !this.state.isShowingOptions
      });
  }

  moveItem = () => {

      // hide option menu
      this.toggleOptions();

      // show options
      if(this.props.showMovingOptions) {
          this.props.showMovingOptions(this);
      }
  }

  render() {

    const { className, style, backgroundColor, layout, onClick  } = this.props;
    const { isShowingOptions } = this.state;

    const componentStyle = { ...style, backgroundColor: backgroundColor || '' };

    let dropDownStyle = {
      float: 'left',
      padding: '5px 0',
      transform: 'translateX(-5px)',
      width: 'fit-content'
    };

    let dropDownContentStyle = {
        background: 'white',
        boxShadow: '0px 0px 5px 1px rgba(0,0,0,0.4)',
        padding: '0px',
    };

    let dropDownTagStyle = {
        left: '10%',
        transform: 'translate(10%)',
        WebkitTransform: 'translate(10%)',
        msTransform: 'translate(10%)',
        WebKitFilter: 'drop-shadow(0px -3px 2px rgba(0,0,0, 0.3))',
        filter: 'drop-shadow(0px -3px 2px rgba(0,0,0, 0.3))',
        borderColor: 'transparent transparent white',
    };

    return (
      <div className={`bucket-card ${className} clickable ${isShowingOptions ? 'showOptions' : ''}`} style={componentStyle} onClick={() => onClick(this)} >
        {
          window.getScreenSize() == 'sm' ?
          <Dropdown
              style={dropDownStyle}
              tagStyle={dropDownTagStyle}
              contentStyle={dropDownContentStyle}
              header={<IconSmall name="more_vert" onClick={this.toggleOptions} />}
              >
              <ul className="card-options">
                <li onClick={this.moveItem}>Move</li>
                <li onClick={this.toggleOptions}>Cancel</li>
              </ul>
          </Dropdown> : null
        }
        {layout}
      </div>
    );
  }
}

export default BucketCard;
