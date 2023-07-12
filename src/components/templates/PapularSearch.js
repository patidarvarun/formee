import React from 'react';
import { connect } from 'react-redux';
import {
  Input,
  Typography,
  Row,
  Col,
  Modal,
} from 'antd';
const { Text } = Typography;
const { TextArea } = Input;

class PapularSearchModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: 0,
    };
  }
   
    
   /**
  * @method renderPapularSearch
  * @description render papular search list
  */
   renderPapularSearch = (data) => {
    return data.length && data.map((el, i) => {
        return (
             <Col md={8} key={i}>
                <div>
                    <Text>{el.keyword}</Text>
                </div>
            </Col>
        )
    })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, popularSearches} = this.props;
    return (
        <Modal
            title='Popular Searches'
            visible={visible}
            className={'custom-modal style1 modal-psearch'}
            footer={false}
            onCancel={this.props.onCancel}
        >
        <Row gutter={[16, 16]} className='pt-10 pb-10'>
            {popularSearches && this.renderPapularSearch(popularSearches)}
        </Row>
    </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(PapularSearchModel);
