import { connect } from 'react-redux';
import GennyBucketView from './GennyBucketView.jsx';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, asks: state.ask }
}

export default connect( mapStateToProps, null )( GennyBucketView );
