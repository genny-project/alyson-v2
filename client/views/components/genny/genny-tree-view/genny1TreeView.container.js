import { connect } from 'react-redux';
import GennyTreeView from './GennyTreeView.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity }
}

export default connect( mapStateToProps, null )( GennyTreeView );
