import React from 'react';
import { connect } from 'react-redux';
import { langs } from '../../../../../config/localization';
import { toastr } from 'react-redux-toastr'
import { Layout, Typography, Tabs, Card, Space, Col, Menu, Dropdown, Button, Row } from 'antd';
import AppSidebar from '../../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../../common/History';
import { getMyRetailDeals,  changeDealStatus } from '../../../../../actions'
import { dateFormate } from '../../../../common';
import NoContentFound from '../../../../common/NoContentFound'
import { DASHBOARD_KEYS } from '../../../../../config/Constant'

const { Title, Text } = Typography;

class RetailDealsListing extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      myDeals: []
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
    // this.getEligibleDeal()
    this.props.getMyRetailDeals({ vendor_id: trader_user_profile_id }, (res) => {
      
      if (res.status === 200) {
        this.setState({ myDeals: res.data.data.data })
      }
    })
  }

  /**
  * @method change deal status
  * @description change deal status  
  */
  changeStatus = (state, id) => {
    const { activeFlag, activePage, category_id } = this.state
    let reqdata = {
      vendor_deal_id: id,
      vendor_status: state
    }

    this.props.changeDealStatus(reqdata, (res) => {
      
      if (res.status === 200) {
        let trader_user_profile_id = this.props.userDetails.user.trader_profile.id
        this.props.getMyRetailDeals({ vendor_id: trader_user_profile_id })

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
                : <Button type='primary' danger size={size}>
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
   * @method renderDeals
   * @description render service tab
   */
  renderDeals = () => {
    const { loggedInUser } = this.props;
    const { myDeals } = this.state;

    return (Array.isArray(myDeals) && myDeals.length) ? myDeals.map((el, i) => {
      return (
        <tr key={i}>
          <td>
            <div className="title"><Text>{el.item.title}</Text></div>
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
          <td>{this.getStatus(el)}</td>
        </tr>
      )
    }) : <tr>
        <td className="pt-10" colSpan="5"><NoContentFound /></td>
      </tr>
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    return (
      <Layout className="create-membership-block daily-deals-listing">
        <Layout>
          <AppSidebar activeTabKey={DASHBOARD_KEYS.DAILY_DEALS} history={history} />
          <Layout>
            <div className='my-profile-box view-class-tab view-class-tab-listing' style={{ minHeight: 800 }}>
              <div className='card-container signup-tab'>

                <div className='top-head-section'>
                  <div className='left'>
                    <Title level={2}>My Deals</Title>
                  </div>
                  <div className='right'></div>
                </div>
                <div className='sub-head-section'>
                  <Text>&nbsp;</Text>
                </div>
                <Card
                  bordered={false}
                  className='profile-content-box create-new-deal'
                  title='Deals Listing'
                  extra={
                    <Space
                      align={'center'}
                      className={'blue-link'}
                      style={{ cursor: 'pointer' }}
                      size={9}
                      onClick={() => {
                          this.props.history.push({
                            pathname: `/daily-deals`                          
                          })                      
                      }}
                    >Create New Deal
                  <img src={require('../../../../../assets/images/icons/edit-pencil.svg')} alt='' />
                    </Space>

                  }
                >
                  <div className='profile-content-box box-profile'
                  >
                    <table>
                      <tr>
                        <th>Item Name</th>
                        <th>Actual Price</th>
                        <th>Discount(%)</th>
                        <th>Discounted Price</th>
                        <th>Valid on</th>
                        <th>Status</th>
                      </tr>
                      {this.renderDeals()}
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
    userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
  };
};
export default connect(
  mapStateToProps,
  { getMyRetailDeals,  changeDealStatus }
)(RetailDealsListing)