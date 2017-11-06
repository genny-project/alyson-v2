import { connect } from 'react-redux';
import GennyBreadcrumbs from './GennyBreadcrumbs.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity }
}

export default connect( mapStateToProps, null )( GennyBreadcrumbs );
