// export { default } from './Sidebar.jsx';

import { connect } from 'react-redux';
import Sidebar from './Sidebar.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity };
}

export default connect( mapStateToProps, null )( Sidebar );
