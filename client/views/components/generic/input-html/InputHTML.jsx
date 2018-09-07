import './inputHTML.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import { Label, IconSmall, DisplayHTML } from 'views/components';

class InputHTML extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
    }

    state = {
        editorState: EditorState.createEmpty()
    }

    componentDidMount() {
        this.setState({
            editorState: EditorState.createEmpty()
        }, () => {
            this.updateValueFromProps(this.props);
        });
    }

    componentWillReceiveProps(nextProps) {
        this.updateValueFromProps(nextProps);
    }

    updateValueFromProps = ( props ) => {
        if ( props.value && ( props.value != null || props.value != undefined || props.value != '' ) ) {
            let contentState = stateFromHTML(props.value);

            this.setState({
                editorState: EditorState.createWithContent(
                    contentState
                )
            });
        }
    }

    focus = () => {
        this.refs.editor.focus();
    }

    handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    mapKeyToEditorCommand = (e) => {
        if (e.keyCode === 9 /* TAB */) {
            const newEditorState = RichUtils.onTab(
                e,
                this.state.editorState,
                4, /* maxDepth */
            );
            if (newEditorState !== this.state.editorState) {
                this.onChange(newEditorState);
            }
            return;
        }
        return getDefaultKeyBinding(e);
    }

    toggleBlockType = (blockType) => {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    toggleInlineStyle = (inlineStyle) => {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }
    
    getBlockStyle = (block) => {
        switch (block.getType()) {
            case 'blockquote': return 'RichEditor-blockquote';
            default: return null;
        }
    }

    onChange = (editorState) => {
        const contentState = editorState.getCurrentContent();
        
        let html = stateToHTML(contentState);
        
        this.setState({
            editorState,
            html: html,
        });
    }

    onBlur = () => {

        const { validationList, validation, identifier, onBlur } = this.props;
        const { html } = this.state; 

        if(onBlur) onBlur();    
        if(validation) validation(html, identifier, validationList);
    }

    renderButton = ( active, style, label, icon, onToggle ) => {
        let className = 'RichEditor-styleButton';
        if (active) {
            className += ' RichEditor-activeButton';
        }
        return (
            <span className={`${className } clickable`} onMouseDown={() => onToggle(style)}>
                {icon ? <IconSmall name={icon} /> : label}
            </span>
        );
    }

    render() {
        const { className, children, style, placeholder, validationStatus, name, type, mandatory } = this.props;
        const componentStyle = { ...style, };
        const { editorState, html } = this.state;

        const styleMap = {
            CODE: {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
                fontSize: 16,
                padding: 2,
            },
        };

        const blockTypes = [
            { label: 'Title', style: 'header-one', icon: 'title' },
            // { label: 'H2', style: 'header-two' },
            // { label: 'H3', style: 'header-three' },
            // { label: 'H4', style: 'header-four' },
            // { label: 'H5', style: 'header-five' },
            // { label: 'H6', style: 'header-six' },
            { label: 'Blockquote', style: 'blockquote', icon: 'format_quote' },
            { label: 'UL', style: 'unordered-list-item', icon: 'format_list_bulleted' },
            { label: 'OL', style: 'ordered-list-item', icon: 'format_list_numbered' },
            { label: 'Code Block', style: 'code-block', icon: 'code' },
        ];

        const inlineStyles = [
            { label: 'Bold', style: 'BOLD', icon: 'format_bold' },
            { label: 'Italic', style: 'ITALIC', icon: 'format_italic' },
            { label: 'Underline', style: 'UNDERLINE', icon: 'format_underlined' },
            { label: 'Strikethrough', style: 'STRIKETHROUGH', icon: 'strikethrough_s' },
        ];

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let classNamea = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                classNamea += ' RichEditor-hidePlaceholder';
            }
        }

        return (
            <div style={componentStyle} className="input input-tags">
                {name ? <div className='input-header'>
                    {name && <Label className="input-tags-picker-label" text={name} />}
                    {mandatory ? <Label className='input-label-required' textStyle={!validationStatus ? { color: '#cc0000' } : null} text="*  required" /> : null}
                </div> : null}
            
                <div className="RichEditor-controls">
                    {blockTypes.map((item) => {
                        const selection = editorState.getSelection();
                        const blockType = editorState
                            .getCurrentContent()
                            .getBlockForKey(selection.getStartKey())
                            .getType();
                        const isActive = item.style === blockType;
                        return (
                            this.renderButton(
                                isActive,
                                item.style,
                                item.label,
                                item.icon,
                                this.toggleBlockType,
                            )
                        );
                    })}
                    {inlineStyles.map((item) => {
                        const currentStyle = editorState.getCurrentInlineStyle();
                        const isActive = currentStyle.has(item.style);
                        return (
                            this.renderButton(
                                isActive,
                                item.style,
                                item.label,
                                item.icon,
                                this.toggleInlineStyle,
                            )
                        );
                    })}
                </div>

                <div className="RichEditor-controls">
                    
                </div>
                <div className={`${classNamea} input-field`} onClick={this.focus} >
                    <Editor
                        blockStyleFn={this.getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.mapKeyToEditorCommand}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        placeholder={placeholder || ''}
                        ref="editor"
                        spellCheck={true}
                    />
                </div>
            </div>
        );
    }
}

export default InputHTML;