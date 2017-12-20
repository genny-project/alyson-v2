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
             const formContainer = { backgroundColor: '#fff', display: 'flex', justifyContent: 'center', flexGrow: 1 };
             const formMain = { color: '#222', width: 600, marginTop: 50, marginBottom: 50, padding:20 };
             const formFields = { paddingBottom: 10 };             
             const { className, style, itemsPerPage, showProgress, isHorizontal, hideNav, data } = this.props;
             const componentStyle = { ...style };
             let questionGroup = this.renderGroup(data);
             return <div className={`form-container ${isHorizontal ? 'horizontal' : null}`} style={{ ...formContainer, ...componentStyle }}>
                 <div className="form-main" style={formMain}>
                   <div className="form-fields" style={formFields}>
                     {!isHorizontal && questionGroup.length > itemsPerPage ? <Pagination perPage={itemsPerPage} hideNav={hideNav}>
                         {questionGroup}
                       </Pagination> : questionGroup}
                   </div>
                 </div>
               </div>;
           }
}

export default Form;