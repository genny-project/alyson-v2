import './progressNodes.scss';
import React, { Component } from 'react';
import { string, array, object, number } from 'prop-types';
import { IconSmall } from 'views/components';

class ProgressNodes extends Component {

    static defaultProps = {
        className: '',
        nodes: [],
        current: 1,
    }

    static propTypes = {
        className: string,
        style: object,
        nodes: array,
        current: string || number,
        icon: string,
    }

    render() {

        const { className, current, nodes, style, icon} = this.props;
        const componentStyle = { ...style, };

        if(nodes == null) return null;

        const width = nodes && nodes.length > 0 ? 100 / nodes.length : 100 ;
        
        const selectedNode = nodes.filter(x => {
            return Number.isInteger(current) ? x.index == current : x.code = current;
        })[0];

        return (
            <div className={`progress-nodes ${className} ${window.getScreenSize()}`} style={componentStyle}>
                <div className="node-container">
                    {
                        nodes.sort((x,y) => x.index < y.index ? -1 : 1).map((node, index) => {

                            return (
                                <div
                                    className={`node ${ node.index == selectedNode.index ? 'current' : node.index < selectedNode.index ? 'complete' : 'incomplete' } `}
                                    key={ index }
                                    style={{ width: `${width}%` }}
                                >
                                    <div className='node-text-wrapper'>
                                        <span className='node-text'>
                                            {node && node.text}
                                        </span>
                                    </div>
                                    <div className='node-spacer'>
                                        {/* {
                                            index + 1 < 2 ?
                                                // <IconSmall className='node-icon' size={24} name={node.icon || icon}/>
                                            : null
                                        } */}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                <div className="progress-nodes-container" style={{ width: `${100 - width}%` }}>
                    <div className="progress-nodes-fill" style={{ width: `${( selectedNode && selectedNode.index - 1 || 1 ) / (nodes.length - 1) * 100 + '%'}` }} />
                    <div className="progress-nodes-empty" />
                </div>
            </div>
        );
    }
}

export default ProgressNodes;
