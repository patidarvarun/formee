import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { langs } from '../../config/localization';
import { Row, Col, Typography, Button, Space, Checkbox, Select, Card } from 'antd';
import Icon from '../customIcons/customIcons';
const { Title, Paragraph } = Typography;
const { Option } = Select;
class Step1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      retailSelected: false,
      classifiedSelected: false,
      category: '',
      subCategory: []
    };
  }

  componentDidMount() {
    const { reqData } = this.props;
    this.setState({ classifiedSelected: reqData.isClassified, retailSelected: reqData.isRetail })
  }

  /**
  * @method onSubmit
  * @description onsubmit
  */
  onSubmit = () => {
    const { loggedInDetail } = this.props
    const { classifiedSelected, retailSelected } = this.state;
    if (classifiedSelected) {
      let reqData = {
        isClassified: true,
        isRetail: false 
      }
      reqData.isClassified = true
      this.props.nextStep(langs.key.classified, reqData)
    } else if (retailSelected &&  loggedInDetail.user_type !== 'private') {
      let reqData = {
        isClassified: false,
        isRetail: true
      }
      reqData.isRetail = true
      this.props.nextStep(langs.key.retail,reqData)
      // return true
    }else if(retailSelected){
      toastr.warning('Please create your business account for posting an ad in retail category.')
    } else {
      toastr.warning('Please select category.')
    }
  }

  /**
  * @method render
  * @description render component
  */
  render() {  
    const { classifiedSelected, retailSelected } = this.state
    return (
      <Fragment>
        <div className='wrap'>
          <div className='align-center mt-40 pb-50' style={{ position: 'relative' }}>
            <Title level={2} className='text-blue'>Post an Ad</Title>
            <Paragraph className='text-gray'>Select main category</Paragraph>
          </div>
          <Space direction='horizontal' align='center' size={84} style={{ width: '100%', justifyContent: 'center', marginBottom: 60 }}>
            <div onClick={() => this.setState({ classifiedSelected: !classifiedSelected, retailSelected: false })} className={`radius-10 align-center category-box-new category-classifieds ${classifiedSelected && 'selected'}`}>
              <Icon icon='classifieds' size='40' />
              <Paragraph className='title fs-16'>Classifieds</Paragraph>
            </div>
            <div onClick={() => this.setState({ retailSelected: !retailSelected, classifiedSelected: false })} className={`radius-10 align-center category-box-new category-retail ${retailSelected && 'selected'}`}>
              <Icon icon='cart' size='40' />
              <Paragraph className='title fs-16'>Retail</Paragraph>
            </div>
          </Space>
          
          <div className='steps-action flex align-center mb-45'>
            <Button htmlType='submit' type='primary' size='middle' className='btn-blue' onClick={() => this.onSubmit()}>
              NEXT
          </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser
  };
};

export default connect(
  mapStateToProps, null
)(Step1);