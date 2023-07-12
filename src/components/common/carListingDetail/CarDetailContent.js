import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { toastr } from 'react-redux-toastr';
import { langs } from '../../../config/localization';
import { DatePicker, Layout, message, Row, Col, List, Typography, Carousel, Tabs, Form, Select, Input, Button, Card, Breadcrumb, Table, Tag, Space, Modal, Steps, Progress } from 'antd';
import Icon from '../../customIcons/customIcons';
import { getClassfiedCategoryListing, getBannerById, openLoginModel } from '../../../actions/index';
import history from '../../../common/History';
import { CarouselSlider } from '../../common/CarouselSlider'
import '../bookingDetailCard/bookingDetailCard.less'
import '../bookingCarDetail/bookingCarDetail.less';
import './carListDetail.less';

import { TEMPLATE, DEFAULT_ICON } from '../../../config/Config'
const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const { RangePicker } = DatePicker;
//   Step Form start
const { Step } = Steps;

const steps = [
  {
    content: <StepOne />,
  },
  {
    content: <StepTwo />,
  },
  {
    content: <StepFour />,
  }
];

//   Step Form ends
const tempData1 = [{
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3.0',
  discription: 'Product Heading',
  price: 'AU$120',
  category: 'subcategory',
  location: 'Melbourne',
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3.0',
  discription: 'Product Heading',
  price: 'AU$120',
  category: 'subcategory',
  location: 'Melbourne',
}, {
  image: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
  rate: '3.0',
  discription: 'Product Heading',
  price: 'AU$120',
  category: 'subcategory',
  location: 'Melbourne',
}
];
const data = [
  {
    key: '1',
    Event: <img src={require('../../../assets/images/table-content.png')} alt='Home' width='30' className={'stroke-color'} />,
    decriptn: 'Australian Football League (AFL)Round 1 Richmond v Carlton',
    Date: '19 Mar 20208:00 PM',
    Location: 'Melbourne Cricket Ground, Melbourne, Australia',
    tags: ['Tickets'],

  },

];
const datedata = [
  {
    title: 'Date :',
    desc: 'Sunday, August 14, 2020',
  },
  {

    desc: '1:30 PM',
    title: 'Time :',

  },
  {

    desc: 'Stalls R16, R17, R18, R19',
    title: 'Selected Seat :',

  },
  {

    desc: 'Club Members & Public Reserve 2 Adults, 2 Children ',
    title: 'Ticket Type:',

  },
  {

    desc: <Select placeholder='E-Ticket (emailed)' allowClear className='shadow-input'>
      <Option value='clubmembers'>E-Ticket (emailed)</Option>
      <Option value='clubmembers'>E-Ticket (emailed)</Option>
      <Option value='clubmembers'>E-Ticket (emailed)</Option>
    </Select>,
    title: 'Delivery Method :',

  },


];
const contactdata = [
  {
    title: 'Contact Name :',
    desc: 'Sierra Ferguson',
  },
  {
    title: 'Email Address :',
    desc: 'Sierra@gmail.com',
  },
  {
    title: 'Phone Number:',
    desc: ' 0403 305 196',
  },
];
const columns = [
  {

    title: 'Event',
    dataIndex: 'Event',
    key: 'Event',
    render: text => <a>{text}</a>,
  },
  {

    title: '',
    dataIndex: 'decriptn',
    key: 'decriptn',
    // render: text => <a>{text} <br/> football </a>,
  },
  {
    title: 'Date',
    dataIndex: 'Date',
    key: 'Date',
  },
  {
    title: 'Location',
    dataIndex: 'Location',
    key: 'Location',
  },
  {
    title: 'Get it!',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <a href='' className='yellow-btn' color={color} key={tag}>
              {tag.toUpperCase()}
            </a>
          );
        })}
      </>
    ),
  }
];
const dataPopup = [

  {
    Ticket: 'Club Members & Public Reserve',
    Ticketdetail: 'Adult',
    Price: 'AU$59.00',
    Quantity: <Input type={'number'} defaultValue='1' />,
    Amount: 'AU$59.00',

  },
  {
    Ticket: '',
    Ticketdetail: 'Concession',
    Price: 'AU$59.00',
    Quantity: <Input type={'number'} defaultValue='1' />,
    Amount: 'AU$59.00',

  },
  {
    Ticket: '',
    Ticketdetail: 'Children (6-14)',
    Price: 'AU$59.00',
    Quantity: <Input type={'number'} defaultValue='1' />,
    Amount: 'AU$59.00',

  },
  {
    Ticket: '',
    Ticketdetail: 'Children (1-5)',
    Price: 'AU$59.00',
    Quantity: <Input type={'number'} defaultValue='1' />,
    Amount: 'AU$59.00',

  },



];
const datacolumns = [
  {
    title: 'Ticket type',
    dataIndex: 'Ticket',
    key: 'Ticket',
  },
  {

    title: '',
    dataIndex: 'Ticketdetail',
    key: 'Ticketdetail',
  },
  {
    title: 'Price',
    dataIndex: 'Price',
    key: 'Price',
  },
  {
    title: 'Quantity',
    dataIndex: 'Quantity',
    key: 'Quantity',
  },
  {
    title: 'Amount',
    className: ' text-right',
    dataIndex: 'Amount',
    key: 'Amount',


  }
]

