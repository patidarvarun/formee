import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout, Row, Col, Typography, Tabs, Form, Input, Select, Button, Divider, Checkbox, Table, InputNumber, Card, Radio } from 'antd';
import { enableLoading, disableLoading, getUserAddress } from '../../../../actions/index';
import { toastr } from 'react-redux-toastr';
import { required, whiteSpace, validatePhoneNumber, validMobile } from '../../../../config/FormValidation';
import AddUserAddress from './AddUserAddress';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

class CheckoutStep1 extends React.Component {
  formRef = React.createRef();
  addressFormRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      userAddressesList: [],
      selectedAddress: []
    }
  }

  componentDidMount() {
    this.getUserAddedAddress();
  }

  getUserAddedAddress = () => {
    this.props.getUserAddress((response) => {
      //
      if (response.status === 200) {
        this.setState({ userAddressesList: response.data.data });
      }
    });
  }

  onFinish = (values) => {
    if (this.onFinishFailed() !== undefined) {
      return true
    } else {
      if (values !== undefined) {
        const reqData = {
          name: values.contact_name,
          phone_number: values.phone_number,
          additional_note: values.additional_note,
          address_id: values.address_id,
          userAddressesList: this.state.userAddressesList
        }
        this.props.nextStep(reqData, 2)
      }
    }
  }

  /**
   * @method onFinishFailed
   * @description handle form submission failed 
   */
  onFinishFailed = errorInfo => {
    return errorInfo
  };

  getAddAddressCallbackResponse = (res) => {
    // 
    if (res.status === 200) {
      this.getUserAddedAddress();
    }
  }

  renderUserAddressChoice = () => {
    const { userAddressesList } = this.state;
    /**
     * <Checkbox key={`${i}_menu_item`} checked={isSelected} onChange={(e) => {
        let temp = this.state.selectedAddress;
        temp.length = 0;
        if (!isSelected) {
          temp.push(el.id);
          this.setState({ selectedAddress: temp });
        } else {
          temp = temp.filter((k) => k !== el.id);
          this.setState({ selectedAddress: temp });
        }
      }}> <Text>{el.address_1} {el.address_2}</Text></Checkbox>
     */
    return Array.isArray(userAddressesList) && userAddressesList.map((el, i) => {
      //let isSelected = this.state.selectedAddress.includes(el.id);
      return <div className="left-block">
        <Radio value={el.id}><b>Select Address</b></Radio>
        <div className="text-detail">
          <h5>{el.fname} {el.lname}</h5>
          <p>{el.address_1}</p>
          <p>{el.address_2} {el.city} {el.state} {el.country}</p>
          {/* <p><a href="mailto:martha@gmail.com">martha@gmail.com</a></p>
        <p>Tel: <a href="tell:0433 223 2782">0433 223 2782</a></p> */}
          {/* <div className="met-adds-block">
          <div className="icon"><img src={require('../../../../assets/images/icons/user-white.svg')} alt='user' width="18" /></div>
          <div>Meet at door</div>
        </div> */}

        </div>
        <div className="edit-delete-icon">
          <div className="edit">
            <img src={require('../../../../assets/images/icons/edit-dark-grey.svg')} alt='edit' />
          </div>
          <div className="edit">
            <img src={require('../../../../assets/images/icons/delete-dark-grey.svg')} alt='delete' />
          </div>
        </div>
      </div>
      //return <Row> <Radio value={el.id}><Text>{el.address_1} {el.address_2}</Text></Radio></Row>
    });
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { loggedInDetail } = this.props;
    const { name, mobile_no, phonecode } = loggedInDetail;
    let mobileNumber = mobile_no !== '' ? `${phonecode} ${mobile_no}` : '';
    // 
    return (
      <Fragment >
        <Row gutter={[38, 38]} className="bookings-restaurant-detail-checkoutstepone" >
          <Col span={24}>
            <Form
              name='user-bookinginfo'
              initialValues={{ contact_name: name, phone_number: mobileNumber, additional_note: '' }}
              layout='horizontal'
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              scrollToFirstError
              id='user-bookinginfo'
              className="checkout-step-one"
              ref={this.formRef}
            >
              <h4 className='fm-input-heading'>Your Information</h4>
              <Form.Item label='Contact Name' name='contact_name' rules={[required('Contact Name'), whiteSpace('Contact Name')]}>
                <Input placeholder={'Enter your first name and last name'} className='shadow-input' />
              </Form.Item>

              <Form.Item label='Phone Number' name='phone_number' rules={[required()]} >
                <Input placeholder={'Enter your phone number'} className='shadow-input' rules={[required('Phone Number'), whiteSpace('Phone Number')]} />
              </Form.Item>
              <Form.Item label='Additional Noted' name='additional_note' className="ant-form-item-label-vtop">
                <TextArea maxLength={100} rows={4} placeholder={'Type here'} className='shadow-input' />
              </Form.Item>
              <Form.Item
                name="address_id"
                label="Select Address"
                className="ant-form-item-label-vtop mb-0"
                rules={[
                  {
                    required: true,
                    message: 'Please select a address',
                  },
                ]}
              >
                {/* <Card className="multicheckbox-option"> */}
                <div className="other-address-block">
                  <div className="other-address-detail">
                    <Radio.Group>
                      {this.renderUserAddressChoice()}
                    </Radio.Group>
                  </div>
                </div>
                {/* </Card> */}
              </Form.Item>

              {/* <Form.Item label='Select Address' name='additional_note'>  
                                    <Row gutter={[38, 38]}>
                                        <Col span={24}>
                                                <Card>
                                                    {this.renderUserAddressChoice()}
                                                </Card>
                                            </Col>
                                        </Row>
                                </Form.Item> */}
              <Form.Item>
                <div className='steps-action' style={{ marginTop: "23px" }}>
                  <Button htmlType="submit" type='primary' size='middle' className='btn-yellow fm-btn' >Next</Button>
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <div className="other-address-block" style={{ display: "none" }}>
          <h4 className='fm-input-heading'>Other Addresses</h4>
          <div className="other-address-detail">
            <div className="left-block">
              <Radio><b>Select Address</b></Radio>
              <div className="text-detail">
                <h5>Martha stewart</h5>
                <p>41 Stewart Street, Richmond</p>
                <p>Victoria 3121 AUSTRALIA</p>
                <p><a href="mailto:martha@gmail.com">martha@gmail.com</a></p>
                <p>Tel: <a href="tell:0433 223 2782">0433 223 2782</a></p>
                <div className="met-adds-block">
                  <div className="icon"><img src={require('../../../../assets/images/icons/user-white.svg')} alt='user' width="18" /></div>
                  <div>Meet at door</div>
                </div>

              </div>
              <div className="edit-delete-icon">
                <div className="edit">
                  <img src={require('../../../../assets/images/icons/edit-dark-grey.svg')} alt='edit' />
                </div>
                <div className="edit">
                  <img src={require('../../../../assets/images/icons/delete-dark-grey.svg')} alt='delete' />
                </div>
              </div>
            </div>
            <div className="right-block left-block">
              <Radio><b>Select Address</b></Radio>
              <div className="text-detail">
                <h5>Martha stewart</h5>
                <p>41 Stewart Street, Richmond</p>
                <p>Victoria 3121 AUSTRALIA</p>
                <p><a href="mailto:martha@gmail.com">martha@gmail.com</a></p>
                <p>Tel: <a href="tell:0433 223 2782">0433 223 2782</a></p>
                <div className="met-adds-block">
                  <div className="icon"><img src={require('../../../../assets/images/icons/user-white.svg')} alt='user' width="18" /></div>
                  <div>Meet at door</div>
                </div>

              </div>
              <div className="edit-delete-icon">
                <div className="edit">
                  <img src={require('../../../../assets/images/icons/edit-dark-grey.svg')} alt='edit' />
                </div>
                <div className="edit">
                  <img src={require('../../../../assets/images/icons/delete-dark-grey.svg')} alt='delete' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="add-address-block">
          <Row gutter={[0]}>
            <Col span={24}>
              <h4 className='fm-input-heading'>Add New Address</h4>
              <AddUserAddress callBackResponse={(res) => this.getAddAddressCallbackResponse(res)} />
            </Col>
          </Row>
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, { enableLoading, disableLoading, getUserAddress })(CheckoutStep1);