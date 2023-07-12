import React from 'react';
import { connect } from 'react-redux';
import { langs } from '../../../../config/localization';
import { toastr } from 'react-redux-toastr'
import { Select, Layout, Typography, Tabs, Card, Space, Col, Menu, Dropdown, Button, Row } from 'antd';
import Icon from '../../../customIcons/customIcons';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import { DASHBOARD_KEYS } from '../../../../config/Constant'
import { enableLoading, disableLoading, getMyBestPackage, getPackagesFromAdmin, changePackageStatus } from '../../../../actions'
import { dateFormate } from '../../../common';
import NoContentFound from '../../../common/NoContentFound';

const { Title, Text } = Typography;
const defaultImage = require('../../../../assets/images/default_image.jpg')
class DealsListing extends React.Component {
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
    const { loggedInUser, userDetails } = this.props;
    if (loggedInUser.user_type === langs.key.restaurant) {
      let trader_user_profile_id = userDetails.user.business_profile.id
      this.getEligibleDeal()
      this.props.getMyBestPackage({ vendor_id: trader_user_profile_id })
    } else {
      let trader_user_profile_id = userDetails.user.trader_profile.id
      this.getEligibleDeal()
      this.props.getMyBestPackage({ vendor_id: trader_user_profile_id })
    }
  }

  /**
  * @method getEligibleDeal
  * @description get Eligible promo details
  */
  getEligibleDeal = () => {
    const { loggedInUser, userDetails } = this.props;
    let userType = loggedInUser.user_type;
    let reqData = {}
    if (userType !== langs.key.restaurant) {
      const { booking_cat_id, booking_sub_cat_id } = userDetails.user.trader_profile
      reqData.category_id = booking_cat_id
      reqData.sub_category_id = booking_sub_cat_id
    } else {
      const { booking_category_id } = userDetails.user.business_profile
      reqData.category_id = booking_category_id
    }
    this.props.getPackagesFromAdmin(reqData)
  }

  /**
   * @method change deal status
   * @description change deal status  
   */
  changeStatus = (state, id) => {
    const { loggedInUser, userDetails } = this.props;
    

    let reqdata = {
      vendor_beauty_package_id: id,
      vendor_status: state
    }
    this.props.enableLoading()
    this.props.changePackageStatus(reqdata, (res) => {
      this.props.disableLoading()
      
      if (res.status === 200) {
        let userType = loggedInUser.user_type;
        if (userType === langs.key.restaurant) {
          let trader_user_profile_id = userDetails.user.business_profile.id
          this.props.getMyBestPackage({ vendor_id: trader_user_profile_id })
        } else {
          let trader_user_profile_id = userDetails.user.trader_profile.id
          this.props.getMyBestPackage({ vendor_id: trader_user_profile_id })

        }

        // this.getApplicationList(activePage, activeFlag, category_id)
        toastr.success(langs.success, langs.messages.change_status)
      }
    })
  }


  /**
  * @method render deal status 
  * @description return deal status  
  */
  getStatus = (row) => {
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
   * @method renderPackages
   * @description render service tab
   */
  renderPackages = () => {
    const { myBestPackages } = this.props;
    
    return (Array.isArray(myBestPackages) && myBestPackages.length) ? myBestPackages.map((el, i) => {
      return (
        <tr key={i}>
          <td>
            <div className="title">
              {/* <Text className=''>{el.title}</Text> */}
              <img
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage
                }}
                style={{ height: 50, width: 50 }} src={el.banner_image ? el.banner_image : defaultImage} />
            </div>
          </td>
          <td><div className="amount"><Text className=''>{`$${el.actual_price}`}</Text></div></td>
          <td><div className="amount"><Text className=''>{`${el.discount_percent} %`}</Text></div></td>
          <td><div className="amount"><b><Text className=''>{`$${el.discounted_price}`}</Text></b></div></td>
          <td>{dateFormate(el.start_date)} - {dateFormate(el.end_date)}</td>
          <td>{this.getStatus(el)}</td>
        </tr>
      )
    }) : <tr>
        <td className="pt-10" colSpan="5"> <NoContentFound /></td>
      </tr>
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { packagesFromAdmin } = this.props;
    return (
      <Layout className="create-membership-block daily-deals-listing">
        <Layout>
          <AppSidebar activeTabKey={DASHBOARD_KEYS.BEST_PACKAGES} history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab view-class-tab-listing' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>

                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>Package</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section'>
                  <Text>&nbsp;</Text>
                </div>
                <Card
                  bordered={false}
                  className='profile-content-box create-new-deal'
                  title='Packages'
                  extra={
                    <Space
                      align={'center'}
                      className={'blue-link'}
                      style={{ cursor: 'pointer' }}
                      size={9}
                      onClick={() => {
                        if (Array.isArray(packagesFromAdmin) && packagesFromAdmin.length) {
                          this.props.history.push({
                            pathname: `/create-packages`
                          })
                        } else {
                          toastr.warning(langs.warning, 'Packages are not available for you.')
                        }
                      }}
                    >Create New Packages
                  <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='' />
                    </Space>

                  }
                >
                  <div className='profile-content-box box-profile'
                  >
                    <table>
                      <tr>
                        <th>Banner Image</th>
                        <th>Actual Price</th>
                        <th>Discount(%)</th>
                        <th>Discounted Price</th>
                        <th>Valid on</th>
                        <th>Status</th>
                      </tr>
                      {this.renderPackages()}
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
    // dealFromAdmin: Array.isArray(venderDetails.dealFromAdmin) ? venderDetails.dealFromAdmin : [],
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
    myBestPackages: Array.isArray(venderDetails.myBestPackages) ? venderDetails.myBestPackages : [],
    packagesFromAdmin: Array.isArray(venderDetails.packagesFromAdmin) ? venderDetails.packagesFromAdmin : [],

  };
};
export default connect(
  mapStateToProps,
  { enableLoading, disableLoading, getMyBestPackage, getPackagesFromAdmin, changePackageStatus }
)(DealsListing)