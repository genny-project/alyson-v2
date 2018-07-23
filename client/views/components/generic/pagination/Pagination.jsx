import './pagination.scss';
import React, { Component } from 'react';
import { string, object, number, bool, any } from 'prop-types';
import ReactPaginate from 'react-paginate';
import { IconSmall } from 'views/components';
import VisibilitySensor from 'react-visibility-sensor';

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
        children: null
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
        });
    }

    getChildrenForCurrentPage = (perPage, offset, children) => {

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

    loadMore = () => {
        
        const { loading } = this.state;

        if(!loading) {

            this.setState({
                loading: true,
            });
    
            /* we send an event to back end */
            const data = {
                root: this.props.root,
            };
            console.log( data )
        }
    }

    render() {

        const { className, hideNav, children, style, perPage, loadMoreOnScroll } = this.props;
        const { pageCount, offset } = this.state;
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
                    ? <VisibilitySensor onChange={this.loadMore}>
                    {({isVisible}) =>
                        <div>{isVisible ? 'Loading data...' : ''}</div>
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
