import React from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";

export default class PayPalExpressCheckOut extends React.Component {
  render() {
    const onSuccess = (resposne) => {
      // Congratulation, it came here means everything's fine!
      this.props.onSuccess(resposne);
    };

    const onCancel = (resposne) => {
      // User pressed "cancel" or close Paypal's popup!
      this.props.onCancel(resposne);
      // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    };

    const onError = (err) => {
      // The main Paypal's script cannot be loaded or somethings block the loading of that script!
      this.props.onError(err);
      // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
      // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    };

    // In order to get production's app-ID, you will have to send your app to Paypal for approval first
    // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
    //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
    // For production app-ID:
    //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

    // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
    const client = {
      sandbox:
        "AcJtYklAstA978I-nPyRHp7XcgAvZJUmAux_tPoTvLxqAVW3SwqxXqfpzUezgUqZecum0ThG7oFdErUh",
      production: "YOUR-PRODUCTION-APP-ID",
    };

    return (
      <PaypalExpressBtn
        style={{
          size: "small",
        }}
        env={this.props.env} // you can set here to 'production' for production
        client={client}
        currency={this.props.currency} // or you can set this value from your props or state
        total={this.props.total}
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    );
  }
}
