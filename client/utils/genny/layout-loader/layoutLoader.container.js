import { connect } from 'react-redux';
import LayoutLoader from './LayoutLoader.jsx';

const mapStateToProps = state => ({
  layouts: state.layouts,
  baseEntity: state.baseEntity,
});

export default connect( mapStateToProps, null )( LayoutLoader );
