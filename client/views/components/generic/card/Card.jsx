import './card.scss';
import React, { Component } from 'react';
import { string, bool, array, number } from 'prop-types';
import { Button, IconSmall, ProgressBar, Status, Dropdown } from '../';
import { TransitionGroup, Transition } from 'react-transition-group';

class Card extends Component {

  static defaultProps = {
    className: '',
    title: '',
    description: '',
    isVisible: true,
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
  }

  handleClick = () => {

    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  SlideContent() {
    const { showProgress, progressCurrent, progressTotal, children } = this.props;

    const FadeTransition = (props) => (
      <Transition {...props} timeout={{ enter: 0, exit: 150 }} />
    );

    return (
      <div className={`card-collapse fade fade-${status}`}>
        {children}
        {showProgress ? <ProgressBar progressTotal={progressTotal} progressCurrent={progressCurrent} type={2} /> : null}
      </div>
    );
    //
    // return (
    //   <FadeTransition>
    //     {
    //       (status) => {
    //         if (status === 'exited') {
    //           return null
    //         }
    //         return (
    //           <div className={`card-collapse fade fade-${status}`}>
    //             {children}
    //             {showProgress ? <ProgressBar progressTotal={progressTotal} progressCurrent={progressCurrent} type={2} /> : null}
    //           </div>
    //         );
    //       }
    //     }
    //   </FadeTransition>
    // );
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

    const { className, title, description, isVisible, level, style, screenSize } = this.props;
    const { isShowingOptions } = this.state;
    const componentStyle = { ...style, };
    const collapseContent = isVisible ? this.SlideContent() : '';
    const collapseArrow = isVisible ? 'expand_more' : 'expand_less';

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
      <div className={`card ${className} ${isShowingOptions ? 'showOptions' : ''}`}>
        <div className="card-top">
            {
                screenSize == "xs" ? <IconSmall name="more_vert" onClick={this.toggleOptions} /> : null
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
          <div className="card-image" />
          <div className="card-center">
            <span>{title}</span>
            <span>{description}</span>
            <div className="card-toggle" onClick={this.handleClick} >
              <IconSmall name={collapseArrow} />
            </div>
          </div>
          <Status className="card-status" color="ff0000"/>
        </div>
        <TransitionGroup className="card-transition">
          {collapseContent}
        </TransitionGroup>
      </div>
    );
  }
}

export default Card;
