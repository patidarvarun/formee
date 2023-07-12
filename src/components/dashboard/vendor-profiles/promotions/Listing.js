import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import { langs } from '../../../../config/localization'
import { Space, Layout, Card, Typography, Row, Col, Menu, Dropdown, Button } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import { enableLoading, disableLoading, getMyPromotions, getEligiblePromotion, changePromoStatus } from '../../../../actions'
import { dateFormate } from '../../../common';
import NoContentFound from '../../../common/NoContentFound';
import { DASHBOARD_KEYS } from '../../../../config/Constant'

const { Title, Text } = Typography;
class PromotionListing extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
    this.props.getMyPromotions({ vendor_id: trader_user_profile_id })
    this.getEligiblePromo()
  }

  /**
   * @method getEligiblePromo
   * @description get Eligible promo details
   */
  getEligiblePromo = () => {
    const { loggedInUser } = this.props;
    let userType = loggedInUser.user_type;
    let reqData = {}
    if (userType !== langs.key.restaurant) {
      const { booking_cat_id, booking_sub_cat_id } = this.props.userDetails.user.trader_profile
      reqData.category_id = booking_cat_id
      reqData.sub_category_id = booking_sub_cat_id

    } else {
      const { booking_category_id } = this.props.userDetails.user.business_profile
      
      reqData.category_id = booking_category_id

    }
    this.props.getEligiblePromotion(reqData)
  }

  /**
  * @method change deal vendor_status
  * @description change deal vendor_status  
  */
  changeStatus = (state, id) => {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
    let reqdata = {
      vendor_promotion_id: id,
      vendor_status: state
    }
    this.props.enableLoading()
    // active-deactive-vendor-promotions
    this.props.changePromoStatus(reqdata, (res) => {
      
      if (res.status === 200) {
        this.props.disableLoading()
        this.props.getMyPromotions({ vendor_id: trader_user_profile_id })
        // this.getApplicationList(activePage, activeFlag, category_id)
        toastr.success(langs.success, langs.messages.change_vendor_status)
      }
    })
  }

  /**
    * @method render deal vendor_status 
    * @description return deal vendor_status  
    */
  getvendor_status = (row) => {
    // let showIcons = showSettings.includes(cell)
    let size = 'large'
    const menu = (
      <Menu onClick={(e) => {
        this.changeStatus(e.key, row.id)
      }}>
        { row.vendor_status !== 1 && <Menu.Item key={1}>Active</Menu.Item>}
        { row.vendor_status !== 0 && <Menu.Item key={0}>Inactive</Menu.Item>}
      </Menu>
    );

    if (row.vendor_status === '') {
      return ''
    }
    return (
      <div className="right-action">
        <Row>
          <Col span={22}>
            <Dropdown overlay={menu} placement='bottomLeft' arrow>
              {row.vendor_status === 1 ? <Button type='primary' size={size}>
                Active
                          </Button>
                : row.vendor_status === 2 ? <Button type='primary' size={size}>
                  Pending
                          </Button> : <Button type='primary' danger size={size}>
                    Inactive
                </Button>
              }
            </Dropdown>

          </Col>
        </Row>
      </div>
    )
  }

  /**
   * @method renderPromotions
   * @description render service tab
   */
  renderPromotions = () => {
    const { myPromos, loggedInUser } = this.props;
    
    return (Array.isArray(myPromos) && myPromos.length) ? myPromos.map((el, i) => {
      
      return (
        <tr key={i}>
          <td>
            <div className="title"><Text>{loggedInUser.user_type === langs.userType.fitness ? el.service.class_name : el.service.name}</Text></div>
          </td>
          <td><div className="amount"><Text>{`$${el.actual_price}`}</Text></div></td>
          <td><div className="amount"><Text>{`${el.discount_percent} %`}</Text></div></td>

          <td>
            <div className="edit-link">
              <div className="amount">
                <b><Text>{`$${el.discounted_price}`}</Text></b></div>
            </div>

          </td>
          <td>{dateFormate(el.start_date)} - {dateFormate(el.end_date)}</td>
          <td>{this.getvendor_status(el)}</td>
        </tr>
      )
    }) : <tr>
        <td className="pt-10" colSpan="5"><NoContentFound /></td></tr>
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { promoFromAdmin } = this.props;
    return (
      <Layout className="create-membership-block daily-deals-listing">
        <Layout>
          <AppSidebar activeTabKey={DASHBOARD_KEYS.PROMOTIONS} history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab view-class-tab-listing' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>
                <div className='top-head-section manager-page '>
                  <div className='left'>
                    <Title level={2}>My Promotions</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section'>
                  <Text>&nbsp;</Text>
                </div>
                <Card
                  bordered={false}
                  className='profile-content-box create-new-deal'
                  title='Promotions Listing'
                  extra={
                    <Space
                      align={'center'}
                      className={'blue-link'}
                      style={{ cursor: 'pointer' }}
                      size={9}
                      onClick={() => {
                        if (Array.isArray(promoFromAdmin) && promoFromAdmin.length) {
                          this.props.history.push({
                            pathname: `/create-promotions`,
                            state: {
                              tabIndex: "1"
                            }
                          })
                        } else {
                          toastr.warning(langs.error, 'Promotions are not available for you')
                        }
                      }}
                    >Create New Promotion
                  <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='' />
                    </Space>

                  }
                >
                  <div className='profile-content-box box-profile'
                  >
                    <table>
                      <tr>
                        <th>Service Name</th>
                        <th>Actual Price</th>
                        <th>Discount (%)</th>
                        <th>Discounted Price</th>
                        <th>Valid on</th>
                        <th>Status</th>
                      </tr>
                      {this.renderPromotions()}
                    </table>
                  </div>
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
  const { profile, venderDetails } = store;
  
  return {
    promoFromAdmin: Array.isArray(venderDetails.promoFromAdmin) ? venderDetails.promoFromAdmin : [],
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    myPromos: Array.isArray(venderDetails.myPromos) ? venderDetails.myPromos : [],
  };
};
export default connect(
  mapStateToProps,
  { enableLoading, disableLoading, getMyPromotions, getEligiblePromotion, changePromoStatus }
)(PromotionListing)