import './bucketCard.scss';
import React, { Component } from 'react';
import { string, bool, array, number } from 'prop-types';
import { Button, IconSmall, ProgressBar, Status, Dropdown } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';

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
 

  toggleOptions = () => {

      this.setState({
          isShowingOptions: !this.state.isShowingOptions
      });
  }

  moveItem = () => {

      // hide option menu
      this.toggleOptions()

      // show options
      if(this.props.showMovingOptions) {
          this.props.showMovingOptions(this);
      }
  }

  render() {

    const { className, title, description, level, style, showProgress, progressCurrent, progressTotal, children  } = this.props;
    const { isShowingOptions, isOpen } = this.state;

    let layoutColor = BaseEntityQuery.getBaseEntityAttribute(description, 'LAY_COLOR');
    
    const componentStyle = { ...style, backgroundColor: layoutColor.value || '' };

    const collapseArrow = isOpen ? 'expand_more' : 'expand_less';

    let dropDownStyle = {
        float: "left",
    };

    let dropDownContentStyle = {
        background: "white",
        boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.4)",
        padding: "0px",
    };

    let dropDownTagStyle = {
        left: "10%",
        transform: `translate(10%)`,
        WebkitTransform: `translate(10%)`,
        msTransform: `translate(10%)`,
        WebKitFilter: "drop-shadow(0px -3px 2px rgba(0,0,0, 0.3))",
        filter: "drop-shadow(0px -3px 2px rgba(0,0,0, 0.3))",
        borderColor: "transparent transparent white",
    };

    return (
      <div className={`bucket-card ${className} clickable ${isShowingOptions ? 'showOptions' : ''}`} style={componentStyle} onClick={() => this.props.onClick(this)} >   
        {
          window.getScreenSize() == "sm" ? 
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
        { this.props.layout || null }
        {showProgress ? <ProgressBar progressTotal={progressTotal} progressCurrent={progressCurrent} type={2} /> : null}
      </div>
    );
  }
}

export default BucketCard;