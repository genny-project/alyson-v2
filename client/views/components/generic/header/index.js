// export { default } from './Header.jsx';

import { connect } from 'react-redux';
import Header from './Header.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity }
}

export default connect( mapStateToProps, null )( Header );
