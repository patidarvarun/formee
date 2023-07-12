import React, { useRef, useState, useEffect } from "react";
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom'
import { langs } from '../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {Empty,Modal, Avatar, message, Upload, Select, Input, Space, Form, Switch, Layout, Card, Typography, Button, Tabs, Row, Col } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import NoContentFound from '../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { MESSAGES } from '../../../../config/Message'
import {activateRestaurantMenuCategory,updateRestaurantMenuCategory,AddMenuCategory, activateAndDeactivateRestaurant, enableLoading, disableLoading, getRestaurantDetail, getMenuItemsDetailById, deleteRestaurantMenu, updateRestaurantMenu } from '../../../../actions'
import { required, validNumber } from '../../../../config/FormValidation'
import { PlusOutlined } from '@ant-design/icons';
import ListExample from '../../../booking/common/List'
import CreateMenu from './CreateMenu'
import '../../vendor-profiles/myprofilerestaurant.less'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select

const UpdateRestaurant = (props) => {
  const [form] = Form.useForm();
  const formRef = useRef(null);
  const [restaurantDetail, setRestaurantDetail] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [Id, setId] = useState('');
  const [visible, setVisible] = useState(false);
  const [menuId, setMenuId] = useState('');
  const [selectedTab, setSelectedTab] = useState('');
  const [flag, setFlag] = useState(false);
  const [itemId, setItemId] = useState('')
  const [currentField, setCurrentField] = useState([])
  const [selectedItem, setSelectedItem] = useState([])
  

  useEffect(() => {
    // props.enableLoading()
    getServiceDetail()
  }, [props]);

  /**
   * @method getServiceDetail
   * @description get service details
   */
  const getServiceDetail = () => {
    const { loggedInUser } = props
    props.getRestaurantDetail(loggedInUser.id,'', res => {
      props.disableLoading()
      if (res.status === 200) {
        let data = res.data && res.data.data
        const item = data && data.menu
        setMenuId(item.id)
        setRestaurantDetail(data)
        let initialData = item && Array.isArray(item.menu_categories) && item.menu_categories.length ? item.menu_categories[0] : ''
        let menuItem = initialData && initialData.menu_items
        
        setInitialValue(menuItem)
      }
    })
  }

  const setInitialValue = (menuItem) => {
      if(menuItem && Array.isArray(menuItem) && menuItem.length){
        updateService(menuItem[0])
        getItemDetail(menuItem[0])
      }
    }

    const resetField = (item) => {
      // formRef.current && formRef.current.resetFields()
      setInitialValue(item)
      // getServiceDetail()
      // let currentField = formRef.current && formRef.current.getFieldsValue()
      // setFlag(false)
      // setFileList([])
      // setItemId('')
      // setSelectedTab('')
      // 
    }

   /**
    * @method getItemDetail
    * @description get menu item details by id
    */
   const getItemDetail = (item) => {
     
     let temp = item.menu_items_choice_of_preparations
      let menu = temp && Array.isArray(temp) && temp.length ? temp[0] : ''
     formRef.current && formRef.current.setFieldsValue({
      name: item.name,
      price: item.price,
      details: item.details,
      preparation_name: menu ? menu.name : '',
      preparation_price: menu ? menu.price : '',
    });
    setFileList([{uid: `1`,status: 'done',type: 'image/jpeg',size: '1024',url: `${item.image}`}])
    setCurrentField(currentField)
    setFlag(true)
    setItemId(item.id)
    setSelectedItem(item)
    // props.getMenuItemsDetailById(item.id, res => {
    //   if (res.status === 200) {
    //     
    //     let data = res.data && res.data.data;
    //     let temp = data.menu_items_choice_of_preparations
    //     let menu = temp && Array.isArray(temp) && temp.length ? temp[0] : ''
    //     formRef.current && formRef.current.setFieldsValue({
    //       name: data.name,
    //       price: data.price,
    //       details: data.details,
    //       preparation_name: menu ? menu.name : '',
    //       preparation_price: menu ? menu.price : '',
    //     });
    //     let currentField = formRef.current && formRef.current.getFieldsValue()
    //     
    //     setFileList([{uid: `1`,status: 'done',type: 'image/jpeg',size: '1024',url: `${data.image}`}])
    //     setCurrentField(currentField)
    //     setFlag(true)
    //     setItemId(item.id)
    //     setSelectedItem(item)
    //   }
    // })
  }


  /**
   * @method onFinish
   * @description handle on submit
   */
  const onFinish = (values) => {
    props.enableLoading()
    
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
      } else if (typeof requestData == 'object' && key !== 'image') {
        formData.append(key, `${JSON.stringify(requestData[key])}`)
      } else {
        formData.append(key, requestData[key])
      }
    })
    
    props.updateRestaurantMenu(formData, res => {
      props.disableLoading()
      if (res.status === 200) {
        toastr.success(langs.success, MESSAGES.MENU_UPDATE_SUCCESS)
        getServiceDetail()
        // resetField()
        setFileList([])
      }
    })
  }

   /**
  * @method dummyRequest
  * @description dummy image upload request
    */
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

    /**
   * @method handleImageChange
   * @description handle image change
   */
  const handleImageChange = ({ file, fileList }) => {
    
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    } else {
      setFileList(fileList)
    }
  }

   /**
   * @method updateService
   * @description update services
   */
  const updateService = (menu_items) => {
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
        onFinish={onFinish}
        layout={'vertical'}
        ref={formRef}
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
                customRequest={dummyRequest}
                onChange={handleImageChange}
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
              <Row gutter={10}>
                <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                  <Form.Item
                    label='Choice of preparation'
                    name={`${'preparation_name'}`}
                    rules={[required('')]}
                  >
                    <Input />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <Form.Item
                    label='Price AUD'
                    name={`${'preparation_price'}`}
                    rules={[{ validator: validNumber }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

        </Row>
        <div className="reformer-grid-block">
          <table>
            {restaurantList(menu_items)}
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
        <div className="align-center">
          <Form.Item className='align-center mt-20 mb-30 restaurant-save-btn'>
            {/* <Button className="btn-blue" type='primary' htmlType='submit'>
              Save
          </Button> */}
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
        </div>
      </Form>

    </div>
    )
  }

 


  /**
 * @method renderRestaurantDetail
 * @description render restaurant details
 */
const renderRestaurantDetail = (bookingDetail) => {
  const item = bookingDetail && bookingDetail.menu && bookingDetail.menu.menu_categories;
  if (item && item.length) {
    return (
      <Tabs 
      // onChange={(e) => resetField()}
        onTabClick={(e) => {
          let temp = item.filter((c) => {
            if (c.id == e) {
              return c
            }
          })
          
          if(temp && Array.isArray(temp) && temp.length){
              resetField(temp[0].menu_items)
          }
          // setSelectedTab(temp.el.menu_items)
        }}
      
      >
        {Array.isArray(item) && item.length && item.map((el, i) => {
          return (
            <TabPane tab={el.menu_category_name} key={el.id}>
                <Row gutter={[20, 0]} className="pt-43">
                    <Link to='/add-menu'>
                      <Row>
                        <Button
                          type='primary'
                          className="add-btn"
                          htmlType='button'
                        >
                          Add New Item
                        </Button>
                      </Row>
                    </Link>
                      <Col>
                          <Space
                              align={'center'}
                              className={'blue-link'}
                              style={{ cursor: 'pointer' }}
                              size={9}
                              onClick={() => {
                                setVisible(true)
                                setSelectedTab(el)
                              }}
                              >Edit
                              <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='delete' />
                          </Space>
                      </Col>
                      <Col>
                          <div className="switch"><Switch checked={el.is_active === 1 ? true : false} onChange={(checked) => {
                              let requestData = {
                                  menu_category_id: el.id ? el.id : '',
                                  status: checked ? 1 : 0
                              }
                              props.activateRestaurantMenuCategory(requestData, res => {
                                if (res.status === 200) {
                                  toastr.success(res.data && res.data.msg)
                                  getServiceDetail()
                                }
                              })
                          }} /></div>
                      </Col>
                      
                  </Row>
              {el.menu_items.length ?
                <div>
                  <Row >
                    {updateService(el.menu_items)}
                  </Row>
                </div>: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
   * @method deleteItem
   * @description remove service
   */
  const deleteItem = (id) => {
    
    props.deleteRestaurantMenu(id, res => {
      
      getServiceDetail()
      if (res.status === STATUS_CODES.Ok) {
        toastr.success(langs.success, 'Menu item deleted successfully')
      }
    })
  }

  /**
  * @method restaurantList
  * @description restaurant list
  */
  const restaurantList = (item) => {
    let menu = []
    if (itemId) {
      menu = item && Array.isArray(item) && item.filter(el => el.id !== itemId)
    } else {
      menu = item
    }
    if (menu && menu.length !==0) {
      return menu && Array.isArray(menu) && menu.map((el, i) => {
        return (
          <tr key={i}>
            <td><div className="thumb"> <img src={el.image} alt='delete' /></div></td>
            <td>
              <div className="title"><Text className='strong'>{el.name}</Text></div>
              <div className="subtitle">{el.details}</div>
            </td>
            <td><div className="time">60 Mins</div></td>
            <td><div className="amount"><Text className='strong'>{`$${el.price}`}</Text></div></td>
            <td>
              <div className="switch"><Switch checked={el.is_active ? true : false} onChange={(checked) => {
                let requestData = {
                  menu_item_id: el.id ? el.id : '',
                  status: checked ? 1 : 0
                }
                props.activateAndDeactivateRestaurant(requestData, res => {
                  if (res.status === 200) {
                    toastr.success(res.data && res.data.data)
                      getServiceDetail()
                  }
                })
              }} /></div>
              <div className="edit-delete">
                <a href="javascript:void(0)" onClick={() => getItemDetail(el)}>
                  <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                </a>
                <a href="javascript:void(0)" onClick={(e) => {
                  toastr.confirm(
                    `${MESSAGES.CONFIRM_DELETE}`,
                    {
                      onOk: () => deleteItem(el.id),
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
  const updateCategory = (value) => {
    
    let requestData = {
        menu_cat_id: selectedTab.id,
        menu_category_name: value.menu_category_name
    }
    props.updateRestaurantMenuCategory(requestData, res => {
        if (res.status === 200) {
            toastr.success(langs.success, MESSAGES.MENU_CATEGORY_UPDATE_SUCCESS)
            setVisible(false)
            getServiceDetail()
        }
    })
  }

   /**
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields
   */
  const getInitialValue = () => {
    let temp ={
        menu_category_name: selectedTab.menu_category_name
    }
    return temp;
  };

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
                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={16} xl={16}>
                      <Card
                        className='restaurant-tab test'
                      >
                        {renderRestaurantDetail(restaurantDetail)}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
        {visible && <Modal
          title='Update Menu Category'
          visible={visible}
          // className={'custom-modal style1'}
          footer={false}
          onCancel={() => setVisible(false)}
        >
          <div>
              <Form onFinish={updateCategory} initialValues={getInitialValue()}>
                  <Form.Item
                      label='Menu Category Name'
                      name='menu_category_name'
                      rules={[required('')]}
                  >
                      <Input/>
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
  )
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
  {activateRestaurantMenuCategory,updateRestaurantMenuCategory,AddMenuCategory, activateAndDeactivateRestaurant, enableLoading, disableLoading, getRestaurantDetail, getMenuItemsDetailById, deleteRestaurantMenu, updateRestaurantMenu }
)(UpdateRestaurant)

  

  
