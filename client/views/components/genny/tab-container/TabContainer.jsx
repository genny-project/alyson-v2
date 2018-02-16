import './tabContainer.scss';
import React, { Component } from 'react';
import {  } from 'views/components';
import { array, string, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class TabContainer extends Component {

    static defaultProps = {
    }

    static propTypes = {
        views: array,
        className: string,
        style: object,
    };

    state = {
    }

    componentWillMount() {
        const { views } = this.props;
        if( views && views.length > 0 ) {
            this.setState({
                currentViewIndex: 0
            });
        }
    }

    handleClick = (newViewIndex) => {
        const { currentViewIndex } = this.state;

        if (currentViewIndex != newViewIndex ) {

            this.setState({
                currentViewIndex: newViewIndex
            });
        }
    }

    renderTabs = (data) => {
        let tabs = [];
        if (data && data.length) {
            data.map((view, index) => {
                tabs.push(
                    <div className={`view-tab ${this.state.currentViewIndex == index ? 'selected' : ''}`} key={index} onClick={() => this.handleClick(index)}>
                        <span>{view.title}</span>
                    </div>
                );
            });
        }
        return tabs;
    }

    renderContent = (data) => {
        const { currentViewIndex } = this.state;
        if ( data[currentViewIndex] && data[currentViewIndex].layout ) {
            let currentLayout = data[currentViewIndex].layout;
            
            return <LayoutLoader
                layout={currentLayout}
            />;
        }
        return null;
    }

    render() {

        const { className, style, views, } = this.props;

        const componentStyle = { ...style };

        return (
            <div className={`tab-container ${className} ${window.getScreenSize()}`} style={componentStyle} >
                <div className='tab-holder'>
                    {this.renderTabs(views)}
                </div>
                <div className='tab-container-content'>
                    {this.renderContent(views)}
                </div>
            </div>
        );
    }
}

export default TabContainer;
