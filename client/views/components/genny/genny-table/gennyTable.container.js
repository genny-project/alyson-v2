import { connect } from 'react-redux';
import GennyTable from './GennyTable.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, asks: state.ask }
}

export default connect( mapStateToProps, null )( GennyTable );
