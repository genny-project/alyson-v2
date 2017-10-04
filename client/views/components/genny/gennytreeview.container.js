import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import GennyTreeView from './GennyTreeView.jsx';

function mapDispatchToProps( dispatch ) {
  return bindActionCreators({}, dispatch );
}

export default connect( null, mapDispatchToProps )( GennyTreeView );
