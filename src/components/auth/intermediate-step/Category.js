import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toastr } from 'react-redux-toastr'
import { Row, Col, Typography, Button } from 'antd';
import { langs } from '../../../config/localization';
import Icon from '../../customIcons/customIcons';
import { menuSkip } from '../../../actions/index';
import { MESSAGES } from '../../../config/Message'
import { STATUS_CODES } from '../../../config/StatusCode';
const { Title, Paragraph } = Typography;

class Category extends React.Component {

  //Intermediate step first
  /**
  * @method handleMenuSkip
  * @description handle menuskip action
  */
  handleMenuSkip = () => {
    this.props.menuSkip(res => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success,MESSAGES.MENU_SKIPED_SUCCESS)
      }
    })
  }

  /**
  * @method render
  * @description render component
  */
  render() {
    return (
      <Fragment>
        <div className='align-center mt-60 pb-50' style={{ position: 'relative' }}>
          <Title level={2} className='text-gray pb-20'>Hi there, let’s get started</Title>
          <Paragraph className='text-gray'>Select the categories you are most interesting in seeing.</Paragraph>
          <Paragraph className='text-gray'>Don’t worry, you can still find all the <br />shopping experiences in the main menu!</Paragraph>
          <Link to='/' className='skip-link uppercase' >Skip</Link>
          <Link to='/' onClick={() => this.handleMenuSkip()} className='not-interested-link'>Not Interested</Link>
        </div>
        <Row gutter={[90, 90]}>
          <Col xs={12} lg={6}>
            <div className='radius-10 align-center category-box' style={{ backgroundColor: '#7EC5F7', cursor: 'default', height: '100%' }}>
              <Icon icon='classifieds' size='52' />
              <Paragraph className='title fs-18'>Classifieds</Paragraph>
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className='radius-10 align-center category-box' style={{ backgroundColor: '#FFC468', cursor: 'default', height: '100%' }}>
              <Icon icon='location-search' size='52' />
              <Paragraph className='title fs-18'>Bookings</Paragraph>
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className='radius-10 align-center category-box' style={{ backgroundColor: '#98CE31', cursor: 'default', height: '100%' }}>
              {/* <Icon icon='food-scanner' size='52' /> */}
              <div style={{minHeight: 58}}>
                <img src={require('../../../assets/images/icons/food-scanner-white.png')} alt='' />
              </div>
              <Paragraph className='title fs-18'>Food Scanner</Paragraph>
            </div>
          </Col>
          <Col xs={12} lg={6}>
            <div className='radius-10 align-center category-box' style={{ backgroundColor: '#CA71B7', cursor: 'default', height: '100%' }}>
              <Icon icon='cart' size='52' />
              <Paragraph className='title fs-18'>Retail</Paragraph>
            </div>
          </Col>
        </Row>
        <div className='steps-action align-center mb-32'>
          <Button htmlType='submit' type='primary' size='middle' className='btn-blue' onClick={() => this.props.nextStep()}>
            NEXT
        </Button>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser
  };
};

export default connect(
  mapStateToProps,
  { menuSkip }
)(Category);