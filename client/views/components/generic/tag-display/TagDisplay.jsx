import './tagDisplay.scss';
import React, { Component } from 'react';
import { string, object, array } from 'prop-types';
import { IconSmall } from 'views/components';

class TagDisplay extends Component {

    static defaultProps = {
        className: '',
        data: [
            {
                text: 'Cloud' 
            },
            {
                text: 'Music'
            },
            {
                text: 'Video' 
            },
            {
                text: 'Casdasdasdasd' 
            },
            {
                text: 'Tssdfsdfd'
            },
            {
                text: 'Gasd Jdasdasd' 
            },
            {
                text: 'Lasdasd' 
            },
            {
                text: 'Pdf'
            },
            {
                text: 'Tofkfkf Hfsdfsdfd' 
            },
            {
                text: 'Rewere' 
            },
            {
                text: 'Bsdfsdfdfdf'
            },
            {
                text: 'Bhhgg Gfgfgfg Bfgfg' 
            }
        ]
    }

    static propTypes = {
        className: string,
        style: object,
        data: array,
    }

    state = {
    }

    renderTags = (data) => {
        let asd = asd;

        if (Array.isArray(data)) {
            return data.map((item, index) => {
                return (
                    <div key={index} className='tag-display-tag' >
                        { item.icon ? 
                            <IconSmall
                                name={item.icon}
                                fontSize='12'
                            />
                        : null }
                        <span>{item && item.text}</span>
                    </div>
                );
            });
        }
        else if (typeof data == 'string') {
            return (
                <div className='tag-display-tag' >
                    <span>{data}</span>
                </div>
            );
        }
        else return null;
    }

    render() {
        const { className, data, style } = this.props;
        const {  } = this.state;
        const componentStyle = { ...style, };

        console.log(data);

        return (
            <div className={`tag-display-container ${className}`} style={componentStyle}>
                {this.renderTags(data)}
            </div>
        );
    }
}

export default TagDisplay;
