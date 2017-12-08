import { connect } from 'react-redux';
import AppContent from './AppContent';

function mapStateToProps(state) {
  return { layout: state.layouts, baseEntity: state.baseEntity.data, asks: state.ask.data }
}

export default connect( mapStateToProps, null )( AppContent );
