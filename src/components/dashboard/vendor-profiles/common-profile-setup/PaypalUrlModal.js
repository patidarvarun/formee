import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Card, Layout, Typography,  Avatar, Tabs, Row, Col, Breadcrumb, Carousel, Input, Select, Button, Rate, Modal, Dropdown, Divider } from 'antd';
// import { getPortFolioData, getBookingDetails, enableLoading, disableLoading, addToFavorite, removeToFavorite, openLoginModel, getClassfiedCategoryDetail } from '../../../actions/index'
const { Text } = Typography;

class PaypalUrlScreen extends React.Component {

    myDivToFocus = React.createRef()
    constructor(props) {
        super(props);
        this.state = {
            // bookingDetail: [],
            allData: '',
            visible: false,
            makeOffer: false,
            carouselNav1: null,
            carouselNav2: null,
            reviewModel: false,
            activeTab: '1',
            portfolio: [],
            isBrochure: false,
            isPortfolio: false,
            isCertificate: false
        };
    }



    /**
     * @method render
     * @description render component
     */
    render() {
        const { paypalUrl } = this.props

        return (
            <Modal
                visible={this.props.visible}
                className={'custom-modal'}
                footer={false}
                onCancel={this.props.onCancel}
            >
                <React.Fragment>
                    <Layout className="yellow-theme">
                        <Text>Paypal Url</Text>
                        <Text style={{ pointer: 'cursor' }} onClick={() => {
                            window.location.assign(paypalUrl)
                            // this.props.history.push(paypalUrl)
                        }}>{paypalUrl}</Text>
                    </Layout>
                </React.Fragment>
            </Modal>
        )
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth, postAd, profile } = store;
    const { step1, attributes, step3, allImages, preview } = postAd;
    return {
        loggedInDetail: auth.loggedInUser,
        userDetails: profile.traderProfile !== null ? profile.traderProfile : {},
        step1,
        attributes: attributes,
        specification: attributes.specification,
        inspection_time: attributes.inspection_time,
        step3,
        allImages, preview
    };
};

export default connect(
    mapStateToProps,
    {}
)(withRouter(PaypalUrlScreen));