import React from 'react';
import { connect } from 'react-redux';
import { ElementsConsumer, CardElement } from '@stripe/react-stripe-js';
import CardSetupForm from './CardSetupForm'

export default function InjectedCardSetupForm() {
    return (
        <ElementsConsumer>
            {({ stripe, elements }) => (
                <CardSetupForm stripe={stripe} elements={elements} />
            )}
        </ElementsConsumer>
    );
}
