import { connect } from 'react-redux';
import GennyHeader from './GennyHeader.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, componentState: state.app.componentState, currentPath: state.app.currentPath, currentProject: state.baseEntity.aliases.PROJECT, currentUser: state.baseEntity.aliases.USER, token: state.keycloak.token };
}

export default connect( mapStateToProps, null )( GennyHeader );
