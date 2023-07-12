import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Steps, Layout, Typography, Modal, Button } from 'antd';
import { getUserProfile, tourismFlightBookingPaypal} from '../../../../../actions/index';
import {
    blankValueCheck,
  } from "../../../../common";
import FlightsDetail from './FlightsDetails'
import TravellersDetail from './TravellersDetails'
import FlightsCheckout from './FlightCheckout'
import "../../common/css/booking-tourism-checkout.less";
import "../../common/css/one-way-return.less";
import TopBackWithTitle from "../../common/TopBackWithTitle";
import TourismSteps from "../../common/TourismSteps";
import { toastr } from "react-redux-toastr";
import moment from "moment";
const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { Step } = Steps;


class FlightBookingsSteps extends React.Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            submitFromOutside: false,
            current: 0,
            selectedFlight: this.props.recomendations.filter((el) => el.counter === Number(this.props.match.params.counter)),
            pnrNumber: '',
            paypalpaymentresponse: null,
            visible: false,
            search_params: "",
            booking_id: null
        };
    }

    paypalresponse = (response) => {
    console.log("🚀 ~ file: index.js ~ line 31 ~ FlightBookingsSteps ~ response", response)
    this.tourismFlightBooking(response)
        this.setState({
            paypalpaymentresponse: response
        })
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        const { flight_search_params } = nextprops;
        this.setState({ search_params: flight_search_params });
    }

    /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    componentWillMount() {
        const { flight_search_params } = this.props;
        this.setState({ search_params: flight_search_params });
    }

    /**
     * @method addElement
     * @description add element in object
     */
    addElement = (ElementList, element) => {
        let newList = Object.assign(ElementList, element);
        return newList;
    };

    tourismFlightBooking = (paypal_payment) => {
        const { selectedCard } = this.props;
        const { selectedFlight, search_params, pnrNumber } = this.state;
        let data = selectedFlight && Array.isArray(selectedFlight) && selectedFlight.length ? selectedFlight[0] : ''
        let isNonDirect = false
        let flightRequest = { flightRequest: search_params.reqData };
        let flight_details = this.addElement(data, flightRequest);
        if (data.segments && Array.isArray(data.segments) &&data.segments.length) {
          data.segments.map(el => {
            if(el.length > 1){
              isNonDirect = true
            }
          })
        }
        console.log(
          String(flight_details.daysDifferance),
          "flight_details: ",
          flight_details.daysDifferance
        );
        flight_details.daysDifferance = String(flight_details.daysDifferance);
        console.log("flight_details: ", flight_details);
        let reqData = {
          flight_details: flight_details,
          pnr_number: pnrNumber,
          departure_date: data.departureDate,
          departure_time: data.departureTime,
          total_price:
            Number(data.price) + Number(data.tax_amount),
        //   payment_method: "stripe",
        //   payment_source_id: selectedCard,
          isNonDirect: isNonDirect ? 1 : 0
        };
        Object.assign(reqData, paypal_payment)
        console.log("reqData", reqData);
        const formData = new FormData();
        Object.keys(reqData).forEach((key) => {
          if (typeof reqData[key] == "object") {
            formData.append(key, JSON.stringify(reqData[key]));
          } else {
            formData.append(key, reqData[key]);
          }
        });
        this.props.tourismFlightBookingPaypal(formData, (res) => {
          console.log("checkout res", res);
          if (res.status === 200) {
            this.setState({ visible: true, booking_id: res.data.id});
            toastr.success("Flight has been booked sucessfully.");
          }
        });
      };
    /**
     * @method render
     * @description render component
     */
    render() {
        const { current, selectedFlight, pnrNumber, visible } = this.state;
        const { random_token } = this.props
        let data = selectedFlight && Array.isArray(selectedFlight) && selectedFlight.length ? selectedFlight[0] : ''
        let total_price =
      Number(selectedFlight.price) + Number(selectedFlight.tax_amount);
        let outBoundData = "",
        returnData = "",
        first_obj_out = "",
        second_obj_out = "";
        if (
        selectedFlight.segments &&
        Array.isArray(selectedFlight.segments) &&
        selectedFlight.segments.length
        ) {
        outBoundData = selectedFlight.segments[0];
        returnData =
            selectedFlight.segments.length > 1 ? selectedFlight.segments[1] : "";
        if (outBoundData) {
            first_obj_out =
            outBoundData && Array.isArray(outBoundData) && outBoundData.length > 0
                ? outBoundData[0]
                : "";
            second_obj_out =
            outBoundData && Array.isArray(outBoundData) && outBoundData.length > 1
                ? outBoundData[outBoundData.length - 1]
                : first_obj_out
                ? first_obj_out
                : "";
        }
        }

        return (
            <Layout className="common-sub-category-landing booking-sub-category-landing booking-tourism-checkout-box">
                <Layout className="yellow-theme common-left-right-padd">
                    <TopBackWithTitle {...this.props} title={'Flights'}/>
                    <Layout className="right-parent-block inner-content-wrap tourism-one-way-and-return-box">
                        <Content className="site-layout tourism-multi-city-flight-box ">
                            <TourismSteps {...this.props} 
                                current={current}
                                title1={'Flights'}
                                title2={'Travellers'}  
                            />
                            {current === 0 ? <FlightsDetail
                                changeNextStep={(step, data) => {
                                    this.setState({ current: this.state.current + 1 })
                                }}
                                selectedFlight={data}
                                random_token={random_token}
                            /> : current === 1 ?
                                <TravellersDetail
                                    selectedFlight={data}
                                    random_token={random_token}
                                    paypalpaymentresponse={this.state.paypalpaymentresponse}
                                    changeNextStep={(step,data) => {
                                        this.setState({ current: this.state.current + 1 , pnrNumber: step === 2 ? data : ''})
                                    }} /> : <FlightsCheckout paypalresponse={this.paypalresponse} pnrNumber={pnrNumber} selectedFlight={data} random_token={random_token} />}
                            <Modal
                                visible={visible}
                                title="Purchase Complete!"
                                onOk={() => this.setState({ visible: false })}
                                onCancel={() => this.setState({ visible: false })}
                                footer={null}
                                closable={false}
                                maskClosable={false}
                                className="custom-modal style1 booking-confirmation-modal"
                                >
                                <div class="confirmation-modal-container">
                                    {/* <Title>Purchase Complete!</Title> */}
                                    <Title level={3}>
                                    Your{" "}
                                    {first_obj_out && first_obj_out.boardAirportDetail
                                        ? `${blankValueCheck(
                                            first_obj_out.boardAirportDetail.cityName
                                        )}`
                                        : ""}
                                    ` -{" "}
                                    {second_obj_out && second_obj_out.offAirportDetail
                                        ? `${blankValueCheck(second_obj_out.offAirportDetail.cityName)}`
                                        : ""}{" "}
                                    flight is confirmed.
                                    </Title>

                                    <div className="information">
                                    <Paragraph>
                                        Your booking ID is <Link to="#">{this.state.booking_id}</Link> . Please use
                                        this booking ID for any communication with us.
                                    </Paragraph>
                                    <Text>We will email your ticket shortly.</Text>
                                    </div>

                                    <div class="information payment-information">
                                    <Paragraph>
                                        Your payment of $`{total_price}` was processed on{" "}
                                        {moment().format("DD/MM/YYYY")}. Here is a link to Receipt{" "}
                                        <Link to="#">#8458.pdf</Link> for your records
                                    </Paragraph>
                                    </div>

                                    <div className="button-container">
                                    <Button
                                        className="continue-button"
                                        onClick={() => {
                                        this.props.history.push(
                                            "/bookings-flight-tourism/Tourism/55/Flights/56"
                                        );
                                        this.setState({ visible: false });
                                        }}
                                    >
                                        Continue Browsing
                                    </Button>
                                    <Button
                                        className="go-home-button"
                                        onClick={() => {
                                        this.props.history.push(
                                            "/bookings-flight-tourism/Tourism/55/Flights/56"
                                        );
                                        this.setState({ visible: false });
                                        }}
                                    >
                                        Go to My Bookings
                                    </Button>
                                    </div>
                                </div>
                                </Modal>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, tourism } = store;
    const { flight_search_params, flightRecords, random_token } = tourism;
   // console.log('flightRecords: &&*', flightRecords);
    let recomendations = flightRecords && flightRecords.body ? flightRecords.body.recomendations : []
   // console.log('recomendations: &&*', recomendations);
  //  console.log('random_token', random_token)
    return {
        flight_search_params,
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : null,
        recomendations,
        random_token
    };
};
export default connect(mapStateToProps, {
    getUserProfile,
    tourismFlightBookingPaypal
})(FlightBookingsSteps);
