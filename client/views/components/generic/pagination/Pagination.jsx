import './pagination.scss';
import React, { Component } from 'react';
import { string, object, number, bool, any } from 'prop-types';
import ReactPaginate from 'react-paginate';
import { IconSmall, Spinner } from 'views/components';
import VisibilitySensor from 'react-visibility-sensor';
import { GennyBridge } from 'utils/genny';

const LoadingIndicator = ({ isVisible }) => {
    
    return (
        <p>
            {
                isVisible ? 'Loading..' : 'Pull to load more'
            }
        </p>
    );
};

class Pagination extends Component {

    static defaultProps = {
        className: '',
        hidePage: false,
        loadMoreOnScroll: false,
    }

    static propTypes = {
        className: string,
        children: any,
        style: object,
        totalItems: number,
        perPage: number,
        marginPagesDisplayed: number,
        pageRangeDisplayed: number,
        hidePageNumbers: bool,
        hideNav: bool,
        loadMoreOnScroll: bool,
    }

    state = {
        pageCount: null,
        pageCurrent: 1,
        offset: 0,
        childrenCurrent: 1,
        children: null,
        loading: false,
    }

    componentDidMount() {

        this.setState({
            children: this.props.children,
            pageCount: Math.ceil( Object.keys(this.props.children).length / this.props.perPage ),
        });
    }

    componentWillUnmount() {
      }

    componentWillReceiveProps(newProps) {
        // console.log(newProps.children);
        this.setState({
            children: newProps.children,
            pageCount: Math.ceil( Object.keys(newProps.children).length / this.props.perPage ),
            loading: false,
        });
    }

    getChildrenForCurrentPage = (perPage, offset, children) => {

        const { loadMoreOnScroll } = this.props;
        if(loadMoreOnScroll) {
            return children;
        }

        let displayedItems = children.slice(offset, offset + perPage);
        return displayedItems;
    }

    handlePageClick = (data) => {
        let selectedPage = data.selected;
        const { perPage } = this.props;
        let offset = Math.ceil(selectedPage * perPage);
        this.setState({
            offset: offset, pageCurrent: selectedPage + 1}, () => {
        });
    }  

    loadMore = (isVisible) => {
        
        const { loading, pageCurrent } = this.state;
        if(!loading && isVisible) {

            this.setState({
                loading: true,
            });
    
            /* we send an event to back end */
            console.log('paginating...');
            GennyBridge.sendBtnClick('PAGINATION', {
                value: JSON.stringify({
                    rootCode: this.props.root,
                    pageStart: pageCurrent,
                    pageSize: this.props.perPage,
                    beCode: 'BEG'
                })
            });
        }
        else {

            this.setState({
                loading: false,
                shouldHideSpinner: false
            });
        }
    }

    render() {

        const { className, hideNav, children, style, perPage, loadMoreOnScroll } = this.props;
        const { pageCount, offset, shouldHideSpinner } = this.state;
        const componentStyle = { ...style };

        let childrenCount = Object.keys(this.props.children).length;
        const childrenPageArray = this.getChildrenForCurrentPage(perPage, offset, children);

        let nav = hideNav || childrenCount <= perPage ? 'hide-nav' : '';

        return (
            <div className={`pagination ${className} ${nav}`} style={componentStyle}  >
                <div className='pagination-content'>
                    {childrenPageArray}
                </div>
                {
                    loadMoreOnScroll 
                    ? <VisibilitySensor onChange={this.loadMore} scrollCheck={true}>
                    {({isVisible}) => {

                        setTimeout(() => {
                            this.setState({
                                shouldHideSpinner: true
                            });
                        }, 5000);
                        return <div>{isVisible && !shouldHideSpinner ? <Spinner /> : ''}</div>;
                    }
                    }
                    </VisibilitySensor>
                    : <ReactPaginate
                        pageCount={pageCount}
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName="pagination-main"
                        pageClassName="pagination-number"
                        previousClassName="pagination-prev"
                        nextClassName="pagination-next"
                        activeClassName="pagination-current"
                        breakClassName="pagination-break"
                        previousLabel={<IconSmall name='chevron_left' />}
                        nextLabel={<IconSmall name='chevron_right' />}
                    />
                }
            </div>
        );
    }
}

export default Pagination;
