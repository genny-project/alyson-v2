import './inputDropdown.scss';
import React, { Component } from 'react';
import { string, bool, array } from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

class InputDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      currentValue: 'blank'
    };

    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleDropdown() {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }

  handleSelect = event => {
    
    const { value } = event.target;
    console.log( value );

    this.setState({ currentValue: value });
  }

  static defaultProps = {
    className: '',
    name: '',
    readOnly: false,
    defaultValue: '',
    placeholder: '',
    options: [],
  }

  static propTypes = {
    className: string,
    name: string,
    readOnly: bool,
    defaultValue: string,
    placeholder: string,
    options: array,
  }

  render() {
    const { className, name, readOnly, defaultValue, placeholder, options } = this.props;
    const collapseContent = this.state.isVisible ? this.DropdownOptions() : '';
    const collapseArrow = this.state.isVisible ? 'expand_less' : 'expand_more';
    const currentValue = this.state.currentValue;
    return (
      <div className={`input-dropdown ${className}`}>
        {name ? <span>{name}</span> : null }
        <div className="input-dropdown-selected" onClick={this.handleDropdown} >
          <span>{currentValue}</span>
          <i className="icon material-icons">{collapseArrow}</i>
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

  DropdownOptions() {
    const { options} = this.props;
    return (

      <div className="dropdown-options">
        {
          options.map(o => {
            return <div className={`dropdown-option`} key={o.name} value={o.value} onClick={this.handleSelect}>
                <span>{o.name}</span>
            </div>;
          })
        }
      </div>
    );
  }

}

export default InputDropdown;