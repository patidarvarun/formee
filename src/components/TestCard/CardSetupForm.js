import React from 'react';
import { connect } from 'react-redux';
import { ElementsConsumer, CardElement, useStripe } from '@stripe/react-stripe-js';
import { getClientSeceretKey, getStripeToken ,savedStripeCard} from '../../actions'
import CardSection from './CardSection';

class CardSetupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            secretKey: '',
        }
    }
    componentWillMount() {
        //get-stripe-card-token{}
        this.props.getClientSeceretKey({ key: 'sk_test_6rEJQ6lB2yse6Kp3gJCQY3bv' }, (res) => {
            if (res.status === 200) {
                console.log('res: ', res.data.data.client_secret);
                this.setState({ secretKey: res.data.data.client_secret })
            }
        })
    }
    handleSubmit = async (event) => {
        console.log('event: ', event.target.data);
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        const { stripe, elements } = this.props
        const card = elements.getElement(CardElement);
        const result = await stripe.createToken(card);
        console.log('result: ', result.token.id);
        const Token = result.token.id
        console.log('Token: ', Token);
        this.props.savedStripeCard(Token, (res) => {
            console.log('res: $$$', res);

        })
        return
        if (!stripe || !elements) {
            console.log('Stripe.js has not yet loaded');
            // Stripe.js has not yet loaded.
            // Make  sure to disable form submission until Stripe.js has loaded.
            return;
        }
        this.props.getStripeToken({
            card_number: parseInt('4000008260003178'),
            exp_month: parseInt('12'),
            exp_year: 2030,
            cvc: 123
        }, (res) => {
            console.log('res: $$$', res);

        })
        // const result = await stripe.confirmCardSetup(this.state.secretKey, {
        //     payment_method: {
        //         card: elements.getElement(CardElement),
        //         billing_details: {
        //             name: 'Jenny Rosen',
        //         },
        //     }
        // });
        // console.log('result: ', result);
        // if (result.error) {
        //     console.log('result.error: ', result.error);
        //     // Display result.error.message in your UI.
        // } else {
        //     console.log('Result: ', result);
        //     // The setup has succeeded. Display a success message and send
        //     // result.setupIntent.payment_method to your server to save the
        //     // card to a Customer
        // }
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {/* <form onSubmit={(values) => {
                console.log('values: ', values);
                 values.preventDefault();
             }}> */}
                <CardSection />
                <button disabled={!this.props.stripe}>Save Card</button>
            </form>
        );
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth, profile } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {}
    };
};
export default connect(mapStateToProps, { getClientSeceretKey, getStripeToken ,savedStripeCard})(CardSetupForm);
