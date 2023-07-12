import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom'
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import { MESSAGES } from '../../../config/Message'
import { Button, Row, Col, Input, Checkbox, Typography, Avatar, Tooltip } from 'antd';
import { savePlanDetailsAPI } from '../../../actions'
import { UserOutlined } from '@ant-design/icons';
import Icon from '../../customIcons/customIcons';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement
} from '@stripe/react-stripe-js';

import useResponsiveFontSize from './FontSizes';
const { Title, Text } = Typography;

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#9e2146'
        }
      }
    }),
    [fontSize]
  );

  return options;
};

const SplitForm = (props) => {
  
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const payload = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardNumberElement),
      billing_details: { name: 'testing' }
    });
    
    if (payload.error !== undefined) {
      toastr.error(langs.error, payload.error.message);
    } else if (payload.paymentMethod !== undefined) {
      const requestData = {
          plan_id: props.planId,
          classified_id: props.classifiedId,
          user_id: props.loggedInUser.id
      }
      props.savePlanDetailsAPI(requestData, res => {
        if(res.status === 200){
          toastr.success(langs.success, MESSAGES.PAYMENT_SUCCESS);
          if (props.postAnAd !== undefined && props.postAnAd) {
            props.history.push('/')
          } else {
            props.history.push('/myProfile')
          }
        }
      })
    }
  };

  return (
    <form onSubmit={handleSubmit} className='stripe-box'>
      <Title level={4} className='stripe-box-heading'>{'Add a new card'}</Title>
      <Row gutter={[20, 12]}>
        <Col span={24}>
          <CardNumberElement
            options={options}
            required
            prefix={<Avatar size={20} style={{ backgroundColor: '#E5EAEE' }}><span style={{ position: 'relative', top: -1 }}><Icon icon='user' size='11' /></span></Avatar>}
            onReady={(event) => {
              
              
            }}
            onChange={event => {
              
              
            }}
            onBlur={() => {
              
            }}
            onFocus={() => {
              
            }}
          />

        </Col>
      </Row>
      <Row gutter={[20, 12]}>
        <Col span={24}>
          <Input name='name' required size='large' placeholder='Name on card' prefix={<Avatar size={20} style={{ backgroundColor: '#E5EAEE' }}><span style={{ position: 'relative', top: -1 }}><Icon icon='user' size='11' /></span></Avatar>} />
        </Col>
      </Row>
      <Row gutter={[20, 12]}>
        <Col span={18}>
          <div style={{ width: 232 }}>
            <CardExpiryElement
              options={options}

              onReady={() => {
                
              }}
              onChange={event => {
                
                
              }}
              onBlur={() => {
                
              }}
              onFocus={() => {
                
              }}
            />
          </div>
        </Col>
        <Col span={6}>
          <div className='cvc-input-box'>
            <CardCvcElement
              options={options}
              onReady={() => {
                
              }}
              onChange={event => {
                
                
              }}
              onBlur={() => {
                
              }}
              onFocus={() => {
                
              }}
            />
            <Tooltip title='Enter the CVC number' className={'cvc-tooltip'}>
              <img src={require('../../../assets/images/icons/help.svg')} alt='' />
            </Tooltip>
            
          </div>
        </Col>
      </Row>
      <Row gutter={[20, 20]} className='pt-12'>
        <Col span={24}>
          <Checkbox>Remember for future purchases</Checkbox>
        </Col>
      </Row>

      {props.postAnAd ?
        <Row gutter={[20, 0]} className='pt-43'>
          <Col>
            <Button htmlType='submit' type={'default'} danger size='large' disabled={!stripe} className='text-white' style={{ backgroundColor: '#EE4929' }}>
              Pay
            </Button>
          </Col>
          <Col>
            <Link to={'/'}>
              <Button htmlType='default' type={'default'} size='large' danger className='text-black'  style={{ backgroundColor: 'white' }}>Cancel</Button>
            </Link>
          </Col>
        </Row> :
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <button type='submit' disabled={!stripe} className={'buttonPayment'}>
              Save
          </button>
          </Col>
        </Row>}
    </form>
  );
};

// export default withRouter(SplitForm);

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
      isLoggedIn: auth.isLoggedIn,
      loggedInUser: auth.loggedInUser,
  };
};
export default connect(
  mapStateToProps,
  { savePlanDetailsAPI }
)(withRouter(SplitForm));
