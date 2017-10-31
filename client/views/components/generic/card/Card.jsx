import './card.scss';
import React, { Component } from 'react';
import { string, array, object } from 'prop-types';
import { Button, IconSmall, ProgressBar } from '../';
import { TransitionGroup, Transition } from 'react-transition-group';

class Card extends Component {

  static defaultProps = {
    className: '',
    answerGroup: {},
  }

  static propTypes = {
    className: string,
    answerGroup: object,
  }

  state = {
    isVisible: false,
    showProgress: this.props.answerGroup.showProgress ? this.props.answerGroup.showProgress : false,
    pageCount: this.props.answerGroup.pageCount ? this.props.answerGroup.pageCount : 1,
    pageCurrent: this.props.answerGroup.pageCurrent ? this.props.answerGroup.pageCurrent : 1,
    data: this.props.answerGroup.data ? this.props.answerGroup.data : [],
    textOne: this.props.answerGroup.textOne ? this.props.answerGroup.textOne : '',
    textTwo: this.props.answerGroup.textTwo ? this.props.answerGroup.textTwo : '',
    buttons: this.props.answerGroup.buttons ? this.props.answerGroup.buttons : [],
    level: this.props.answerGroup.level ? this.props.answerGroup.level : '',
    displayType: this.props.answerGroup.index ? this.props.answerGroup.index + 1 : 1,
  }

  handleClick = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  SlideContent() {
    const { showProgress, pageCurrent, pageCount, data, buttons, level } = this.state;

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
                {
                  data.map(d => {
                    return <div className={`card-data ${d.name}`} key={d.name}>
                      <IconSmall name={d.icon}/>
                      <span>{d.value}</span>
                    </div>;
                  })
                }
                <div className="card-buttons">
                  {
                    buttons.map(b => {
                      return <Button className={b.class} key={b.name}>
                        <IconSmall name={b.icon}/>
                        <span>{b.value}</span>
                      </Button>;
                    })
                  }
                </div>

                {showProgress ? <ProgressBar progressTotal={pageCount} progressCurrent={pageCurrent} type={2} /> : null}
              </div>

            );
          }
        }
      </FadeTransition>
    );
  }

  render() {
    const { className, answerGroup } = this.props;
    const { textOne, textTwo, level, isVisible, data, buttons, displayType } = this.state;
    console.log(isVisible);
    const collapseContent = isVisible ? this.SlideContent() : '';
    const collapseArrow = isVisible ? 'expand_more' : 'expand_less';

    return (
      <div className={`card ${className}`}>
        <div className="card-top">

          { displayType === 2 || displayType === 3 ? <div className="card-image" /> : null }

          <div className="card-center">

            <div className="card-info">
              <span>{textOne}</span>
              { displayType === 2 || displayType === 3 ? <span>{textTwo}</span> : null }
            </div>

            <div className="card-toggle" onClick={this.handleClick} >
              <IconSmall name={collapseArrow} />
            </div>

          </div>

          <div className={`card-light ${level}`} style={ displayType === 1 ? {height: 'initial'} : null }/>

        </div>




        <TransitionGroup>

          {collapseContent}

        </TransitionGroup>
      </div>
    );
  }
}

export default Card;
