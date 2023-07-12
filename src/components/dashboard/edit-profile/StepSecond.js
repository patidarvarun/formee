import React, { Fragment } from 'react';
import { Button, message, Card, Typography, Avatar, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
// import { StripeProvider, Elements } from 'react-stripe-elements'
import CheckoutForm from './Checkout'
import SplitForm from './SplitForm'
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './style.less';
import history from '../../../common/History';
import moment from 'moment'; 
const { Title, Text } = Typography;

const stripePromise = loadStripe('pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD');

const paymentMethodsTabList = [
    {
        key: 'cardPayment',
        tab: <Fragment>
            <Text className='fs-12 normal'>Pay with</Text>
            <h4 className='strong mt-0'>Credit or Debit Card</h4>
        </Fragment>,
    },
];


class StepSecond extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitFromOutside: false,
            submitBussinessForm: false,
            imageUrl: '',
            key: 1,
            paymentMethodsKey: 'cardPayment',
            opened: false,
        };
        this.toggleBox = this.toggleBox.bind(this);
    }

    /**
     * @method toggleBox
     * @description handle toggleBox 
     */
    toggleBox() {
        const { opened } = this.state;
        this.setState({
            opened: !opened,
        });
    }

    /**
     * @method onTabChange
     * @description handle ontabchange 
     */
    onTabChange = () => {
        const { key } = this.state
        if (key === 1) {
            this.setState({ key: 2 })
        } else if (key === 2) {
            this.setState({ key: 1 })
        }
    }

    paymentMethodsTab = (key, type) => {
        
        this.setState({ [type]: key });
    };

    /**
     * @method submitCustomForm
     * @description handle custum form  
     */
    submitCustomForm = () => {
        this.setState({
            submitFromOutside: true,
            submitBussinessForm: true
        });
    };

    /**
     * @method getBase64
     * @description get base 64 data
     */
    getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    /**
     * @method beforeUpload
     * @descriptionhandle upload
     */
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    /**
     * @method handleChange
     * @descriptionhandle handle photo change
     */
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    onToken = (token) => {
        
    }
    /**
     * @method render
     * @description render component  
     */
    render() {
        const {planData, postAnAd, planId, classifiedId, title, children } = this.props
        
        const contentListNoTitle = {
            cardPayment: <Elements stripe={stripePromise}>
                <SplitForm
                    postAnAd={postAnAd}
                    history={history}
                    planId={planId}
                    classifiedId={classifiedId}
                />
            </Elements>,
        };
        const { opened } = this.state;



        return (
            <Fragment>
                {postAnAd ?
                    <Fragment>
                        <div className='wrap-inner'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', paddingBottom: 30 }}>
                                <div>
                                    <h2 className='strong mb-7' style={{ color: '#5D3F96' }}>Checkout</h2>
                                    <Text type='secondary' className='fs-14 text-gray'>Select payment type</Text>
                                </div>
                            </div>
                            <Row gutter={[38, 38]}>
                                <Col className='gutter-row' md={16}>
                                    <Card
                                        className='payment-methods-card mb-60'
                                        tabList={paymentMethodsTabList}
                                        activeTabKey={this.state.paymentMethodsKey}
                                        onTabChange={key => {
                                            this.paymentMethodsTab(key, 'paymentMethodsKey');
                                        }}
                                    >
                                        {contentListNoTitle[this.state.paymentMethodsKey]}
                                    </Card>
                                </Col>
                                <Col className='gutter-row' md={8}>
                                    <Card
                                        className={'order-summary-card'}
                                        extra={(
                                            <span onClick={this.toggleBox}>{!opened ? <span>Hide Details <CaretUpOutlined /></span> : <span>Show Details <CaretDownOutlined /></span>}</span>
                                        )}
                                        title={'Order Summary'}
                                        bordered={false}
                                    >
                                        {!opened && (
                                            <div className='boxContent'>
                                                <Title level={2}>You are buying</Title>
                                        <div className={'order-summary-item'}>
                                        <Text>{planData && planData.package_name}
                                                {/* Upgrade Ad-Basic */}
                                        </Text>
                                        <Text className={'strong'}>{planData && `$${planData.package_price}`}</Text>
                                        </div>
                                        <div className={'order-summary-item'}>
                                            <Text>
                                                {/* Used Holden Sedan  */}
                                                {planData && `${planData.package_discription} `}{planData && moment(planData.updated_at).format('YYYY')} 2006 </Text>
                                            <Text>{''}</Text>
                                        </div>
                                        <div className={'order-summary-total'}>
                                            <Text>{''}</Text>
                                            <Text>Total: <span className={'strong'}>{planData && `$${planData.package_price}`}</span></Text>
                                        </div>
                                            </div>
                                        )}
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Fragment> :
        <Fragment>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', paddingBottom: 30 }}>
                <div>
                    <h4 className='strong mb-7'>Set your Payment Methods</h4>
                    <Text type='secondary' className='fs-10 text-gray'>Set your Payment Methods or you can skip it.</Text>
                </div>
                <Link to='/' className='skip-avatar-link'><Avatar size={65}>Skip</Avatar></Link>
            </div>
            <Card
                className='payment-methods-card mb-60'
                tabList={paymentMethodsTabList}
                activeTabKey={this.state.paymentMethodsKey}
                onTabChange={key => {
                    this.paymentMethodsTab(key, 'paymentMethodsKey');
                }}
            >
                {contentListNoTitle[this.state.paymentMethodsKey]}
            </Card>
        </Fragment>
    }

            </Fragment>
        );
    }
}

export default StepSecond;




{/*  <Fragment>
                    <StripeCheckout
                    token={this.onToken}
                    stripeKey='pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD'
                /> */}

{/* <Button htmlType='submit' type='primary' form='personal-form' size='middle' className='btn-blue' onClick={this.submitCustomForm}>
                    Save
                </Button> */}
{/* <StripeProvider apiKey='pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD'>
                    <Elements>
                        <div>
                            <CheckoutForm selectedProduct={{ price: 100, id: 10 }} />

                       Hello
                   </div>
                    </Elements>
                </StripeProvider>  
            </Fragment>*/}