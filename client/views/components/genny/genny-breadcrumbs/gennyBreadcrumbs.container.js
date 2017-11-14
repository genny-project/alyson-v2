import { connect } from 'react-redux';
import GennyBreadcrumbs from './GennyBreadcrumbs.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, currentPath: state.app.currentPath }
}

export default connect( mapStateToProps, null )( GennyBreadcrumbs );
