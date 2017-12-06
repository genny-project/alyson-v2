import './card.scss';
import React, { Component } from 'react';
import { string, bool, array, number } from 'prop-types';
import { Button, IconSmall, ProgressBar, Status, Dropdown } from '../';

class Card extends Component {

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

  getCardContent() {
    const { showProgress, progressCurrent, progressTotal, children } = this.props;

    return (
      <div className={`card-collapse fade fade-${status}`}>
        {children}
        {showProgress ? <ProgressBar progressTotal={progressTotal} progressCurrent={progressCurrent} type={2} /> : null}
      </div>
    );
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

    const { className, title, description, level, style } = this.props;
    const { isShowingOptions, isOpen } = this.state;
    const componentStyle = { ...style, };
    const cardContent = isOpen ? this.getCardContent() : '';
    const collapseArrow = isOpen ? 'expand_more' : 'expand_less';

    let dropDownStyle = {
        width: "100px",
        position: "absolute",
        left: "0px",
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
      <div className={`card ${className} clickable ${isShowingOptions ? 'showOptions' : ''}`} style={componentStyle} onClick={() => this.props.onClick(this)} >
        <div className="card-top">
            {
                window.getScreenSize() == "sm" ? <IconSmall name="more_vert" onClick={this.toggleOptions} /> : null
            }
            {
                isShowingOptions ?
                <Dropdown
                    style={dropDownStyle}
                    tagStyle={dropDownTagStyle}
                    contentStyle={dropDownContentStyle}
                    open={true}
                    >
                    <ul className="card-options">
                      <li onClick={this.moveItem}>Move</li>
                      <li onClick={this.toggleOptions}>Cancel</li>
                    </ul>
                </Dropdown> : null
            }
          <div className="card-image">
              <img />
          </div>
          <div className="card-center">
            <span>{title}</span>
            <span>{description}</span>
            <div className="card-toggle" >
              <IconSmall name={collapseArrow} onClick={this.handleClick}/>
            </div>
          </div>
          <Status className="card-status" color="ff0000"/>
        </div>
          {cardContent}
      </div>
    );
  }
}

export default Card;
