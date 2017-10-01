import './card.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { string, array, } from 'prop-types';
import { Button, IconSmall } from '../';
import { CSSTransitionGroup } from 'react-transition-group';

class Card extends GennyComponent {
  constructor(props) {
    super(props);
    this.state = { isVisible: true };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  static defaultProps = {
    className: '',
    data: [],
    text1: '',
    text2: '',
    buttons: [],
    level: '',
  }

  static propTypes = {
    className: string,
    data: array,
    text1: string,
    text2: string,
    buttons: array,
    level: string,
  }

  SlideContent() {
    const { data, buttons } = this.props;
    return (

      <div className="card-collapse">
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
      </div>
    );
  }


  render() {
    const { className, text1, text2, level } = this.props;
    const collapseContent = this.state.isVisible ? this.SlideContent() : '';
    const collapseArrow = this.state.isVisible ? 'expand_less' : 'expand_more';
    return (
      <div className={`card ${className}`}>
        <div className="card-top">
          <div className="card-image" />
          <div className="card-info">
            <span>{text1}</span>
            <span>{text2}</span>
          </div>
          <div className={`card-light ${level}`} />
        </div>
        <div className="card-toggle" onClick={this.handleClick} >
          <IconSmall name={collapseArrow}/>
        </div>
        <CSSTransitionGroup
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>

          {collapseContent}

        </CSSTransitionGroup>
      </div>
    );
  }
}

export default Card;
