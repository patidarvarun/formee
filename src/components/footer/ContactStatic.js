import React, { Component, Fragment } from 'react';
import AppSidebar from '../sidebar/HomeSideBarbar';
import { Layout, Breadcrumb, Typography, Collapse, Row, Col, Form, Input, InputNumber, Button, Select} from 'antd';
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

const layout = {
  wrapperCol: { span: 24 },
};

const { Option } = Select;
const { TextArea } = Input;


class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticPage: {}
    }
  }

  

  componentDidMount() {
    const slug = this.props.match.params.slug;

    const requestData = { slug: FOOTER_SLUGS.CONTACT_US }

    this.props.enableLoading()
    this.props.getAllStaticPages(requestData, res => {

      this.props.disableLoading()
      if (res.status === 1) {
        this.setState({ staticPage: res.data })
      }
    })
  }


  getbannerImage = () => {
    const { staticPage } = this.state;
    return <img 
    //src={staticPage.banner_image}
    src={require('../../assets/images/contactus-banner.jpg')}
     loading='lazy' alt={require('../../assets/images/contactus-banner.jpg')} /> 
     }

  render() {
    const { staticPage } = this.state;
    
    return (
      <div className='App cms-static-template contact-static-template'>
        <Layout>
          <Layout>
            <Layout>
              <div className="newdesign-width">                
                <div className="banner-block">
                <h3 className="contact-title">Contact Us</h3>
                  {this.getbannerImage()}
                  <div className="getin-touch-form-block">
                    <h2>Get In Touch</h2>
                    <p className="subtitle">Please fill out the form</p>
                    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}

    >
      <Form.Item
        name="username"
      >
        <Input placeholder="NAME" />
      </Form.Item>
      <Form.Item
        name="email"
      >
        <Input placeholder="EMAIL ADDRESS" />
      </Form.Item>
      <Form.Item
        name="password"
      >
 <Input.Group compact>
      <Select defaultValue="COUNTRY CODE" placeholder="COUNTRY CODE" style={{ width: 160 }}>
        <Option value="+91">+91</Option>
        <Option value="+95">+95</Option>
      </Select>
      <Input  defaultValue="PHONE NUMBER" placeholder="PHONE NUMBER" className="phone-number" />
    </Input.Group>

      </Form.Item>
     
      <Form.Item
        name="message"
      >
      <TextArea showCount maxLength={100}  placeholder="MESSAGE" rows={10} />
      </Form.Item>   
    
      <Form.Item >
        <Button type="primary" htmlType="submit">
          SEND
        </Button>
      </Form.Item>
    </Form>
                    
                  </div>
                </div>
              </div>
              <div className="container-block" >
                <div className="body-content">                  
                  <div className="white-bg">
                  <div className="title-heading">{staticPage.title}</div>
                  {(Array.isArray(staticPage.pageAccordion) && staticPage.pageAccordion.length > 0) &&
                    <div className="title-sub-heading">{convertHTMLToText(staticPage.description)}</div>}
                     <div className="headinng-block">{convertHTMLToText(staticPage.description)}</div>
                     </div>
                  <div className="contactus-static-block test">
                    <div className="phone-email-block">
                      
                      <div className="address-contacts">
                            {convertHTMLToText(staticPage.address)}                            
                          </div>
                    </div>
                    {/* <div className="help-text">Need more information? Check out our Help Centre. </div> */}
                  </div>                
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
