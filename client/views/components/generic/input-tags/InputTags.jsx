import './inputTags.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { WithContext as ReactTags } from 'react-tag-input';
import { Label } from 'views/components';

class InputTags extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
    }

    state = {
        tags: [],
        suggestions: [
            {id: 'PHP', text: 'PHP'},
            {id: 'ReactJS', text: 'ReactJS'},
            {id: 'React Native', text: 'React Native'},
            {id: 'Swift', text: 'Swift'},
            {id: 'Advertising', text: 'Advertising'},
            {id: 'Marketing', text: 'Marketing'},
            {id: 'Accounting', text: 'Accounting'},
            {id: 'Computer Science', text: 'Computer Science'},
            {id: 'Artificial Intelligence', text: 'Artificial Intelligence'},
            {id: 'Business', text: 'Business'},
            {id: 'Microsoft Office 365', text: 'Microsoft Office 365'},
            {id: 'Business Development', text: 'Business Development'},
        ]
    }

    componentWillMount() {

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {

        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        }, (newState) => { this.onChange() });
    }

    handleAddition(tag) {

        const { tags } = this.state;
        this.setState({tags: [...tags, ...[tag]] }, (newState) => { this.onChange() });
    }

    handleDrag(tag, currPos, newPos) {

        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags }, (newState) => { this.onChange() });
    }

    onChange() {

        const { tags } = this.state;
        const { handleOnChange, validation, identifier, validationList } = this.props

        if(tags && tags.length && handleOnChange != null) {

            const value = tags.map(tag => tag.text);
            const stringifiedTags = JSON.stringify(value);
            if(validation) validation(stringifiedTags, identifier, validationList);
        }
    }

    render() {

        const { className, children, style, placeholder } = this.props;
        const { validationStatus, name, type, mandatory, showTimeSelect, dateTimeDisplayFormat, dateDisplayFormat, timeDisplayFormat, inputMask } = this.props;

        const componentStyle = { ...style, };
        const { tags, suggestions } = this.state;

        return (
           <div style={componentStyle} className="input input-tags">
               { name ? <div className='input-header'>
               { name && <Label className="input-tags-picker-label" text={name} /> }
               { mandatory ? <Label className='input-label-required' textStyle={ !validationStatus ? {color: '#cc0000'} : null} text="*  required" /> : null}
               </div> : null }
               <ReactTags tags={tags}
                   classNames={{
                        tagInputField: 'input-field',
                    }}
                   placeholder={placeholder}
                   delimiters={[32, 188, 13]}
                   suggestions={suggestions}
                   autofocus={false}
                   handleDelete={this.handleDelete}
                   handleAddition={this.handleAddition}
                   handleDrag={this.handleDrag} />
           </div>
       )
    }
}

export default InputTags;
