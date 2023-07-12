import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom'
import { langs } from '../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { InputNumber, Empty, Modal, Avatar, message, Upload, Select, Input, Space, Form, Switch, Layout, Card, Typography, Button, Tabs, Row, Col } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import NoContentFound from '../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { MESSAGES } from '../../../../config/Message'
import { activateRestaurantMenuCategory, updateRestaurantMenuCategory, AddMenuCategory, activateAndDeactivateRestaurant, enableLoading, disableLoading, getRestaurantDetail, getMenuItemsDetailById, deleteRestaurantMenu, updateRestaurantMenu } from '../../../../actions'
import { required, validNumber, validNumberCheck } from '../../../../config/FormValidation'
import { PlusOutlined,MinusCircleOutlined } from '@ant-design/icons';
import ListExample from '../../../booking/common/List'
import CreateMenu from './CreateMenu'
import Icon from '../../../customIcons/customIcons';
import '../../vendor-profiles/myprofilerestaurant.less'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select

class RestaurantMenu extends React.Component {
  formRef = React.createRef();
  myformRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      restaurantDetail: [],
      fileList: [],
      itemId: '',
      selectedItem: [],
      Id: '', visible: false, menuId: '',
      selectedTab: '',
      flag: false,
      textInputs: [{
        choice_of_preparation: '',
        price:''
      }]
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading()
    this.getServiceDetail()
  }

  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props
    this.props.getRestaurantDetail(loggedInUser.id,'', res => {
      // this.props.getRestaurantDetail('903', res => {
      this.props.disableLoading()
      if (res.status === 200) {
        let data = res.data && res.data.data
        const item = data && data.menu
        this.setState({ menuId: item.id })
        
        this.setState({ restaurantDetail: data })
      }
    })
  }

  /**
   * @method onFinish
   * @description handle on submit
   */
  onFinish = (values) => {
    this.props.enableLoading()
    const { itemId, fileList } = this.state
    
    let requestData = {
      menu_item_id: itemId,
      name: values.name,
      price: values.price,
      details: values.details,
      choice_of_preparation: [{
        name: values.preparation_name,
        price: values.preparation_price
      }],
      image: fileList.length && fileList[0].originFileObj ? fileList[0].originFileObj : fileList.length ? fileList : []
    }
    const formData = new FormData()
    Object.keys(requestData).forEach((key) => {
      if (key === 'image') {
        formData.append(`image`, requestData[key])
      } else if (typeof requestData == 'object' && key !== 'image' && key !== 'price') {
        formData.append(key, `${JSON.stringify(requestData[key])}`)
      }else if (key == 'price') {
        formData.append(key,requestData[key].replace(/"/g,""))
        
      } else {
        formData.append(key, requestData[key])
      }
    })
    
    this.props.updateRestaurantMenu(formData, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_UPDATE_SUCCESS)
        this.getServiceDetail()
        this.resetField()
        this.setState({ fileList: [] })
      }
    })
  }

  /**
  * @method dummyRequest
  * @description dummy image upload request
  */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
   * @method handleImageChange
   * @description handle image change
   */
  handleImageChange = ({ file, fileList }) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      this.setState({ fileList });
    }
  }

  choiceOfPreperation = () => {
    const { textInputs } = this.state
    return textInputs.map((el, i) => 
      <Row gutter={10}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <Form.Item
            label='Choice of preparation'
            name={`${'preparation_name'}`}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Form.Item
            label='Price AUD'
            name={`${'preparation_price'}`}
            rules={[{ validator: validNumberCheck }]}
          >
            <InputNumber
              className="price-number"
              placeholder="Price"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Col>
        {i !==0 &&<Col xs={24} sm={24} md={24} lg={4} xl={4}>
          <MinusCircleOutlined
            className="edit-menu-remove"
            onClick={() => {
              this.removeClick(i)
            }}
          />
        </Col>}
      </Row>         
    )
 }

  removeClick(i){
    let textInputs = [...this.state.textInputs];
    textInputs.splice(i,1);
    this.setState({ textInputs });
  }

  appendInput() {
    let newInput = {
      choice_of_preparation: '',
      price:''
    }
    this.setState(prevState => ({ textInputs: prevState.textInputs.concat([newInput]) }));
  }

  /**
   * @method updateService
   * @description update services
   */
  updateService = (menu_items) => {
    const { fileList } = this.state
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img src={require('../../../../assets/images/icons/upload-small.svg')} alt='upload' />
      </div>
    );
    return (
      <div className="restaurant-content-block">
        <Form
          onFinish={this.onFinish}
          layout={'vertical'}
          ref={this.formRef}
        // id={menu_items.id}
        >
          <Row gutter={30}>
            <Col xs={24} sm={24} md={24} lg={3} xl={4}>
              <Form.Item
                name='image'
              >
                <Upload
                  name='avatar'
                  listType='picture-card'
                  className='avatar-uploader'
                  showUploadList={true}
                  fileList={fileList}
                  customRequest={this.dummyRequest}
                  onChange={this.handleImageChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={21} xl={20}>
              <div className="edit-menu-form-right-pad">
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Form.Item
                      label='Menu Name'
                      name={`${'name'}`}
                      rules={[required('')]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Form.Item
                      label='Price AUD'
                      name={`${'price'}`}
                      rules={[{ validator: validNumber }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Form.Item
                      label='Details'
                      name={`${'details'}`}
                      rules={[required('')]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    {this.choiceOfPreperation()}
                  </Col>
                  <Col style={{marginTop:28, marginLeft:20}}>
                    <Form.Item className="mb-0 add-card-link-mb-0">
                      <div className='align-right add-card-link fr-addbtn-icon'>
                        <Icon icon='add-circle' size='20' className='add-circ-conle'
                          onClick={() => this.appendInput()}
                        />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                    <Form.Item className='mt-20 mb-30 restaurant-save-btn'>
                      <Button
                        className="add-btn-comn"
                        htmlType="submit"
                      >
                        {'Update'}
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <div className="reformer-grid-block">
            <table>
              {this.restaurantList(menu_items)}
              {/* <tr>
                <td colSpan="2">&nbsp;</td>
                <td colSpan="3">
                  <Select defaultValue="Active All" style={{ width: "220px", marginRight: "70px", float: "right" }}>
                    <Option value="Active All">Active All</Option>
                    <Option value="Active All">Active All</Option>
                    <Option value="Active All">Active All</Option>
                  </Select>
                </td>
              </tr> */}
            </table>
          </div>
          {/* <div className="align-center">
            <Form.Item className='align-center mt-20 mb-30 restaurant-save-btn'>
             
              <Button
                htmlType="submit"
                type={'default'}
                danger
                size='large'
                className='text-white'
                style={{ backgroundColor: '#EE4929' }}
              >
                Save
                </Button>
            </Form.Item>
          </div> */}
        </Form>

      </div>

    )
  }

  resetField = () => {
    this.setState({ flag: false, fileList: [], itemId: '', selectedTab: '' })
    this.formRef.current && this.formRef.current.resetFields()
    this.getServiceDetail()
    let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
    
  }

  

  /**
 * @method renderRestaurantDetail
 * @description render restaurant details
 */
  renderRestaurantDetail = (bookingDetail) => {
    const { isEditFlag, flag } = this.state
    const item = bookingDetail && bookingDetail.menu && bookingDetail.menu.menu_categories;
    if (item && item.length) {
      return (
        <Tabs onChange={(e) => this.resetField()} className="update-menu">
          {Array.isArray(item) && item.length && item.map((el, i) => {
            return (
              <TabPane tab={el.menu_category_name} key={i}>
                <Row gutter={[20, 0]} className="pt-15  pb-15 ">
                  <Col xs={24} sm={24} md={18} lg={18}>
                    <div style={{ width: "100%", marginLeft: "45px", display: "block" }}>
                      <Space
                        align={'center'}
                        className={'blue-link edit-blue-link'}
                        style={{ cursor: 'pointer' }}
                        size={9}
                        onClick={() => { this.setState({ visible: true, selectedTab: el }) }}
                      >Edit
                                <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='delete' />
                      </Space>

                      <div className="switch"><Switch checked={el.is_active === 1 ? true : false} onChange={(checked) => {
                        let requestData = {
                          menu_category_id: el.id ? el.id : '',
                          status: checked ? 1 : 0
                        }
                        this.props.activateRestaurantMenuCategory(requestData, res => {
                          if (res.status === 200) {
                            toastr.success(res.data && res.data.msg)
                            this.getServiceDetail()
                            this.setState({ flag: false })
                            // window.location.assign('/edit-menu')
                          }
                        })
                      }} /></div>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={6} lg={6}>
                    <Link to='/add-menu' style={{ width: "100%", marginLeft: "-17px", display: "block" }}>
                      <Row>
                        <Button
                          className="add-btn-comn"
                          htmlType='button'
                        >
                          Add New Item
                          </Button>
                      </Row>
                    </Link>
                  </Col>

                </Row>
                {el.menu_items.length ?
                  <div>
                    <Row >
                      {this.updateService(el.menu_items)}
                    </Row>
                  </div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
              </TabPane>
            )
          })}
        </Tabs>
      )
    } else {
      return <NoContentFound />
    }
  }

  /**
  * @method getItemDetail
  * @description get menu item details by id
  */
  getItemDetail = (item) => {
    this.setState({ itemId: item.id, selectedItem: item })
    this.props.getMenuItemsDetailById(item.id, res => {
      if (res.status === 200) {
        
        let data = res.data && res.data.data;
        let temp = data.menu_items_choice_of_preparations
        let temp2 = []
        temp.map(el => {
          temp2.push({choice_of_preparation: el.name, price: el.price})
        })
        this.setState({textInputs:temp2})
        console.log('textInputs',this.state.textInputs)
        let menu = temp && Array.isArray(temp) && temp.length ? temp[0] : ''
        let formData = {
          name: data.name,
          price: data.price,
          details: data.details,
          preparation_name: menu ? menu.name : '',
          preparation_price: menu ? menu.price : '',
        }
        this.formRef.current.setFieldsValue({
          ...formData
        });
        let currentField = this.formRef.current && this.formRef.current.getFieldsValue()
        
        this.setState({
          fileList: [{
            uid: `1`,
            status: 'done',
            type: 'image/jpeg',
            size: '1024',
            url: `${data.image}`
          }], currentField, flag: true
        })
      }
    })
  }

  /**
   * @method deleteItem
   * @description remove service
   */
  deleteItem = (id) => {
    
    this.props.deleteRestaurantMenu(id, res => {
      
      this.getServiceDetail()
      toastr.success(langs.success, MESSAGES.MENU_UPDATE_SUCCESS)
      if (res.status === STATUS_CODES.Ok) {
      }
    })
  }

  /**
  * @method restaurantList
  * @description restaurant list
  */
  restaurantList = (item) => {
    const { itemId } = this.state;
    let menu = []
    if (itemId) {
      menu = item && Array.isArray(item) && item.filter(el => el.id !== itemId)
    } else {
      menu = item
    }
    if (menu && menu.length !== 0) {
      return menu && Array.isArray(menu) && menu.map((el, i) => {
        return (
          <tr key={i}>
            <td><div className="thumb"> <img src={el.image} alt='delete' /></div></td>
            <td>
              <div className="title"><Text className='strong'>{el.name}</Text></div>
              <div className="subtitle">{el.details}</div>
            </td>
            {/* <td><div className="time">60 Mins</div></td> */}
            <td><div className="amount"><Text className='strong'>{`$${el.price}`}</Text></div></td>
            <td>
              <div className="switch "><Switch checked={el.is_active ? true : false} onChange={(checked) => {
                let requestData = {
                  menu_item_id: el.id ? el.id : '',
                  status: checked ? 1 : 0
                }
                this.props.activateAndDeactivateRestaurant(requestData, res => {
                  if (res.status === 200) {
                    toastr.success(res.data && res.data.data)
                    this.getServiceDetail()
                  }
                })
              }} /></div>
              <div className="edit-delete">
                <a href="javascript:void(0)" onClick={() => this.getItemDetail(el)}>
                  <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                </a>
                <a href="javascript:void(0)" onClick={(e) => {
                  toastr.confirm(
                    `${MESSAGES.CONFIRM_DELETE}`,
                    {
                      onOk: () => this.deleteItem(el.id),
                      onCancel: () => {  }
                    })
                }}>
                  <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' />
                </a>
              </div>
            </td>
          </tr>
        )
      })
    }
  }

  /**
   * @method updateCategory
   * @description update menu category
   */
  updateCategory = (value) => {
    
    const { selectedTab } = this.state
    let requestData = {
      menu_cat_id: selectedTab.id,
      menu_category_name: value.menu_category_name
    }
    this.props.updateRestaurantMenuCategory(requestData, res => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_UPDATE_SUCCESS)
        this.setState({ visible: false })
        this.getServiceDetail()
      }
    })
  }

  /**
 * @method getInitialValue
 * @description returns Initial Value to set on its Fields
 */
  getInitialValue = () => {
    const { selectedTab } = this.state
    let temp = {
      menu_category_name: selectedTab.menu_category_name
    }
    return temp;
  };

  /**
   * @method addCategory
   * @description add menu categoty
   */
  addCategory = (value) => {
    
    const { menuId } = this.state
    let requestData = {
      menu_id: menuId,
      menu_category_name: value.menu_category_name
    }
    this.props.AddMenuCategory(requestData, res => {
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_CATEGORY_ADD_SUCCESS)
        this.myformRef.current && this.myformRef.current.setFieldsValue({
          menu_category_name: null
        });
        this.getServiceDetail()
      }
    })
  }


  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, isEditFlag, restaurantDetail, selectedTab } = this.state;
    return (
      <Layout>
        <Layout className="create-membership-block">
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab' >
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Menu</Title>
                  </div>
                </div>
                <Card
                  bordered={false}
                  className='profile-content-box edit profile-content-edit-menu-box'
                  title={'Edit Menu'}
                >
                  
                  <Row gutter={[38, 38]} >
                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={16} xl={16} >
                    <div className="create-menu profile-beauty-service">
                       
                          <Form
                            onFinish={this.addCategory}
                            layout={'vertical'}
                            ref={this.myformRef}
                            className="select-category-block mb-30"
                          >
                          <Row gutter={[20, 0]}>
                            <Col xs={24} sm={24} md={24} lg={19} xl={19}>
                              <Form.Item
                                name='menu_category_name'
                                rules={[required('')]}
                              >
                                <Input placeholder='Enter categories name' />
                              </Form.Item>

                            </Col>
                            <Col xs={24} sm={24} md={24} lg={5} xl={5}>
                              <Form.Item >
                                <Button className="add-btn-md" type='primary' htmlType='submit' size='large'>
                                  Add
                              </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                 
                      </div>
                      <Card
                        className='restaurant-tab test'
                      >
                        {this.renderRestaurantDetail(restaurantDetail)}
                      </Card>
                    </Col>
                    {isEditFlag && <div className="restaurant-content-block">
                      {/* <Form
                        onFinish={this.onFinish}
                        layout={'vertical'}
                        //ref={this.formRef}
                      > */}
                      {/* <Row gutter={28}>
                          <Form.Item className='align-center mt-20'>
                            <Button className="btn-red" type='primary' htmlType='submit' form={this.state.itemId} >
                              Save
                          </Button>
                          </Form.Item>
                        </Row> */}
                      {/* </Form> */}
                    </div>}
                  </Row>
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
        {visible && <Modal
          title='Update Menu Category'
          visible={visible}
          layout='vertical'
          className={'custom-modal style1'}
          footer={false}
          onCancel={() => this.setState({ visible: false })}
        >
          <div>
            <Form onFinish={this.updateCategory} initialValues={this.getInitialValue()}>
              <Form.Item
                label='Menu Category Name'
                name='menu_category_name'
                rules={[required('')]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button htmlType='submit'>
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>}
      </Layout>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { activateRestaurantMenuCategory, updateRestaurantMenuCategory, AddMenuCategory, activateAndDeactivateRestaurant, enableLoading, disableLoading, getRestaurantDetail, getMenuItemsDetailById, deleteRestaurantMenu, updateRestaurantMenu }
)(RestaurantMenu)