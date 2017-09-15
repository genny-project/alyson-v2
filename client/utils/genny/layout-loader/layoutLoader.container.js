import { connect } from 'react-redux';
import LayoutLoader from './LayoutLoader.jsx';

const mapStateToProps = state => ({
  layouts: state.layouts,
});

export default connect( mapStateToProps, null )( LayoutLoader );
