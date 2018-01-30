import './form.scss';
import React, { Component } from 'react';
import { Pagination } from 'views/components';
import { string, bool, number, object } from 'prop-types';
import { FormGroup } from './form-group';

class Form extends Component {

  static defaultProps = {
    className: '',
    itemsPerPage: 3,
    data: [],
  }

  static propTypes = {
    className: string,
    itemsPerPage: number,
    showProgress: bool,
    data: object,
    style: object,
    isHorizontal: bool,
    hideNav: bool,
  }

  state = {
    showProgress: this.props.showProgress ? this.props.showProgress : false,
  }

  shouldComponentUpdate() {
      return true;
  }

  componentWillUpdate() {
      this.formGroupRefs = [];
  }

  componentWillMount() {
      this.formGroupRefs = [];
  }

  onFormSubmit = (formGroup, next) => {

    const validated = this.formGroupRefs.every(formGroup => {
        return formGroup ? formGroup.isFormGroupValid() : true;
    });

    const validate = function(inputs) {

        if(inputs.constructor == Array) {
            return inputs.every(x => {
                if(x.contructor == Boolean) {
                    return x === true;
                }
                else {
                    return validate(x);
                }
            });
        }
        else {
            return inputs === true;
        }
    };

    if(validate(validated)) {
        next(validated);
        return true;
    }

    return false;
  }

  renderGroup(questionGroup, index) {

      if(Array.isArray( questionGroup )) {

        return questionGroup.map((group, index) => {
            if(group.content) return this.renderGroup(group, index);
            return group;
        });
      }
      else if (questionGroup.content) {
          return (
              <FormGroup
                  ref={(groupRef) => this.formGroupRefs.push(groupRef)}
                  key={index}
                  title={questionGroup.title}
                  isHorizontal={questionGroup.isHorizontal}
                  submitButtons={questionGroup.submitButtons}
                  onValidation={ (next) => this.onFormSubmit(questionGroup, next)}
                  onSubmit={(action) => this.onFormSubmit(questionGroup, (validated) => questionGroup.onSubmit(action))}
                  data={this.renderGroup(questionGroup.content)}/>);
      }

      return [];
  }

  render() {

    const { style, itemsPerPage, isHorizontal, hideNav, data } = this.props;
    const componentStyle = { ...style };

    let questionGroup = this.renderGroup( data );

    return (
      <div className={`form-container ${isHorizontal ? 'horizontal' : null }`} style={componentStyle}>
        <div className="form-main">
          <div className="form-fields">
            { !isHorizontal && questionGroup.length > itemsPerPage ?
              <Pagination perPage={itemsPerPage} hideNav={hideNav}>
                {questionGroup}
              </Pagination>
            : questionGroup }
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
