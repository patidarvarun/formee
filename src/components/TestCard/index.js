import React from 'react';
import ReactDOM from 'react-dom';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {Stripe_Public_key} from "../../config/Config";
import CardSetupForm from './InjectedCardSetupForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// Client Id 
// const stripePromise = loadStripe("pk_test_m1DbcNYIBYHUVxxHgBRlBj1O007idAV60K");

// const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
const stripePromise = loadStripe(Stripe_Public_key);

//A K Account
// pk_test_51H3J9jHhOHLOerXXaHfv1p47eSyBM2kQfOYjNyE2NXXUoFDdW8J2EJoYkBAaEqxdg2L0XxY4qKWvlWsyPt4Ojffm00BmSRbBZD
const StripeCheckout=()=>{
  return (
    <Elements stripe={stripePromise}>
      <CardSetupForm />
    </Elements>
  );
};
export default StripeCheckout;