function onChange(value, dateString) {
  
  
}

function onOk(value) {
  
}

function StepOne(props) {
  return (
    <div className='fm-step-one'> <h4 className='fm-input-heading'>Driver's Details</h4>
      <Form>
        <Form.Item label='Driver Name'>
          <Input placeholder={'Enter your first name and last name'} className='shadow-input' />
        </Form.Item>
        <Form.Item label='Driver Age'>
          <Row>
            <Col md={14}> <Input placeholder={'25-70'} className='shadow-input' /></Col>
            <Col md={2} className='text-or text-center'>Or</Col>
            <Col md={8}> <Input placeholder={'Enter your age'} className='shadow-input' /></Col>
          </Row>
        </Form.Item>
        <Form.Item label='Email Address'>
          <Input placeholder={'Enter your email address'} className='shadow-input' />
        </Form.Item>
        <Form.Item label='Phone Number'>
          <Input placeholder={'Enter your phone number'} className='shadow-input' />
        </Form.Item>
        <Form.Item label='Country of residence'>
          <Input placeholder={'Enter your country of residence'} className='shadow-input' />
        </Form.Item>

        <hr />
        <Form.Item className='fm-apply-label' label='Do you have code promo?'>
          <div className='fm-apply-input'>
            <Input placeholder={'Enter promotion code'} enterButton='Search' className='shadow-input' />
            <Button type='primary' className='fm-apply-btn'>Apply</Button>
          </div>
          <Link to='/' className='fm-clear-link'>Clear</Link>
        </Form.Item>
      </Form>
    </div >)
}
function StepTwo(props) {
  return (
    <div className='fm-step-two'> <h4 className='fm-input-heading'>Add more options</h4>
      <div className='sub-text'>
        <p><b>Payable on collection</b></p>
        <p>If you reserve any of these extras, you'll pay for them at the counter.</p>
      </div>

      <Form layout='vertical'>
        <Row gutter={[7, 7]}>
          <Col md={24}>
            <table className='table-data'>
              <tr>
                <td>
                  <h4>Navigation System</h4>
                  <p>Device displaying turn-by-turn navigation directions.</p>
                </td>
                <td className='price'>
                  <h4>$7.00</h4>
                  <p>Device displaying turn-by-turn navigation directions.</p>
                </td>
                <td className='counting-list'>
                  <Form.Item name='' label=''>
                    <Select
                      placeholder='0'
                      allowClear
                      className='shadow-input'
                    >
                      <Option value='0'>0</Option>
                      <Option value='0'>0</Option>
                      <Option value='0'>0</Option>
                    </Select>
                  </Form.Item>
                </td>
                <td className='last-price'>
                  <h4>$0.00</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>Navigation System</h4>
                  <p>Device displaying turn-by-turn navigation directions.</p>
                </td>
                <td className='price'>
                  <h4>$7.00</h4>
                  <p>Device displaying turn-by-turn navigation directions.</p>
                </td>
                <td className='counting-list'>
                  <Form.Item name='' label=''>
                    <Select
                      placeholder='0'
                      allowClear
                      className='shadow-input'
                    >
                      <Option value='0'>0</Option>
                      <Option value='0'>0</Option>
                      <Option value='0'>0</Option>
                    </Select>
                  </Form.Item>
                </td>
                <td className='last-price'>
                  <h4>$0.00</h4>
                </td>
              </tr>
              <tr>
                <td>
                  <h4>Navigation System</h4>
                  <p>Device displaying turn-by-turn navigation directions.</p>
                </td>
                <td className='price'>
                  <h4>$7.00</h4>
                  <p>Device displaying turn-by-turn navigation directions.</p>
                </td>
                <td className='counting-list'>
                  <Form.Item name='' label=''>
                    <Select
                      placeholder='0'
                      allowClear
                      className='shadow-input'
                    >
                      <Option value='0'>0</Option>
                      <Option value='0'>0</Option>
                      <Option value='0'>0</Option>
                    </Select>
                  </Form.Item>
                </td>
                <td className='last-price'>
                  <h4>$0.00</h4>
                </td>
              </tr>
              <tr className='sep-block'>
                <td colSpan='4'>&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <h4>Roadside Assistance</h4>
                </td>
                <td className='price'>
                  <h4>$7.00</h4>
                  <p>per day</p>
                </td>

                <td className='last-price' colSpan='2'>
                  <Button type='default' className='fm-btn fm-back-btn' size={'middle'}>
                    {'Add'}
                  </Button>
                </td>
              </tr>
              <tr className='sep-block'>
                <td colSpan='4'>&nbsp;</td>
              </tr>
              <tr>
                <td>
                  <h4>Roadside Assistance</h4>
                  <ul>
                    <li>Japan</li>
                    <li>New Zealand </li>
                    <li>Italy</li>
                    <li>New York</li>
                    <li>Australia</li>
                    <li>New Zealand</li>
                    <li>Italy</li>
                  </ul>
                </td>
                <td className='price'>
                  <h4>$7.00</h4>
                  <p>per day</p>
                </td>

                <td className='last-price' colSpan='2'>
                  <Button type='default' className='fm-btn fm-back-btn' size={'middle'}>
                    {'Add'}
                  </Button>
                </td>
              </tr>
              <tr className='sep-block'>
                <td colSpan='4'>&nbsp;</td>
              </tr>

            </table>
            <Form layout='vertical'>
              <Form.Item label='Additional Note'>
                <Input placeholder={'Any personal requests? Let us know in English'} className='shadow-input' />
              </Form.Item>

            </Form>


          </Col>


        </Row>
      </Form>
    </div>)
}
function StepFour(props) {
  return (
    <Row gutter={16}>
      <Col className='gutter-row' span={12}>

        <div className='fm-step-four'> <h4 className='fm-input-heading'>Your booking details</h4>
          <Card bordered={false} >
            <Form layout='vertical'>
              {/* <DatePicker suffixIcon={<Icon icon='clock' size='18' />} className='shadow-input' showTime onChange={onChange} onOk={onOk} placeholder='Your currently selected date is: Sat, 4 Feb 2020 1:30 pm' />
            <hr />
            <Form.Item className='fm-apply-label' label='Do you have code promo?'>
                <div className='fm-apply-input'>
                    <Input placeholder={'Enter promotion code'} enterButton='Search' className='shadow-input' />
                    <Button type='primary' className='fm-apply-btn'>Apply</Button>
                </div>
                <Link to='/' className='fm-clear-link'>Clear</Link>
            </Form.Item> */}
              <Row className='border-bottom'>
                <Col md={24} className='fm-user-box'>
                  <div className='fm-user-image'>
                    <img src={require('../../../assets/images/afl-logo-image.jpg')} alt='' />
                  </div>
                  <div className='fm-user-details inner-fourth'>
                    <Text>Australian Football League (AFL)</Text>
                    <Text>Round 1, Richmond v Carlton</Text>
                    <Text className='fm-location'>Location</Text>
                    <Text className='fm-address'>Melbourne Cricket Ground, Melbourne, Australia</Text>
                  </div>
                </Col>
              </Row>
              <div>
                <List className='list-date-time' itemLayout='horizontal' dataSource={datedata} renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<b>{item.title}</b>}
                      description={item.desc}
                    />
                  </List.Item>
                )}
                />

              </div>
              <div className='contac-info'>
                <List className='list-date-time' itemLayout='horizontal' dataSource={contactdata} renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={<b>{item.title}</b>}
                      description={item.desc}
                    />
                  </List.Item>
                )}
                />

              </div>
            </Form></Card>
        </div></Col>
      <Col className='gutter-row' span={12}><div className='fm-step-four'> <h4 className='fm-input-heading'>Your price summary</h4>
        <Card bordered={false} >
          <h5 className='pb-5'>Club Members & Public Reserve</h5>
          <div className='price-section' >
            <Row className='pt-5'>
              <Col md={16} >1 Adult x $59.00</Col>
              <Col md={8} className='text-right'>$59.00</Col>
            </Row>
            <Row className='pt-5'>
              <Col md={16} >1 Concession x $27.00</Col>
              <Col md={8} className='text-right'>$27.00</Col>
            </Row>
            <Row className='pt-5'>
              <Col md={16} >2 Children (6-14) x $20.00</Col>
              <Col md={8} className='text-right'>$20.00</Col>
            </Row>
            <Row className='pt-5'>
              <Col md={16} >Taxes and surcharges</Col>
              <Col md={8} className='text-right'>$5.00</Col>
            </Row></div>
          <Row className=' total-section'>
            <Col md={16} ><b>Total</b></Col>
            <Col md={8} className='text-right'><h4><b>$240.50</b></h4></Col>
          </Row>
        </Card></div>
        <div className='special-note'> <h4 className='fm-input-heading'>Special note</h4></div>
        <Card bordered={false} >
          <p>Please arrive before the gate open 45 minutes.</p>
        </Card>
      </Col>
    </Row>)
}




class CarDetailContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topImages: [],
      bottomImages: [],
      visible: false,
      current: 0,
    }
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  /**
   * @method contactModal
   * @description contact model
   */
  contactModal = () => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.setState({
        visible: true,
      });
    } else {
      this.props.openLoginModel()
    }
  };
  /**
   * @method handleCancel
   * @description handle cancel
   */
  handleCancel = e => {
    this.setState({
      visible: false,
      makeOffer: false,
    });
  };

  /**
  * @method componentDidMount
  * @description called after render the component
  */
  componentDidMount() {
    this.props.getBannerById(2, res => {
      if (res.status === 200) {
        const banner = res.data.data && res.data.data.banners
        this.getBannerData(banner)
      }
    })
  }
  /**
 * @method getBannerData
 * @description get banner detail
 */
  getBannerData = (banners) => {
    const top = banners.filter(el => el.bannerPosition === langs.key.top)
    const bottom = banners.filter(el => el.bannerPosition === langs.key.bottom)
    this.setState({ topImages: top, bottomImages: bottom })
  }
  /**
   * @method selectTemplateRoute
   * @description select tempalte route dynamically
   */
  selectTemplateRoute = (el) => {
    let reqData = {
      id: el.id,
      page: 1,
      page_size: 10
    }
    this.props.getClassfiedCategoryListing(reqData, (res) => {
      if (Array.isArray(res.data.data) && res.data.data.length) {
        let templateName = res.data.data[0].template_slug
        let cat_id = res.data.data[0].id
        if (templateName === TEMPLATE.GENERAL) {
          this.props.history.push(`/classifieds/${TEMPLATE.GENERAL}/${cat_id}`)
        } else if (templateName === TEMPLATE.JOB) {
          this.props.history.push(`/classifieds/${TEMPLATE.JOB}/${cat_id}`)
        } else if (templateName === TEMPLATE.REALESTATE) {
          this.props.history.push(`/classifieds/${TEMPLATE.REALESTATE}/${cat_id}`)
        }
      } else {
        toastr.warning(langs.warning, langs.messages.classified_list_not_found)
      }
    })
  }
  /**
  * @method renderCategoryList
  * @description render category list
  */
  renderCategoryList = () => {
    return this.props.classifiedList.map((el) => {
      let iconUrl = `${this.props.iconUrl}${el.id}/${el.icon}`
      return <li key={el.key} onClick={() => this.selectTemplateRoute(el)}>
        <div className={'item'}>
          <img onError={(e) => {
            e.target.onerror = null;
            e.target.src = DEFAULT_ICON
          }}
            // alt={data.title ? data.title : ''}
            src={iconUrl} alt='Home' width='30' className={'stroke-color'} />
          <Paragraph className='title'>{el.name}</Paragraph>
        </div>
      </li>
    })
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { current } = this.state;
    const { isLoggedIn } = this.props;
    const { topImages, bottomImages } = this.state
    return (

      <div className='car-list-detail car-detail-content'>
        <div className={'booking-detail-card booking-car-detail '}>
          <Row>
            <Col span={7}>
              <img
                //alt={tempData.discription}
                src={require('../../../assets/images/whitecar.png')}
              />
            </Col>
            <Col span={6} className='car-detail-left'>
              <h2>Camry Ascent<br /> Sport</h2>
              <Paragraph className='small-sub-text'>or similar</Paragraph>
              <Paragraph className='small-sub-text inter-text'>Intermediate</Paragraph>
              <div className='more-detail'>More Specs</div>
            </Col>
            <Col span={10}>
              <Row>
                <Col span={12}>
                  <div className='car-info align-left inter-text'><strong>4 Seats  I   4 Doors</strong></div>
                  <div className='similar-sub-text cancel-text'> Free Cancellation</div>
                  <div className='rate-section'>
                    {'3.0'}
                    <div className='review-text'>320 reviews</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className='price-box'>
                    <div className='price'>
                      {'AU$75'}
                      <Paragraph className='sub-text'>per day</Paragraph>
                      <div className='alert-info-text'>We have 5 left</div>
                    </div>
                  </div>
                </Col>
                <Col span={24} className='detail-block-two'>
                  <ul>
                    <li><span> <img
                      //alt={tempData.discription}
                      src={require('../../../assets/images/product_hunt.png')}
                    /></span><span>Automatic</span></li>
                    <li><span> <img
                      //alt={tempData.discription}
                      src={require('../../../assets/images/dashboard.png')}
                    /></span><span>Unlimited Mileage</span></li>
                    <li><span> <img
                      //alt={tempData.discription}
                      src={require('../../../assets/images/air-condition.png')}
                    /></span><span>Air conditioning</span></li>
                    <li><span> <img
                      //alt={tempData.discription}
                      src={require('../../../assets/images/fule.png')}
                    /></span><span>Full to Full</span></li>
                  </ul>
                </Col>
                <Col span={24} className='detail-block-three'>
                  <div className='europcar'>
                    <img
                      //alt={tempData.discription}
                      src={require('../../../assets/images/euro.png')}
                    /></div>
                  <Paragraph className='sub-text small-sub-text'>Service provided by partner</Paragraph>
                  <div className='gray-box-detail'>
                    <h3>We give you the following for FREE</h3>
                    <ul>
                      <li><i className='icomoon icon-checkmark'></i>Basic rental fee</li>
                      <li>Theft Protection</li>
                      <li>Amendments</li>
                      <li>Collision Damage Waiver</li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div className={'booking-detail-card booking-car-detail '}>
          <div className='pick-drop-content-block'>
            <Row className='heading-block'>
              <Col span={12}>
                <h3 className='heading'>Pick-up Location</h3>
              </Col>
              <Col span={12}>
                <h3>Drop-off Location</h3>
              </Col>
            </Row>
            <Row className='content-block'>
              <Col span={12}>
                <h4>Melbourne Airport (MEL)</h4>
                <p>Wednesday, 29 Jan 2020 <b>12:30 PM</b></p>
              </Col>
              <Col span={12}>
                <h4>Melbourne Airport (MEL)</h4>
                <p>Wednesday, 29 Jan 2020 <b>12:30 PM</b></p>
              </Col>
            </Row>
            <hr />
            <Row className='content-block-two'>
              <Col span={12}>
                <h4> <img
                  //alt={tempData.discription}
                  src={require('../../../assets/images/euro.png')}
                /> Melbourne Airport (MEL)</h4>
                <p>Wednesday, 29 Jan 2020 <b>12:30 PM</b></p>
                <div className='pickup-instruc'>
                  <h4>Pick-up instructions</h4>
Make your way to T2 at Melbourne Airport, cross over to the 2nd lane opposite T2 and walk to the off airport shuttle bus pickup and drop off area.
</div>
                <div className='pickup-contact-detail'>
                  <h4>Contact Number</h4>
                  <div className='number'>+61-3-5227 9855</div>
                </div>
              </Col>
              <Col span={12}>
                <h4> <img
                  //alt={tempData.discription}
                  src={require('../../../assets/images/euro.png')}
                /> Melbourne Airport (MEL)</h4>
                <p>Wednesday, 29 Jan 2020 <b>12:30 PM</b></p>
                <div className='pickup-instruc'>
                  <h4>Pick-up instructions</h4>
Make your way to T2 at Melbourne Airport, cross over to the 2nd lane opposite T2 and walk to the off airport shuttle bus pickup and drop off area.
</div>
                <div className='pickup-contact-detail'>
                  <h4>Contact Number</h4>
                  <div className='number'>+61-3-5227 9855</div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className={'booking-detail-card booking-car-detail payable-summary'}>
          <table>
            <tr>
              <td>
                <h3>Summery</h3>
                <p>Price for 3 days</p>
              </td>
              <td className='text-right' colSpan='2'>
                <div className='price-block-left-detail'>
                  <table>
                    <tr>
                      <td><p>Original Price  $</p></td>
                      <td><p> <p>225.00</p></p></td>
                    </tr>
                    <tr>
                      <td> <p className='red'>Your Savings 5% off  $</p></td>
                      <td> <p className='red'>-11.25</p></td>
                    </tr>
                    <tr>
                      <td><p>Taxes and surcharges  $</p></td>
                      <td><p>10.00</p></td>
                    </tr>
                    <tr>
                      <td><p className='total'><b>Total Price  $</b></p></td>
                      <td><p className='total'><b>223.75</b></p></td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan='3' >
                <div className='sep'>&nbsp;</div>
              </td>
            </tr>
            <tr className='payable-detail'>
              <td>
                <h3>Payable Now <span>(in Australian Dollars)</span></h3>
              </td>
              <td>
                <div className='price-block-left-detail'>
                  <table>
                    <tr>
                      <td><p className='total'><b>Total Price  $</b></p></td>
                      <td><p className='total'><b>225.00</b></p></td>
                    </tr>
                  </table>
                </div>
              </td>
              <td>
                <Button type='default' size={'middle'} onClick={this.contactModal}>
                  {'Reserve'}
                </Button>
              </td>
            </tr>
          </table>
        </div>
        <Modal
          title='Reserve'
          visible={this.state.visible}
          className={'custom-modal style1 car-reserve-modal'}
          footer={false}
          onCancel={this.handleCancel}
        >
          <div className='padding'>
            <Row className='car-pick-drop-block'>
              <Col md={4}>
                <img src={require('../../../assets/images/whitecar.png')} />
              </Col>
              <Col md={20}>
                <h2>Camry Ascent Sport</h2>
                <Paragraph className='small-sub-text inter-text'>Intermediate</Paragraph>
                <Row className='pick-drop-text-detail'>
                  <Col md={10}>
                    <span className='pick'>Pick-up</span>
                    <span className='location'>Melbourne Airport (MEL)</span>
                    <span className='date'>Wednesday, 29 Jan 2020 12:30 PM</span>
                  </Col>
                  <Col md={10}>
                    <span className='pick'>Drop-off</span>
                    <span className='location'>Avalon Airport (AVV)</span>
                    <span className='date'>Fridayday, 31 Jan 2020 12:30 PM</span>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={22}>
                <div className='fm-step-form'>

                  {/* <Row>
                                        <Col md={24} className='fm-user-box'>
                                            <div className='fm-user-image'>
                                                <img src={require('../../../assets/images/afl-logo-image.jpg')} alt='' />
                                            </div>
                                            <div className='fm-user-details'>
                                                <Text>Australian Football League (AFL)</Text>
                                                <Text>Round 1, Richmond v Carlton</Text>
                                                <Text className='fm-location'>Location</Text>
                                                <Text className='fm-address'>Melbourne Cricket Ground, Melbourne, Australia</Text>
                                            </div>
                                        </Col>
                                    </Row> */}
                  <Progress strokeColor={{ '0%': '#FFC468', '100%': '#FFC468' }} trailColor={{ '0%': '#E3E9EF', '100%': '#E3E9EF' }} percent={50} showInfo={false} />
                  <div className='steps-content'>

                    {steps[current].content}
                    {/* {this.renderContent(current)} */}
                    {/* {current === 0 ? <StepOne /> : <StepTwo/>} */}
                  </div>
                  <div className='steps-action' justify='end'>
                    {current > 0 && (
                      <Button style={{ margin: '0 8px' }} className='fm-btn fm-back-btn' onClick={() => this.prev()}>
                        Back
                      </Button>
                    )}
                    {current < steps.length - 1 && (
                      <Button type='primary' className='fm-btn fm-next-btn' onClick={() => this.next()}>
                        Next
                      </Button>
                    )}
                    {current === steps.length - 1 && (
                      <Button type='primary' className='fm-btn red-btn' onClick={() => message.data('Processing complete!')}>
                        Pay
                      </Button>
                    )}
                  </div>

                </div>


              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { savedCategories, categoryData } = common;
  let classifiedList = []
  let isEmpty = savedCategories.data.booking.length === 0 && savedCategories.data.retail.length === 0 && savedCategories.data.classified.length === 0 && (savedCategories.data.foodScanner === '' || (Array.isArray(savedCategories.data.foodScanner) && savedCategories.data.foodScanner.length === 0))
  if (auth.isLoggedIn) {
    if (!isEmpty) {
      isEmpty = false
      classifiedList = savedCategories.data.classified && savedCategories.data.classified.filter(el => el.pid === 0);
    } else {
      isEmpty = true
      classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
    }
  } else {
    isEmpty = true
    classifiedList = categoryData && Array.isArray(categoryData.classified) ? categoryData.classified : []
  }
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    iconUrl: categoryData.classifiedAll !== undefined ? common.categoryData.classifiedAll.iconurl : '',
    classifiedList,
    isEmpty
  };
};
export default connect(
  mapStateToProps,
  { getClassfiedCategoryListing, getBannerById, openLoginModel }
)(CarDetailContent);