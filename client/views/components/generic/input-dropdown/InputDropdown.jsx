import './inputDropdown.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { string, bool, array } from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';

class InputDropdown extends GennyComponent {

  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      currentValue: '',
      currentSelect: '',
      highlight: 0
    };

    this.handleDropdown = this.handleDropdown.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleDropdown() {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  }


  handleSelect(event, index, name, value){
    console.log(name, value);

    this.setState({ 
      currentValue: value,
      currentSelect: name,
      highlight: index,
      isVisible: false
    });
  }

  handleBlur(){
    this.setState({ 
      isVisible: false
    });
  }

  handleFocus(){
    this.setState({ 
      isVisible: true
    });
  }

  handleKeyPress = (event) => {
      event.preventDefault();
      console.log(event.key);
      if (event.key === 'ArrowUp'){
        this.setState(prevState => ({
          highlight: prevState.highlight - 1
        }));
      } else if (event.key === 'ArrowDown'){
        this.setState(prevState => ({
          highlight: prevState.highlight + 1
        }));
      }
  }

  static defaultProps = {
    className: '',
    name: '',
    readOnly: false,
    defaultValue: '',
    placeholder: '',
    options: [],
    label: '',
  }

  static propTypes = {
    className: string,
    name: string,
    readOnly: bool,
    defaultValue: string,
    placeholder: string,
    options: array,
    label: string,
  }

  render() {
    const { className, name, readOnly, defaultValue, placeholder, options, label } = this.props;
    const collapseContent = this.state.isVisible ? this.DropdownOptions() : '';
    const collapseArrow = this.state.isVisible ? 'expand_less' : 'expand_more';
    const currentValue = this.state.currentValue;
    const currentSelect = this.state.currentSelect;
    return (
      <div className={`input-dropdown ${className}`}>
        {label ? <Label>{label}</Label> : null }
        <div className="input-dropdown-main" onClick={this.handleDropdown} >
          <input type="text" id="one" readOnly value={currentSelect} onFocus={this.handleFocus} onBlur={this.handleBlur} onKeyDown={(event) => this.handleKeyPress(event)}/>
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
    const highlight = this.state.highlight;
    return (
      <div className="dropdown-options">
        {
          options.map((o, index) => {
            return <div className={`dropdown-option ${highlight === index ? 'highlight': ''}`} key={o.name} value={o.value} onMouseDown={ (e) => this.handleSelect(e, index, o.name, o.value) }>
                <span>{o.name}</span>
            </div>;
          })
        }
      </div>
    );
  }

}

export default InputDropdown;