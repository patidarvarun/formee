import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router'
import { Layout, Row, Col, Typography, Divider } from 'antd';
import { TEMPLATE } from '../../config/Config'
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization';
import Newsletter from '../../components/newsletter/index';
import { FOOTER_SLUGS } from '../../config/Constant'
import { getClassifiedCatLandingRoute, getBookingCatLandingRoute, getRetailCatLandingRoutes } from '../../common/getRoutes'
import { fetchMasterDataAPI, getUserMenuList, getClassfiedCategoryListing } from '../../actions/index';
import './footer.less';
const { Footer } = Layout;
const { Title, Text } = Typography;

class AppFooter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookingList: [],
      retailList: [],
      classifiedList: [],
      isEmpty: false,
      redirectTo: null
    };
  }

  /**
* @method renderSubcategory
* @description render subcategory based on category type
*/
  renderSubcategory = (categoryType, key) => {
    if (categoryType && categoryType !== undefined) {
      return categoryType.map((data, i) => {
        return (
          <li key={i} onClick={() => {
            if (key === langs.key.classified || key === langs.key.booking || key === langs.key.retail) {
              this.selectTemplateRoute(data, key)
            }
          }} style={{ cursor: 'pointer' }}>{key === langs.key.retail ? data.text : data.name}
          </li>
        )
      });
    }
  }

  /**
  * @method selectTemplateRoute
  * @description decide template to navigate the logic
  */
  selectTemplateRoute = (el, key) => {
    
    if (key === langs.key.classified) {
      let reqData = {
        id: el.id,
        page: 1,
        page_size: 10
      }

      this.props.getClassfiedCategoryListing(reqData, (res) => {
        if (res.status === 200) {
          if (Array.isArray(res.data.data) && res.data.data.length) {
            let templateName = res.data.data[0].template_slug
            let cat_id = res.data.data[0].id;
            let path = ''
            if (templateName === TEMPLATE.GENERAL) {
              path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, el.name)
              this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
              let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, el.name)
              this.props.history.push(route);
            } else if (templateName === TEMPLATE.REALESTATE) {
              path = getClassifiedCatLandingRoute(TEMPLATE.REALESTATE, cat_id, el.name)
              this.props.history.push(path)
            }
          } else {
            // toastr.warning(langs.warning, langs.messages.classified_list_not_found)
            let templateName = el.template_slug
            let cat_id = el.id;
            let path = ''
            if (templateName === TEMPLATE.GENERAL) {
              path = getClassifiedCatLandingRoute(TEMPLATE.GENERAL, cat_id, el.name)
              this.props.history.push(path)
            } else if (templateName === TEMPLATE.JOB) {
              let route = getClassifiedCatLandingRoute(TEMPLATE.JOB, cat_id, el.name)
              this.props.history.push(route);
            } else if (templateName === TEMPLATE.REALESTATE) {
              path = getClassifiedCatLandingRoute(TEMPLATE.REALESTATE, cat_id, el.name)
              this.props.history.push(path)
            }
          }
        }
      })
    } else if (key === langs.key.booking) {
      let slug = el.slug
      if (slug === TEMPLATE.HANDYMAN) {
        let path = getBookingCatLandingRoute(TEMPLATE.HANDYMAN, el.id, el.name)
        this.props.history.push(path)
      } else if (slug === TEMPLATE.BEAUTY) {
        let path = getBookingCatLandingRoute(TEMPLATE.BEAUTY, el.id, el.name)
        this.props.history.push(path)
      } else if (slug === TEMPLATE.EVENT) {
        let path = getBookingCatLandingRoute(TEMPLATE.EVENT, el.id, el.name)
        this.props.history.push(path)
      } else if (slug === TEMPLATE.WELLBEING) {
        let path = getBookingCatLandingRoute(TEMPLATE.WELLBEING, el.id, el.name)
        this.props.history.push(path)
      } else if (slug === TEMPLATE.RESTAURANT) {
        let path = getBookingCatLandingRoute(TEMPLATE.RESTAURANT, el.id, el.name)
        this.props.history.push(path)
      } else if (slug === TEMPLATE.PSERVICES || 'Professional Services') {
        let path = getBookingCatLandingRoute(TEMPLATE.PSERVICES, el.id, el.name)
        this.props.history.push(path)
      } else if (slug === TEMPLATE.SPORTS) {
        let path = getBookingCatLandingRoute(TEMPLATE.SPORTS, el.id, el.name)
        this.props.history.push(path)
      }
    } else if (key === langs.key.retail) {
      let path = getRetailCatLandingRoutes(el.id, el.slug)
      this.props.history.push(path)
    } 
  }

  render() {
    return (
      <Footer className='footer'>
        <div className='footer-wrap'>
          <Row align="middle">
            <Col className='footer-logo' span={18}>
              <img src={require('../../assets/images/formee-logo-white.svg')} alt='Formee' />
            </Col>
            <Col className="d-flex get-social" span={6} >
              <Text > Get Social </Text>
              <div className='social-link'>
                <Link target="_blank" to= { { pathname:'https://www.instagram.com/formee.app/?hl=en'} } className="mr-10 ml-10">
                  <img src={require('../../assets/images/instagram.svg')}></img>
                </Link>
               
                <Link target="_blank" to= { { pathname:'https://www.facebook.com/formeeapplication' } } className="mr-10">
                  <img src={require('../../assets/images/facebook.svg')} ></img>
                </Link>


                <Link to='/' className="mr-10">
                  <img src={require('../../assets/images/Twitter.svg')} ></img>
                </Link>
                <Link target="_blank" to= { { pathname:'https://www.linkedin.com/company/formee-pty-ltd'} } className="">
                  <img src={require('../../assets/images/LinkedIn.svg')} ></img>
                </Link>
              </div>
            </Col>
          </Row>
          <Divider />
          <Row>
            <Col md={5}>
              <Title level={4} className='text-normal'>About</Title>
              <ul>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.ABOUT_US}`}>About us</Link></li>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.CAREERS}`}>Careers</Link></li>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.CONTACT_US}`}>Contact us</Link></li>
              </ul>

            </Col>

            <Col md={5}>
              <Title level={4} className='text-normal'>Join Us</Title>
              <ul>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.JOIN_FORMEE}`}>Register with Formee</Link></li>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.PARTNERSHIPS}`}>Partnerships</Link></li>
                <li><Link to='/mobile-app/screen'>Download Mobile App</Link></li>
              </ul>
            </Col>
            <Col md={5}>
              <Title level={4} className='text-normal'>Help Center</Title>
              <ul>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.SERVICES}`}>Services</Link></li>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.HOW_IT_WORKS}`}>How it works</Link></li>
                <li><Link to='/faq'>FAQs</Link></li>
              </ul>

            </Col>
            <Col md={5}>
              <Title level={4} className='text-normal'>Legal</Title>
              <ul>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.TERMS_OF_USE}`}>Terms of Use</Link></li>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.PRIVACY_POLICY}`}>Privacy Policy</Link></li>
                <li><Link to={`/footer-pages/${FOOTER_SLUGS.POSTING_POLICY}`}>Posting Policy</Link></li>
              </ul>

            </Col>
            <Col md={4}>
              <div className='app-link'>
                <Text className='text-getapp mr-10 mb-10'>Get the App</Text><br />
                <Link target="_blank" to= {{ pathname:'https://play.google.com/store/apps/details?id=com.pws.formee&hl=en_US'}} >
                  <img className="mb-10 mt-20" src={require('../../assets/images/google-play.png')} alt='Google Play' />
                </Link><br />
                <Link target="_blank" to={{ pathname:'https://apps.apple.com/pk/app/formee/id1245080932'}} >
                  <img className="mb-10" src={require('../../assets/images/app-store.png')} alt='App Store' />
                </Link>
              </div>
            </Col>
            <Divider />
            <Col md={24}>
              <Newsletter />
              {/* <Row className='mb-30'>
              <Col md={12}>
                <Title level={4} className='text-normal'>About</Title>
                <ul>
                  <li><Link to='/formee/About-Us'>About us</Link></li>
                  <li><Link to='/'>Careers</Link></li>
                  <li><Link to='/formee/Contact-Us'>Contact us</Link></li>
                </ul>
              </Col>
              <Col md={12}>
                <Title level={4} className='text-normal'>Join Us</Title>
                <ul>
                  <li><Link to='/formee/Partnerships'>Partnerships</Link></li>
                  <li><Link to='/formee/mobile-app/screen'>Download Mobile App</Link></li>
                  {/* <li><Link to='/'>Download</Link></li> */}
              {/* </ul>
              </Col>
              </Row> */}
              {/* <Row>
                <Col md={12}>
                  <Title level={4} className='text-normal'>Help Center</Title>
                  <ul>
                    <li><Link to='/formee/Services'>Services</Link></li>
                    <li><Link to='/'>Account</Link></li>
                    <li><Link to='/faq'>FAQs</Link></li>
                    {/* <li><Link to='/'>Question?</Link></li> */}
              {/* </ul>
                </Col>
                <Col md={12}>
                  <Title level={4} className='text-normal'>Contact</Title>
                  <ul>
                    <li><a href='tel:+61-426 839 225'>+61-426 839 225</a></li>
                    <li><a href='mailto:info@formee.com.au'>info@formee.com.au</a></li>
                  </ul>
                </Col>
              </Row> */}
            </Col>
          </Row>
          <div className='footer-bottom'>
            <ul>
              <li>© 2021 formee express All rights reserved.</li>
              {/* <li><Link to='/formee/Posting-Policy'>Posting Policy</Link></li>
              <li><Link to='/formee/Privacy-Policy'>Privacy Policy</Link></li>
              <li><Link to='/formee/T&C-and-Legal-Notices'>T&C</Link></li> */}
            </ul>
            {/* <div className='social-link'>
              <Link to='/'>
                <Icon icon='facebook' size='30' />
              </Link>
              <Link to='/'>
                <Icon icon='instagram' size='33' />
              </Link>
            </div>
            <div className='app-link'>
              <Text className='text-getapp mr-10'>Get the App</Text>
              <Link to='/'>
                <img src={require('../../assets/images/google-play.png')} alt='Google Play' />
              </Link>
              <Link to='/'>
                <img src={require('../../assets/images/app-store.png')} alt='App Store' />
              </Link>
            </div> */}
          </div>

        </div>
      </Footer>
    )
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { savedCategories, categoryData } = common;
  let classifiedList = [], bookingList = [], retailList = [], foodScanner = '';
  classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
  bookingList = categoryData && Array.isArray(categoryData.booking.data) ? categoryData.booking.data : []
  retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []

  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    classifiedList, bookingList, retailList, foodScanner,
  };
};
export default connect(
  mapStateToProps,
  { fetchMasterDataAPI, getUserMenuList, getClassfiedCategoryListing }
)(withRouter(AppFooter));

