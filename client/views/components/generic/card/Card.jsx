import './card.scss';
import React, { Component } from 'react';
import { string, bool, array, number } from 'prop-types';
import { Button, IconSmall, ProgressBar, Status } from '../';
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
      <FadeTransition>
        {
          (status) => {
            console.log(status);
            if (status === 'exited') {
              return null
            }
            return (
              <div className={`card-collapse fade fade-${status}`}>
                {children}
                {showProgress ? <ProgressBar progressTotal={progressTotal} progressCurrent={progressCurrent} type={2} /> : null}
              </div>
            );
          }
        }
      </FadeTransition>
    );
  }

  render() {
    const { className, title, description, isVisible, level, style } = this.props;
    const componentStyle = { ...style, };
    const collapseContent = isVisible ? this.SlideContent() : '';
    const collapseArrow = isVisible ? 'expand_more' : 'expand_less';

    return (
      <div className={`card ${className}`}>
        <div className="card-top">
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
