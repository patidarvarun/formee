import React from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr'
import {Modal, Layout, Button, Row, Col } from 'antd';
import {sendFormmeInvoice,generateInvoice, enableLoading, disableLoading } from '../../../../actions'
// import 'ant-design-pro/dist/ant-design-pro.css';
import '../vendorretail.less'

class InvoiceModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toUser:'',
      fromUser:'',
      messageData:'',
      subTotal: ''
    };
  }

  /**
   * @method componentWillMount
   * @description called before render the component
   */
  componentWillMount() {
    this.props.enableLoading()
    this.props.generateInvoice(res => {
      this.props.disableLoading()
      if(res.status === 200){
        let data = res.data && res.data.data
        let toUser = data.toUser ? data.toUser : ''
        let fromUser = data.fromUser ? data.fromUser : ''
        let messageData = data.messageData ? data.messageData : ''
        let subTotal = this.getTotal(messageData)
        this.setState({invoiceDetail: data,toUser: toUser,fromUser: fromUser,messageData: messageData,subTotal: subTotal})
      }
    })
  }

  /**
   * @method sendinvoiceToFormee
   * @description send invoice to formee
   */
  sendinvoiceToFormee = () => {
    this.props.enableLoading()
    this.props.sendFormmeInvoice(res => {
      this.props.disableLoading()
      if(res.status === 200){
        toastr.success('success','Invoice sent successfully.')
        this.props.onCancel()
      }
    })
  }


  /**
   * @method renderDescription
   * @description render item details
   */
  renderDescription = (oders) => {
    let orderData = oders && Array.isArray(oders) && oders.length ? oders : []
    if(orderData && orderData.length){
      let count = 0
      return orderData.map((el, i) => {
        count = Number(el.item_total_amt) + count
        return (
          <tr>
            <td>{el.item_name}</td>
            <td className="text-center">{el.item_qty}</td>
            <td className="text-center">{`$${el.item_price}`}</td>
            <td className="text-right">{`$${el.item_total_amt}`}</td>
          </tr>
        )
      })
    }
  }

  /**
   * @method getTotal
   * @description get item total 
   */
  getTotal = (oders) => {
    let orderData = oders && Array.isArray(oders) && oders.length ? oders : []
    if(orderData && orderData.length){
      let totalamount = 0, discount = 0
      orderData.map((el, i) => {
        totalamount = Number(el.item_total_amt) + totalamount
        discount = Number(el.orders ? el.orders.order_discount : 0) + discount
      })
      return {
        totalamount,
        discount
      }
    }
  }

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { toUser, fromUser,messageData,subTotal } = this.state
    
    let total = subTotal && Number(subTotal.totalamount) - Number(subTotal.discount)
    let invoice = messageData && Array.isArray(messageData) && messageData.length ? messageData[0] : ''
    return (
      <Layout>
        <Modal
          title=""
          visible={this.props.visible}
          className="custom-modal prf-vend-view-invoice"
          onCancel={this.props.onCancel}
          footer={[
            <div className="invoice-text">Send Invoice to Admin</div>,
            <Button key="3" type="primary" className="sned-btn" onClick={() => this.sendinvoiceToFormee()}>
              Send
            </Button>
          ]}
        >
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12}>
                <div>
                  <img src={require('../../../../assets/images/formee-logo.png')} alt='Formee' />
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12}>
                <div className="text-right">
                  <div>
                    <p>{fromUser.business_name ? fromUser.business_name : ''}</p>
                    <p>{fromUser.location ? fromUser.location : ''} </p>
                    <p>{fromUser.city ? fromUser.city : ''} {fromUser.state ? fromUser.state : ''}</p>
                    <p>VAT no.: {fromUser.account_number}</p>
                  </div>
                  <div className="mail-mobile-detail">
                    <p><span>@</span><a href="mailto:your.mail@gmail.com">{fromUser.email_from ? fromUser.email_from : ''}</a></p>
                    <p><span>m</span><a href="tel:+386 989 271 3115">{fromUser.phone ? fromUser.phone : ''}</a></p>
                  </div>
                </div>
              </Col>
            </Row>
            <div className="invoice-block">
              <Row>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <div className="left-block">
                    <b>RECIPIENT</b>
                    <p>{toUser.name ? toUser.name : ''}</p>
                    <p>{toUser.location ? toUser.location : ''}</p>
                    <p>{toUser.state ? toUser.city : ''}  {toUser.state ? toUser.state : ''}</p>
                    <p>VAT no.: 12345678</p>

                    <div className="mail-mobile-detail">
                      <p><span>@</span><a href="mailto:your.mail@gmail.com">{toUser.email_to ? toUser.email_to : ''}</a></p>
                      <p><span>m</span><a href="tel:+386 989 271 3115">{toUser.phone ? toUser.phone : ''}</a></p>
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                  <div className="right-block text-right">
                    <div>
                      <h2>Invoice</h2>
                      <div className="inv-detail">
                        <p className="bold">invoice no.</p>
                        <p>{invoice && `${invoice.order_id} - ${invoice.seller_id} - ${invoice.classified_id}` }</p>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <div className="summary-block">
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="panel panel-default">
                <div className="panel-body">
                  <div className="table-responsive">
                    <table className="table table-condensed">
                      <thead>
                        <tr>
                          <td><strong>ITEMS</strong></td>
                          <td className="text-center"><strong>QUANTITY</strong></td>
                          <td className="text-center"><strong>RATE</strong></td>
                          <td className="text-right"><strong>AMOUNT</strong></td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderDescription(messageData)}
                        <tr>
                          <td className="thick-line"></td>
                          <td className="thick-line"></td>
                          <td className="thick-line text-center gray top-bdr"><strong>Subtotal</strong></td>
                          <td className="thick-line text-right top-bdr">{subTotal && `$${subTotal.totalamount}`}</td>
                        </tr>
                        <tr>
                          <td className="no-line"></td>
                          <td className="no-line"></td>
                          <td className="no-line text-center gray top-bdr"><strong>DISCOUNT</strong></td>
                          <td className="no-line text-right top-bdr">{subTotal && `$${subTotal.discount}`}</td>
                        </tr>
                        <tr>
                          <td className="no-line"></td>
                          <td className="no-line"></td>
                          <td className="no-line text-center total top-bdr"><strong>Total</strong></td>
                          <td className="no-line text-right price top-bdr">{`$${total}`}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="bank-ibn-detail">
                <p>Transfer the amount to the business account below. Please include invoice number on your check.</p>
                <div className="bank-ibn-detail-flex">
                  <div>Account Name: <span>{fromUser.account_name}</span></div>
                  <div className="ibn">Account Number: <span>{fromUser.account_number}</span></div>
                </div>

              </div>
              <div className="notes">
                <h2>NOTES</h2>
                <p>All amounts are in dollars. Please make the payment within 15 days from the issue of date of this invoice. Tax is not charged on the basis of paragraph 1 of Article 94 of the Value Added Tax Act (I am not liable for VAT).</p>
                <p>Thank you for you confidence in my work.<br />
                Signiture</p>

                <div className="company-block">
                  <div className="name">
                    <p>{fromUser.business_name}</p>
                    <p>{fromUser.location}</p>
                  </div>
                  <div className="email">
                    <div className="mail-mobile-detail mt-0">
                      <p><span>@</span><a href="mailto:your.mail@gmail.com">{fromUser.email_from}</a></p>
                      <p><span>m</span><a href="tel:+386 989 271 3115">{fromUser.phone}</a></p>
                    </div>
                  </div>
                  <div className="address">
                    <p>The company is registered in the business register under no. 87650000</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>           
    </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null
  };
};
export default connect(
  mapStateToProps,
  {sendFormmeInvoice,generateInvoice, enableLoading, disableLoading }
)(InvoiceModel)