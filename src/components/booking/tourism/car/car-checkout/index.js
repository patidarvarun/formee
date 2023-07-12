import React from 'react';
import { connect } from 'react-redux';
import { Steps, Layout } from 'antd';
import { getUserProfile, disableLoading } from '../../../../../actions/index';
import CarDetails from './CarDetails'
import CarBooking from './CarBookingForm'
import CarCheckout from './CarCheckout'
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/one-way-return.less";
import "./car-checkout.less";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import TourismSteps from "../../common/TourismSteps";
const { Content } = Layout;
const { Step } = Steps;


class CarBookingsSteps extends React.Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            submitFromOutside: false,
            current: 0,
            pnrNumber: '',
            step1Data: '',
            selectedCar: '',
            step2Data: '',
        };
    }

     /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        const { selectedCar } = nextprops
        this.setState({selectedCar: selectedCar})
    }
    
    /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    componentWillMount() {
        const { selectedCar } = this.props;
        this.setState({selectedCar: selectedCar})
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const {step1Data, current, pnrNumber,selectedCar, step2Data } = this.state;
        const { random_token } = this.props
        console.log('current',selectedCar)
        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing booking-tourism-checkout-box">
                <Layout className="yellow-theme common-left-right-padd">
                    <TopBackWithTitle {...this.props} title={'CAR RENTALS'}/>
                    <Layout className="right-parent-block inner-content-wrap tourism-one-way-and-return-box">
                        <Content className="site-layout tourism-multi-city-flight-box ">
                            <TourismSteps {...this.props} current={current} 
                                title1={'Car Rental'}
                                title2={'Reserve'}
                                show={false}
                            />
                            {current === 0 ? <CarDetails
                                changeNextStep={(step, data) => {
                                    this.setState({ 
                                        current: this.state.current + 1,
                                        step1Data: step === 1 && data 
                                    })
                                }}
                                {...this.props}
                                selectedCar={selectedCar}
                                random_token={random_token}
                            /> : current === 1 ?
                                <CarBooking
                                    selectedCar={selectedCar}
                                    random_token={random_token}
                                    step1Data={step1Data}
                                    changeNextStep={(step,data) => {
                                        this.setState({ 
                                            current: this.state.current + 1 , 
                                            pnrNumber: step === 2 ? data.pnr : '',
                                            step2Data: step === 2 ? data.filledData : ''
                                        })
                                    }} 
                                    {...this.props}
                                /> : 
                                    <CarCheckout 
                                        pnrNumber={pnrNumber} 
                                        selectedCar={selectedCar} 
                                        random_token={random_token} 
                                        step1Data={step1Data}
                                        step2Data={step2Data}
                                        {...this.props}
                                    />}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, tourism } = store;
    const { random_token,selectedCar} = tourism
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        random_token,
        selectedCar
    };
};
export default connect(mapStateToProps, {
    getUserProfile,
    disableLoading
})(CarBookingsSteps);
