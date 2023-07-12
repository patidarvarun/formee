import React, { Component, Fragment } from 'react';
import AppSidebar from '../sidebar/HomeSideBarbar';
import { Layout, Breadcrumb, Typography, Collapse, Row, Col } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { FOOTER_SLUGS } from '../../config/Constant'
import { connect } from 'react-redux';
import Icon from '../customIcons/customIcons';
import { enableLoading, disableLoading, } from '../../actions/index'
import { getAllStaticPages } from '../../actions/StaticPages';
import { convertHTMLToText } from '../common';
import './cmstemplate.less';
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;


function callback(key) {
  
}


class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticPage: {}
    }
  }

  componentDidMount() {
    const slug = this.props.match.params.slug;

    const requestData = { slug }

    this.props.enableLoading()
    this.props.getAllStaticPages(requestData, res => {

      this.props.disableLoading()
      if (res.status === 1) {
        this.setState({ staticPage: res.data })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      const slug = nextProps.match.params.slug;

      const requestData = { slug }

      this.props.enableLoading()
      this.props.getAllStaticPages(requestData, res => {

        this.props.disableLoading()
        if (res.status === 1) {
          this.setState({ staticPage: res.data })
        }
      })
    }
  }

  renderAccordian = () => {
    const { staticPage } = this.state;
    
    // const displayFaqs = Array.isArray(staticPage.pageAccordion) && staticPage.pageAccordion.map((faqItem, fIndex) => {
    //   return (
    //     <Fragment>             
    //       <Collapse defaultActiveKey={['0']} onChange={callback}>
    //         <Panel header={faqItem.name} key={fIndex}>
    //            {/* {faqItem.faq.map((item, index) => (
    //             <Fragment>
    //               <h4>{item.question}</h4>
    //               {convertHTMLToText(item.answer)}
    //             </Fragment>
    //           ))}  */}
    //         </Panel>
    //       </Collapse>
    //     </Fragment>
    //   )
    // })
    const displayFaqs =
      <Fragment>
        {Array.isArray(staticPage.pageAccordion) && staticPage.pageAccordion.map((faqItem, fIndex) => {
          
          return <Collapse defaultActiveKey={['0']} onChange={callback}>
            <Panel header={faqItem.question} key={fIndex}>
              {convertHTMLToText(faqItem.answer)}
            </Panel>
          </Collapse>

        })}
      </Fragment>
    return displayFaqs
  }

  getbannerImage = () => {
    const { staticPage } = this.state;
    return <img src={staticPage.banner_image} loading='lazy' alt={require('../../assets/images/Footer Banner/Contact Us.jpg')} />
    // if (staticPage.slug === FOOTER_SLUGS.CONTACT_US) {
    //   return <img src={require('../../assets/images/Footer Banner/Contact Us.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.SERVICES) {
    //   return <img src={require('../../assets/images/Footer Banner/Services.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.PRIVACY_POLICY) {
    //   return <img src={require('../../assets/images/Footer Banner/Privacy Policy.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.POSTING_POLICY) {
    //   return <img src={require('../../assets/images/Footer Banner/Posting Policy.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.PARTNERSHIPS) {
    //   return <img src={require('../../assets/images/Footer Banner/Partnerships.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.ABOUT_US) {
    //   return <img src={require('../../assets/images/Footer Banner/About Us.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.TC_LEGAL_NOTICES) {
    //   return <img src={require('../../assets/images/Footer Banner/Terms of Use.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.HOW_IT_WORKS) {
    //   return <img src={require('../../assets/images/Footer Banner/How it works.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.CAREERS) {
    //   return <img src={require('../../assets/images/Footer Banner/Careers.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.JOIN_FORMEE) {
    //   return <img src={require('../../assets/images/Footer Banner/Join Formee.jpg')} alt='' />
    // } else if (staticPage.slug === FOOTER_SLUGS.TERMS_OF_USE) {
    //   return <img src={require('../../assets/images/Footer Banner/Terms of Use.jpg')} alt='' />
    // }
    //
  }

  getPageTitle = () => {
    const { staticPage } = this.state;    
    if (staticPage.slug === FOOTER_SLUGS.CONTACT_US) {
      return <h3 className="contact-title">Contact Us</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.SERVICES) {
      return <h3 className="contact-title">Services</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.PRIVACY_POLICY) {
      return <h3 className="contact-title">Privacy Policy</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.POSTING_POLICY) {
      return <h3 className="contact-title">Posting Policy</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.PARTNERSHIPS) {
      return <h3 className="contact-title">Partnerships</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.ABOUT_US) {
      return <h3 className="contact-title">About Us</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.TC_LEGAL_NOTICES) {
      return <h3 className="contact-title">Legal Notice</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.HOW_IT_WORKS) {
      return <h3 className="contact-title">How It Works</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.CAREERS) {
      return <h3 className="contact-title">Careers</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.JOIN_FORMEE) {
      return <h3 className="contact-title">Join Formee</h3>
    } else if (staticPage.slug === FOOTER_SLUGS.TERMS_OF_USE) {
      return <h3 className="contact-title">Terms Of Use</h3>
    }    
  }

  render() {
    const { staticPage } = this.state;
    return (
      <div className='App cms-static-template'>
        <Layout>
          <Layout>
            <Layout>
              <div className="newdesign-width">
             
              <div className="banner-block">
              {/* <h3 className="contact-title">Contact Us</h3> */}
              {this.getPageTitle()};
                {this.getbannerImage()}
              </div>
              </div>
              <div className="container-block" >
                <div className="body-content ">
                  <div className="title-heading">{staticPage.title}</div>
                  {(Array.isArray(staticPage.pageAccordion) && staticPage.pageAccordion.length > 0) &&
                    <div className="title-sub-heading">{convertHTMLToText(staticPage.description)}</div>}

                  {staticPage.slug === FOOTER_SLUGS.SERVICES && <div className="category-box-detail">
                    <Row gutter={[30]}>
                      <Col xs={12} lg={6}>
                        <div className='radius-10 align-center category-box' style={{ backgroundColor: '#7EC5F7', cursor: 'default', height: '100%' }}>
                          <Icon icon='classifieds' size='52' />
                          <Paragraph className='title fs-18'>Classifieds</Paragraph>
                        </div>
                      </Col>
                      <Col xs={12} lg={6}>
                        <div className='radius-10 align-center category-box' style={{ backgroundColor: '#FFC468', cursor: 'default', height: '100%' }}>
                          <Icon icon='location-search' size='52' />
                          <Paragraph className='title fs-18'>Bookings</Paragraph>
                        </div>
                      </Col>
                      <Col xs={12} lg={6}>
                        <div className='radius-10 align-center category-box' style={{ backgroundColor: '#CA71B7', cursor: 'default', height: '100%' }}>
                          <Icon icon='cart' size='52' />
                          <Paragraph className='title fs-18'>Retail</Paragraph>
                        </div>
                      </Col>
                      <Col xs={12} lg={6}>
                        <div className='radius-10 align-center category-box' style={{ backgroundColor: '#98CE31', cursor: 'default', height: '100%' }}>
                          {/* <Icon icon='food-scanner' size='52' /> */}
                          <div style={{ minHeight: 58 }}>
                            <img src={require('../../assets/images/icons/food-scanner-white.png')} alt='' />
                          </div>
                          <Paragraph className='title fs-18'>Food Scanner</Paragraph>
                        </div>
                      </Col>

                    </Row>
                  </div>}
                  {staticPage.slug !== FOOTER_SLUGS.CONTACT_US && !staticPage.pageAccordion && convertHTMLToText(staticPage.description)}
                  {this.renderAccordian()}

                  {staticPage.slug === FOOTER_SLUGS.CONTACT_US && <div className="contactus-static-block">
                    {/* <h3>Customer Service </h3>
                    <p>Any comments, concerns, feedback? Feel free to contact our customer service team who can assist with all kinds of matters. However, before you do, be sure to check out our Help Centre for frequently asked questions, as you might find the answer you need. If not, you can contact us here:</p> */}
                    <div className="headinng-block">{convertHTMLToText(staticPage.description)}</div>
                    <div className="phone-email-block">
                      <div className="w-100">
                        {/* <div className="phone">
                          <p className="title">Phone:</p>
                          <p><a href="tel:+60 123 456 789">{staticPage.phone_number}</a></p>
                        </div> */}
                        <div className="email phone w-100">
                          <p className="title">Email:</p>
                          <p><a href="mailto:info@formee.com">{staticPage.email}</a></p>
                        </div>
                      </div>
                      <div className="w-100 mt-10">
                        <div className="phone postal-add">
                          <p className="title">Postal Address:</p>
                          <div className="address-contacts">
                            {convertHTMLToText(staticPage.address)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="help-text">Need more information? Check out our Help Centre. </div>
                  </div>}
                </div>
              </div>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
}

export default connect(
  mapStateToProps, { enableLoading, disableLoading, getAllStaticPages }
)(withRouter(AboutUs));
