import './form.scss';
import React, { Component } from 'react';
import { Pagination, Input } from 'views/components';
import { string, bool, number, array, object } from 'prop-types';
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
  }

  state = {
    showProgress: this.props.showProgress ? this.props.showProgress : false,
  }

  componentWillMount() {
      this.formGroupRefs = [];
  }

  onFormSubmit = (formGroup, next) => {

    const validated = this.formGroupRefs.map(formGroup => {
        return formGroup ? formGroup.isFormGroupValid() : true
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
            })
        }
        else {
            return inputs === true;
        }
    };

    if(validate(validated)) {
        next();
        return true;
    }

    return false;
  }

  renderGroup(questionGroup) {

      if(Array.isArray( questionGroup )) {

        return questionGroup.map(group => {
            if(group.content) return this.renderGroup(group);
            return group;
        });
      }
      else if (questionGroup.content) {
          return (
              <FormGroup
                  ref={(groupRef) => this.formGroupRefs.push(groupRef)}
                  key={questionGroup.title}
                  title={questionGroup.title}
                  isHorizontal={questionGroup.isHorizontal}
                  submitButtons={questionGroup.submitButtons}
                  onSubmit={(action) => this.onFormSubmit(questionGroup, () => questionGroup.onSubmit(action))}
                  data={this.renderGroup(questionGroup.content)}/>);
      }

      return [];
  }

  render() {

    const { className, style, itemsPerPage, showProgress, isHorizontal, hideNav, data } = this.props;
    const componentStyle = { ...style, };

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
