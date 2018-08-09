import './inputTags.scss';
import React, { Component } from 'react';
import { string, object, any, number } from 'prop-types';
import { WithContext as ReactTags } from 'react-tag-input';
import { Label } from 'views/components';

class InputTags extends Component {

    static defaultProps = {
        className: '',
        suggestionLimit: 10,
        minQueryLength: 3,
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
        suggestionLimit: number,
        minQueryLength: number,
    }

    state = {
        tags: [],
        suggestions: [
            // {id: 'PHP', text: 'PHP JAVA'},
            // {id: 'ReactJS', text: 'React Javascript'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS PHP'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'PHP', text: 'PHP'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
            // {id: 'ReactJS', text: 'ReactJS'},
        ]
    }

    componentWillMount() {

        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    componentDidMount() {
        this.updateValueFromProps(this.props.value);
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.value != this.props.value
        ) {
            this.updateValueFromProps(nextProps.value);
        }
    }

    updateValueFromProps = (newValue) => {
        let tagArray = [];
        if(newValue != null && newValue.startsWith('[')) {
            tagArray = JSON.parse(newValue);

            if (Array.isArray(tagArray)) {
                tagArray = tagArray.map(value => (
                    {
                        id: value,
                        text: value
                    }
                ));
            }
        }
        this.setState({
            tags: [
                ...tagArray,
            ]
        });
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

    handleFilterSuggestions = (textInputValue, possibleSuggestionsArray) => {
        var lowerCaseQuery = textInputValue.toLowerCase();
    
        return possibleSuggestionsArray.filter(suggestion => {
            console.log(suggestion);
            const value = suggestion && suggestion.text;
            return value.toLowerCase().includes(lowerCaseQuery);
        }).filter((x, index) => index < this.props.suggestionLimit);
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
        const { validationStatus, name, type, mandatory, showTimeSelect, dateTimeDisplayFormat, dateDisplayFormat, timeDisplayFormat, inputMask, minQueryLength } = this.props;

        const componentStyle = { ...style, };
        const { tags, suggestions } = this.state;

        // console.log(this.props.items);
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
                   delimiters={[9, 188, 13]}
                   suggestions={suggestions}
                   minQueryLength={minQueryLength}
                   autofocus={false}
                   handleFilterSuggestions={this.handleFilterSuggestions}
                   handleDelete={this.handleDelete}
                   handleAddition={this.handleAddition}
                   handleDrag={this.handleDrag} />
           </div>
       );
    }
}

export default InputTags;
