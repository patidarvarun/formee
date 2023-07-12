import React, { Component } from 'react';
import AppSidebar from '../sidebar/SidebarInner';
import { Layout, Breadcrumb, Typography, Tabs, Row, Col, Table } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import history from '../../common/History';
import { DEFAULT_IMAGE_CARD } from '../../config/Config';
import { connect } from 'react-redux';
import Icon from '../customIcons/customIcons';
import { enableLoading, disableLoading, } from '../../actions/index'
import { getProductList } from '../../actions/food-scanner/FoodScanner'
import { CheckSquareOutlined, BorderOutlined, HeartOutlined, EyeOutlined, ShareAltOutlined, CloseOutlined } from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { reactLocalStorage } from 'reactjs-localstorage';
import FoodProductDetailCard from './FoodProductDetailCard';
import FoodProductDetailPage from './FoodProductDetailPage';
import Back from '../common/Back'

const { Title } = Typography;
const { TabPane } = Tabs;

class CompareFoodProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comparisionData: []
        }
    }

    componentDidMount() {
        const data = reactLocalStorage.getObject('compareProductData');
        this.setState({ comparisionData: data.data });
    }

    componentWillUnmount() {
        reactLocalStorage.setObject('compareProductData', { data: [] });
    }

    render() {
        const { comparisionData } = this.state;

        return (
            <div className='App foodscanner-green-main-wrap' >
                <Layout>
                    <Layout>
                        {/* <AppSidebar history={history} /> */}
                        <Layout className="foodscanner-detail" >
                            {/* <Breadcrumb separator='|' className='pt-20 pb-30' style={{ paddingLeft: 50 }}>
                                <Breadcrumb.Item>
                                    <Link to='/'>Home</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to='/food-scanner'>Food Scanner</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Comparision
                                </Breadcrumb.Item>
                            </Breadcrumb> */}
                            {/* <Title level={2} className='inner-page-title'>
                                <span>Compare Products</span>
                            </Title> */}
                             <div className='sub-header child-sub-header'>
                    {/* <div className='hamburger-icon' >
                    <Icon icon={'hamburger'} size='20' />
                    </div> */}
                    <Title level={4} className='title main-heading-bookg'><span className='child-sub-category'>FOOD SCANNER</span></Title>
                </div>
                <div className="food-scanner-back"><Back {...this.props} /></div>
                            {comparisionData.length &&
                            <div className="compare-page">
                              <div className="heading-block">
                              <Title level={2}>
                                <span>Compare Products</span>
                            </Title>
                            <p className="item-count">You have 4 items</p>
                              </div>
                              <Row>
                                    <Col span={12}>
                                        <FoodProductDetailPage
                                            productDetails={comparisionData[0]}
                                            compare
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <FoodProductDetailPage
                                            productDetails={comparisionData[1]}
                                            compare
                                        />
                                    </Col>
                                </Row>
                            </div>
                                
                            }
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInDetail: auth.loggedInUser,
    };
}

export default connect(
    mapStateToProps, { enableLoading, disableLoading }
)(withRouter(CompareFoodProduct));
