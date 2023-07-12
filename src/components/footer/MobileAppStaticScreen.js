import React, { Component, Fragment } from 'react';
import { Layout, Breadcrumb, Typography, Collapse, Row, Col } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { enableLoading, disableLoading, } from '../../actions/index'
import { getAllStaticPages } from '../../actions/StaticPages';
import './cmstemplate.less';


class MobileAppScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      staticPage: {}
    }
  }

  render() {
    return (
      <div className='App cms-static-template'>
        <Layout>
          <Layout>
            <Layout>
              <div className="banner-block">
              <h3 className="download-mobile-app contact-title">Download Mobile App</h3>
                {/* <img src={require('../../assets/static-pages-banner/mobile-app-banner.jpg')} alt='' /> */}
                <img src={require('../../assets/images/mobile-app-bg.jpg')} alt='' className='mobile-app-bg' />
                <div className='mobile-app-content'>
                  <div className='content-left'>
                    <img src={require('../../assets/images/mobile-img.png')} alt='' />
                  </div>
                  <div className='content-right'>
                    <Typography.Title level={2}>{'Download Formee Mobile App Now!'}</Typography.Title>
                    <div className='btn-section'>
                      <img src={require('../../assets/images/bar-code.png')} alt='' />
                      <span className='or'>or</span>
                      <div>
                        <Link target="_blank" to= {{ pathname:'https://play.google.com/store/apps/details?id=com.pws.formee&hl=en_US'}} >
                          <img src={require('../../assets/images/google-play-btn.png')} alt='Google Play' />
                        </Link>
                        <br />
                        <Link className='mt-6 inline-block' target="_blank" to={{ pathname:'https://apps.apple.com/pk/app/formee/id1245080932'}} >
                          <img src={require('../../assets/images/app-store-btn.png')} alt='App Store' />
                        </Link>
                      </div>
                    </div>
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
)(withRouter(MobileAppScreen));
