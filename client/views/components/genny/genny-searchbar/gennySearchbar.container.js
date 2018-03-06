import { connect } from 'react-redux';
import GennySearchBar from './GennySearchBar.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, componentState: state.app.componentState };
}

export default connect( mapStateToProps, null )( GennySearchBar );
