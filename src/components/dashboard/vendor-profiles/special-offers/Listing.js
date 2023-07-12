import React from 'react';
import { connect } from 'react-redux';
import { langs } from '../../../../config/localization';
import { toastr } from 'react-redux-toastr'
import { Layout, Typography, Tabs, Card, Space,Col, Menu, Dropdown, Button, Row } from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import { getMyOffers, getEligibleOffer ,changeOfferStatus} from '../../../../actions'
import { dateFormate } from '../../../common';
import { DASHBOARD_KEYS } from '../../../../config/Constant'
import NoContentFound from '../../../common/NoContentFound';
const { Title, Text } = Typography;

class OffersListing extends React.Component {
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
        const { booking_category_id } = userDetails.user.business_profile
        let reqData = {}
        reqData.category_id = booking_category_id
        this.props.getEligibleOffer(reqData)
        this.props.getMyOffers({ vendor_id: loggedInUser.id })
    }

 /**
  * @method change deal status
  * @description change deal status  
  */
  changeStatus = (state, id) => {
    const { loggedInUser } = this.props;
    let reqdata = {
      vendor_offer_id: id,
      vendor_status: state
    }

    this.props.changeOfferStatus(reqdata, (res) => {
      
      if (res.status === 200) {
        this.props.getMyOffers({ vendor_id: loggedInUser.id })
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
     * @method renderOffers
     * @description render service tab
     */
    renderOffers = () => {
        const { myOffers } = this.props;
        
        return (Array.isArray(myOffers) && myOffers.length) ? myOffers.map((el, i) => {
            return (
                <tr key={i}>
                    <td>
                        <div className="title"><Text className=''>{el.title}</Text></div>
                    </td>
                    <td>{el.discount_percent} %</td>
                    <td>{dateFormate(el.start_date)} - {dateFormate(el.end_date)}</td>
                    <td>{this.getStatus(el)}</td>
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
        const { offersFromAdmin } = this.props;
        console.log('offersFromAdmin',offersFromAdmin)
        
        return (
            <Layout className="create-membership-block daily-deals-listing">
                <Layout>
                    <AppSidebar activeTabKey={DASHBOARD_KEYS.SPECIAL_OFFER} history={history} />
                    <Layout>
                        <div className='my-profile-box view-class-tab view-class-tab-listing' style={{ minHeight: 800 }}>
                            <div className='card-container signup-tab'>

                                <div className='top-head-section'>
                                    <div className='left'>
                                        <Title level={2}>My Special Offers</Title>
                                    </div>
                                    <div className='right'></div>
                                </div>
                                <div className='sub-head-section'>
                                    <Text>&nbsp;</Text>
                                </div>
                                <Card
                                    bordered={false}
                                    className='profile-content-box create-new-deal'
                                    title='Offers'
                                    extra={
                                        <Space
                                            align={'center'}
                                            className={'blue-link'}
                                            style={{ cursor: 'pointer' }}
                                            size={9}
                                            onClick={() => {
                                                if (offersFromAdmin) {
                                                    this.props.history.push({
                                                        pathname: `/create-offers`
                                                    })
                                                } else {
                                                    toastr.warning(langs.warning, 'Special Offers are not available yet.')
                                                }
                                            }}
                                        >Create New Offer
                    <img src={require('../../../../assets/images/icons/edit-pencil.svg')} alt='' />
                                        </Space>

                                    }
                                >
                                    <div className='profile-content-box box-profile'
                                    >
                                        <table>
                                            <tr>
                                                <th>Title</th>
                                                <th>Discount(%)</th>
                                                <th>Valid on</th>
                                                <th>Status</th>
                                            </tr>
                                            {this.renderOffers()}
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
        myOffers: Array.isArray(venderDetails.myOffers) ? venderDetails.myOffers : [],
        offersFromAdmin: venderDetails.offersFromAdmin ? venderDetails.offersFromAdmin : '',
    };
};
export default connect(
    mapStateToProps,
    { getMyOffers, getEligibleOffer,changeOfferStatus }
)(OffersListing)