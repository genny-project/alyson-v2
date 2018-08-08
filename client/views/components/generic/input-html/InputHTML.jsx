import './inputHTML.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { Label } from 'views/components';

// class InputHTML extends Component {

//     static defaultProps = {
//         className: '',
//     }

//     static propTypes = {
//         className: string,
//         style: object,
//         children: any,
//     }

//     state = {
//         editorState: EditorState.createEmpty()
//     }

//     onChange = (editorState) => {
//         console.log(editorState);
//         this.setState({
//             editorState
//         });
//     }

//     render() {

//         const { className, children, style, placeholder, validationStatus, name, type, mandatory } = this.props;
//         const componentStyle = { ...style, };
//         const { editorState } = this.state;
//         console.log(editorState);
//         return (
//             <div style={componentStyle} className="input input-tags">
//                 {name ? <div className='input-header'>
//                     {name && <Label className="input-tags-picker-label" text={name} />}
//                     {mandatory ? <Label className='input-label-required' textStyle={!validationStatus ? { color: '#cc0000' } : null} text="*  required" /> : null}
//                 </div> : null}

//                 <span>Html Input</span>
//                 <Editor editorState={editorState} onChange={this.onChange} />
//             </div>
//         );
//     }
// }

// export default InputHTML;

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote': return 'RichEditor-blockquote';
        default: return null;
    }
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span className={className} onMouseDown={this.onToggle}>
                {this.props.label}
            </span>
        );
    }
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

const BlockStyleControls = (props) => {
    const { editorState } = props;
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

var INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

const InlineStyleControls = (props) => {
    const currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type) =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
        </div>
    );
};

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

    focus = () => {
        this.refs.editor.focus();
    }

    handleKeyCommand(command, editorState) {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    mapKeyToEditorCommand(e) {
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

    toggleBlockType(blockType) {
        this.onChange(
            RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
            )
        );
    }

    toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    onChange = (editorState) => {
        console.log(editorState);
        this.setState({
            editorState
        });
    }

    render() {
        const { className, children, style, placeholder, validationStatus, name, type, mandatory } = this.props;
        const componentStyle = { ...style, };
        const { editorState } = this.state;

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

                 <BlockStyleControls
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />
                <div className={classNamea} onClick={this.focus}>
                    <Editor
                        blockStyleFn={getBlockStyle}
                        customStyleMap={styleMap}
                        editorState={editorState}
                        handleKeyCommand={this.handleKeyCommand}
                        keyBindingFn={this.mapKeyToEditorCommand}
                        onChange={this.onChange}
                        placeholder="Tell a story..."
                        ref="editor"
                        spellCheck={true}
                    />
                </div>
             </div>
        );
    }
}

export default InputHTML;