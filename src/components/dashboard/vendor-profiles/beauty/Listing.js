import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../../config/localization';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { InputNumber, Collapse, message, Upload, Select, Input, Space, Form, Switch, Divider, Layout, Card, Typography, Button, Tabs, Row, Col } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import NoContentFound from '../../../common/NoContentFound'
import { STATUS_CODES } from '../../../../config/StatusCode'
import { MESSAGES } from '../../../../config/Message'
import { enableLoading, disableLoading, activateAndDeactivateService, getBeautyServices, deleteServices } from '../../../../actions'
import { DEFAULT_IMAGE_CARD, TEMPLATE } from '../../../../config/Config';
import Icon from '../../../customIcons/customIcons';
import { convertHTMLToText } from '../../../common';
import { required, validNumber } from '../../../../config/FormValidation'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import '../../vendor-profiles/myprofilerestaurant.less'
import { BASE_URL } from '../../../../config/Config'
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Meta } = Card
const { Option } = Select
const rules = [required('')];
const { Panel } = Collapse;

class BeautyServices extends React.Component {
  formRef = React.createRef();
  editRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      subCategory: [],
      currentList: [],
      size: 'large',
      showSettings: [],
      activeFlag: langs.key.all,
      ads_view_count: '',
      total_ads: '',
      services: [],
      beautyService: '',
      isEditFlag: false,
      durationOption: [],
      item: '',
      itemInfo: '', serviceInfo: '',
      Id: '', subCategory: [], activePanel: 1, activePanel2: 1
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getServiceDetail()
  }


  /**
   * @method getServiceDetail
   * @description get service details
   */
  getServiceDetail = () => {
    const { loggedInUser } = this.props
    this.props.enableLoading()
    this.props.getBeautyServices(loggedInUser.trader_profile_id, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        let data = res.data && res.data.data
        let services = data.services && Array.isArray(data.services) && data.services.length ? data.services : []
        
        this.setState({ beautyService: data, services: services })
      }
    })
  }

 
  /**
 * @method renderUserServices
 * @description render service details
 */
  renderUserServices = (service, item) => {
    const { serviceInfo,selectedTab,services } = this.state
    if (item && item.length) {
      return item && Array.isArray(item) && item.map((el, i) => {
        return (
          <tr key={i}>
            <td colspan="2">
              <div className="thumb"> <img src={`${BASE_URL}/${el.service_image}`} alt='' /></div>
              <div className="photo-subtitle"><Text>{`${el.more_info ? el.more_info : ''}`}</Text></div>
            </td>
            <td colspan="2">
              <div className="title"><Text className='strong'>{el.name}</Text></div>
              <div className="subtitle">{`${el.duration} mins`}</div>
            </td>
            <td colspan="2"><div className="amount"><Text className='strong'>{`$${el.price}`}</Text></div></td>
            <td colspan="2">
              <div className="switch"><Switch checked={el.service_status === 1 ? true : false}
                onChange={(checked) => {
                  let requestData = {
                    service_id: el.id ? el.id : '',
                    status: checked ? 1 : 0
                  }
                  this.props.activateAndDeactivateService(requestData, res => {
                    if (res.status === 200) {
                      toastr.success(res.data && res.data.data)
                      this.getServiceDetail()
                    }
                  })
                }}
              /></div>
              <div className="edit-delete">
                <a href="javascript:void(0)" onClick={() => this.props.history.push(`/update-vendor-services/${service.id}/${el.id}`)}>

                  <img src={require('../../../../assets/images/icons/edit-gray.svg')} alt='edit' />
                </a>
                <a href="javascript:void(0)" onClick={(e) => {
                  toastr.confirm(
                    `${MESSAGES.CONFIRM_DELETE}`,
                    {
                      onOk: () => this.deleteItem(el.id),
                      onCancel: () => {  }
                    })
                }}
                >
                  <img src={require('../../../../assets/images/icons/delete.svg')} alt='delete' />
                </a>
              </div>
            </td>
          </tr>
        )
      });
    }
  }

  /**
   * @method deleteItem
   * @description remove service
   */
  deleteItem = (id) => {
    
    this.props.deleteServices(id, res => {
      if (res.status === STATUS_CODES.OK) {
        toastr.success(langs.success, MESSAGES.BEAUTY_SERVICE_DELETE)
        this.getServiceDetail()
      }
    })
  }

  /**
   * @method renderServiceTab
   * @description render service tab
   */
  renderServiceTab = () => {
    const { services, isEditScrren, isEditFlag, serviceInfo } = this.state;
    const { isCreateService } = this.props
    if (Array.isArray(services) && services.length) {
      return (
        <Tabs
          onTabClick={(e) => {
            let temp = services.filter((el) => {
              if (el.id == e) {
                return el
              }
            })
            this.setState({ selectedTab: temp })
            
          }} 
        >
          {services.map((el, i) => {
            return (
              <TabPane tab={el.name} key={el.id}>
                <Row>
                  <div className="restaurant-content-block restaurant-content-block-service">
                    <div className="reformer-grid-block">
                      <table>
                        {this.renderUserServices(el, el.trader_user_profile_services)}
                      </table>
                    </div>
                  </div>
                </Row>
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
   * @method render
   * @description render component
   */
  render() {
    const {selectedTab, isEditScrren, isEditFlag, services } = this.state;
    const { isCreateService } = this.props
    let tabId = services && services.length && services[0].id
    let data = services && services.length && services[0].trader_user_profile_services
    let id = data && Array.isArray(data) && data.length ? data[0].id : ''
    return (
      <Layout className="create-membership-block profile-beauty-service profile-beauty-service-custom">
       <Layout>
          <AppSidebar history={history} />
          <Layout>
            <div className='my-profile-box' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab' >
                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Manage Services</Title>
                  </div>
                </div>
                <Card
                  bordered={false}
                  className='profile-content-box edit'
                  title={'Your Service'}
                  extra={
                   services.length !== 0 && <Space
                      align={'center'}
                      className={'blue-link'}
                      style={{ cursor: 'pointer' }}
                      size={9}
                      onClick={() => this.props.history.push(`/update-vendor-services/${tabId}/${id}`)}
                    >Edit
                    <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='delete' />
                    </Space>
                  }
                >
                  <Row gutter={[38, 38]} >
                    <Col className='gutter-row' xs={24} sm={24} md={24} lg={16} xl={16}>
                      <Card
                        className='restaurant-tab test'
                      >
                        {this.renderServiceTab()}
                      </Card>
                    </Col>
                  </Row>
                </Card>
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}


const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {}
  };
};
export default connect(
  mapStateToProps,
  { activateAndDeactivateService, getBeautyServices, deleteServices, enableLoading, disableLoading }
)(BeautyServices)