import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import AppSidebar from '../sidebar/SidebarInner';
import { Layout, Card, Pagination, Typography, Row, Breadcrumb } from 'antd';
import Icon from '../../components/customIcons/customIcons';
import { openLoginModel, enableLoading, disableLoading } from '../../actions';
import { getProductList } from '../../actions/food-scanner/FoodScanner';
import history from '../../common/History';
import { langs } from '../../config/localization';
import FoodProductDetailCard from './FoodProductDetailCard';
import NoContentFound from '../common/NoContentFound';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Pagination
function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a><Icon icon='arrow-left' size='14' className='icon' /> Back</a>;
    }
    if (type === 'next') {
        return <a>Next <Icon icon='arrow-right' size='14' className='icon' /></a>;
    }
    return originalElement;
}

class SeeAllProducts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: [],
            page: 1,
            productList: [],
            permission: false
        };
    }

    /**
     * @method componentWillMount
     * @description called before mount the component
     */
    componentWillMount() {
        this.setState({ listTypeValue: this.props.match.params.listType });
        this.props.enableLoading()
        this.getProductListing(this.state.page)
    }

    getProductListing = (page) => {
        const { loggedInDetail, isLoggedIn } = this.props;
        const requestData = {
            filter: this.state.listTypeValue,
            user_id: isLoggedIn ? loggedInDetail.id : '',
            page: page,
            page_size: 12,
        }
        this.props.getProductList(requestData, res => {
            this.props.disableLoading()
            if (res.status === 200) {
                const respData = res.data.data
                this.setState({
                    productList: res.data.data.data,
                    totalPages: respData.total,
                    currentPage: respData.current_page,
                    pageSize: respData.per_page,
                })
            }
        })
    }

    handlePageChange = (e) => {
        this.setState({ page: e })
        this.getProductListing(e)
    }
    /**
     * @method renderCard
     * @description render card details
     */
    renderCard = (productListData) => {
        if (productListData && productListData.length) {
            return (
                <Fragment>
                    <Row gutter={[18, 32]}>
                        {productListData && productListData.map((data, i) => {
                            return (
                                <FoodProductDetailCard
                                    data={data} key={i} col={6}
                                />
                            )
                        })}
                    </Row>
                </Fragment>
            )
        } else {
            return <NoContentFound />
        }
    }

    /**
     * @method render
     * @description render components
     */
    render() {
        let cat_id = this.props.match.params.categoryId;
        const { productList, totalPages, currentPage, pageSize, } = this.state
        return (
            <div className='foodscanner-green-main-wrap new-custom-foodscanner-landingpage'>
                <Layout className="foodscanner-product-listing ">
                    <Layout>
                        {/* <AppSidebar history={history} /> */}
                        <Layout>
                            {/* <div className='sub-header'>
                                <Title level={4} className='title'>All Product</Title>
                            </div> */}
                            <Content className='site-layout'>
                                <div className='wrap-inner bg-linear pb-76 food-scanner-wrap-inner'>
                                    <Breadcrumb separator='|' className=''>
                                        <Breadcrumb.Item>
                                            <Link to='/'>Home</Link>
                                        </Breadcrumb.Item>
                                        <Breadcrumb.Item>
                                            <Link to='/food-scanner'>Food Scanner</Link>
                                        </Breadcrumb.Item>
                                    </Breadcrumb>
                                    <h1>All Products</h1>
                                    {this.renderCard(productList)}
                                    <Pagination
                                        defaultCurrent={1}
                                        defaultPageSize={pageSize} //default size of page
                                        onChange={this.handlePageChange}
                                        total={totalPages} //total number of card data available
                                        itemRender={itemRender}
                                        className={'mb-20'}
                                        hideOnSinglePage={true}
                                    />
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </div >
        );
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(mapStateToProps,
    { getProductList, openLoginModel, enableLoading, disableLoading }
)(SeeAllProducts);