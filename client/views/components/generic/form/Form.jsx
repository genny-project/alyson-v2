import './form.scss';
import React, { Component } from 'react';
import { Pagination, Input } from 'views/components';
import { string, bool, number, array} from 'prop-types';
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
    data: array,
  }

  state = {
    showProgress: this.props.showProgress ? this.props.showProgress : false,
  }

  renderGroup(questionGroup) {

      if(Array.isArray( questionGroup )) {
        return questionGroup.map(group => {
          
            if(group.content) return this.renderGroup(group);
            return group;
        });
      }
      else if (questionGroup.content) {
        return (<FormGroup title={questionGroup.title} data={this.renderGroup(questionGroup.content)}/>);
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
