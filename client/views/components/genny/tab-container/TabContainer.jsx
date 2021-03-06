import './tabContainer.scss';
import React, { Component } from 'react';
import { IconSmall } from 'views/components';
import { array, string, object, bool } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class TabContainer extends Component {
  static defaultProps = {
    isVertical: false
  };

  static propTypes = {
    views: array,
    className: string,
    style: object,
    isVertical: bool,
    tabColor: string,
    contentStyle: object
  };

  state = {};

  componentWillMount() {
    const { views } = this.props;
    if (views && views.length > 0) {
      this.setState({
        currentViewIndex: 0
      });
    }
  }

  handleClick = newViewIndex => {
    const { currentViewIndex } = this.state;

    if (currentViewIndex != newViewIndex) {
      this.setState({
        currentViewIndex: newViewIndex
      });
    }
  };

  renderTabs = data => {

    const { tabColor } = this.props;

    let style = {};
    if(tabColor != null) {
        style.backgroundColor = tabColor;
    }

    let tabs = [];
    if (data && data.length) {
      data.map((view, index) => {
        tabs.push(
          <div
            className={`view-tab clickable ${
              this.state.currentViewIndex == index ? 'selected' : ''
            }`}
            key={index}
            onClick={() => this.handleClick(index)}
            style={style}
          >
            <IconSmall name={view.icon} />
            <span className="tab-title">{view.title}</span>
          </div>
        );
      });
    }
    return <div className="tab-holder">{tabs}</div>;
  };

  renderContent = data => {
    const { currentViewIndex } = this.state;
    if (data[currentViewIndex] && data[currentViewIndex].layout) {
      let currentLayout = data[currentViewIndex].layout;

      if (currentLayout.$$typeof) {
        return currentLayout;
      }
      return <LayoutLoader layout={currentLayout} />;
    }
    return null;
  };

  render() {
    const { className, style, views, isVertical, contentStyle } = this.props;
    const componentStyle = { ...style };

    let isMobile = window.getScreenSize() == 'sm';

    return (
      <div
        className={`tab-container ${className} ${window.getScreenSize()} ${
          isVertical ? 'vertical' : ''
        }`}
        style={componentStyle}
      >
        {isMobile ? null : this.renderTabs(views)}
        <div className="tab-container-content" style={contentStyle}>
          {this.renderContent(views)}
        </div>
        {isMobile ? this.renderTabs(views) : null}
      </div>
    );
  }
}

export default TabContainer;
