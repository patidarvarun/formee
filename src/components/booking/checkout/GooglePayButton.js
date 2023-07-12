import React from "react";
import GooglePayButton from '@google-pay/button-react';

export default class GooglePay extends React.Component {
    render() {

        return (
            <GooglePayButton
                environment={this.props.env}
                paymentRequest={{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                        {
                            type: 'CARD',
                            parameters: {
                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                allowedCardNetworks: ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"],
                            },
                            tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: {
                                    gateway: this.props.paymentGateway,
                                    gatewayMerchantId: this.props.paymentGatewayMerchantId,
                                },
                            },
                        },
                    ],
                    merchantInfo: {
                        merchantId: this.props.merchantId,
                        merchantName: this.props.merchantName,
                    },
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: this.props.total,
                        currencyCode: this.props.currency,
                        countryCode: this.props.countryCode,
                    },
                }}
                onLoadPaymentData={paymentRequest => {
                    this.props.onSuccess(paymentRequest)
                }}
                //existingPaymentMethodRequired={props.existingPaymentMethodRequired}
                existingPaymentMethodRequired={false}
                onCancel={cancleResposen => {
                    this.props.onCancel(cancleResposen)
                }}
                onError={errorResposen => {
                    this.props.onError(errorResposen)
                }}
            />
        );
    }
}
