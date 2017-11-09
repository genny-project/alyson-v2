import { connect } from 'react-redux';
import GennyTreeView from './GennyTreeView.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, componentState: state.app.componentState }
}

export default connect( mapStateToProps, null )( GennyTreeView );
