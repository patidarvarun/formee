import React, { Component, Fragment } from 'react';
import AppSidebar from '../sidebar/HomeSideBarbar';
import { Layout, Breadcrumb, Typography, Collapse, Row, Col } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import history from '../../common/History';
import { connect } from 'react-redux';
import { enableLoading, disableLoading, } from '../../actions/index'
import { getFaqPage } from '../../actions/StaticPages';
import { convertHTMLToText } from '../common';
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;


function callback(key) {
  
}

class FAQPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticPage: [],
      selectedFaq: ''
    }
  }
  componentDidMount() {
    const slug = this.props.match.params.slug;
    const requestData = { slug }
    this.props.enableLoading()
    this.props.getFaqPage(res => {
      this.props.disableLoading()
      if (res.status === 1) {
        this.setState({ staticPage: res.data, selectedFaq: res.data[0] })
      }
    })
  }

  displayQuestion = (item) => {
    const question = item.map((item, index) => (
      <Fragment>
        <Collapse defaultActiveKey={['1']} onChange={callback}>
          <Panel header={item.question} key={index}>
            {convertHTMLToText(item.answer)}
          </Panel>
        </Collapse>
      </Fragment >
    ))

    return question;
  }

  renderFaq = () => {
    const {  selectedFaq } = this.state;
    const displayFaqs = selectedFaq.faq.map((faqItem, fIndex) => {
      return (
        <Fragment key={faqItem.id}>
          <Collapse defaultActiveKey={['0']} onChange={callback}>
            <Panel header={faqItem.question} key={fIndex}>
            <Fragment>
                  {convertHTMLToText(faqItem.answer)}
                </Fragment>           
            </Panel> 
          </Collapse>
        </Fragment>
      )
    })
    return displayFaqs
  }

  render() {
    const { staticPage, selectedFaq } = this.state;
    return (
      <div className='App cms-static-template'>
        <Layout>
          <Layout>
            <Layout>
            <div className="newdesign-width">
              <div className="banner-block">
                <img src={require('../../assets/images/Footer Banner/FAQ.jpg')} alt='' />
              </div>
              </div>
              <div className="container-block" >
                <div className="faq-body-content">
                  <Row gutter={30}>
                    <Col xs={24} sm={24} md={5} lg={5}>
                      <ul class="left-link-block">
                        {staticPage.map((faqItem, fIndex) => {
                          return (
                            <li onClick={() => this.setState({ selectedFaq: faqItem })} className={selectedFaq.id === faqItem.id ? "active" : ''}>{faqItem.name}</li>
                          )
                        })}

                      </ul>
                    </Col>
                    <Col xs={24} sm={24} md={19} lg={19}>
                      {selectedFaq && this.renderFaq()}
                    </Col>
                  </Row>
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
  mapStateToProps, { enableLoading, disableLoading, getFaqPage }
)(withRouter(FAQPage));
