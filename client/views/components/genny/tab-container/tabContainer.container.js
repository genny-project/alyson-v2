import { connect } from 'react-redux';
import TabContainer from './TabContainer';

function mapStateToProps(state) {
  return { layout: state.layouts, baseEntity: state.baseEntity.data };
}

export default connect( mapStateToProps, null )( TabContainer );
