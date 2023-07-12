import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../../sidebar';
import { Layout, Row, Col, Rate, Typography, Card, Tabs, Form, Input, Select,Carousel ,Checkbox, Button, Breadcrumb, Space, Slider } from 'antd';
import Icon from '../../../../components/customIcons/customIcons';
import { getBannerById } from '../../../../actions/index';
import { getClassfiedCategoryListing, getClassfiedCategoryDetail } from '../../../../actions/classifieds';
import { getChildCategory } from '../../../../actions'
import DetailCard from '../../../common/DetailCard'
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider';
import BannerCard from '../../../common/bannerCard/BannerCard'
import BookingDetailCard from '../../../common/bookingDetailCard/BookingDetailCard';
import './cinemas.less'


export default class CinemasLandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: []
        };
    }
    render() {
        
        const { TabPane } = Tabs;
        const { Title, Text } = Typography;
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 6 ,
          slidesToScroll: 1
        };
        const threeslider = {
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 1
        };
        
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} />
                    <Layout>
                      <div className='cinema-banner'>
                      <Row gutter={16} className='baner-slider'>
                           <Col md={24} className='inner-banner'>
                               
                            <div className='banner-content'>
                            <div className='banner-text'>
                                <h2 > Find session time</h2>
                            </div>
                            <div className='d-flex'>
                               <Button className='black-btn' type='primary'>By Cinema </Button>
                               <Button className='black-btn' type='primary'>By Movie </Button>
                            </div>
                            </div>
                            </Col> 
                            <Col>
                            <Tabs defaultActiveKey='1'>
                                <TabPane tab='Now Showing' key='1'>
                                   <div className=''>
                                       {/* slider */}
                                       <Carousel {...settings} >
    <div className='list-slider'>
       <img src={require('../../../../assets/images/cinema/showing-slider1.png')} />
      
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/showing-slider.png')} />
      
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/showing-slider2.png')} />
     
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/showing-slider3.png')} />
      
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/showing-slider4.png')} />
     
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/showing-slider5.png')} />
      
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/showing-slider6.png')} />
      
    </div>
  </Carousel>
                                   </div>
                                </TabPane>
                                
                                <TabPane tab='Coming Soon' key='2'>
                               Coming Soon
                                </TabPane>
                            </Tabs>,
                            </Col>
                            </Row>
                            </div>
                            <Row gutter={16}>
                            <Col className='film-section' >
                            <Title className='section-heading mb-10'>Films Showing Today</Title>
                            <Text className='sub-title'>See all films & session times</Text>
                            <Carousel {...threeslider} className='film-shows' >
    <div className='list-slider'>
       <img  src={require('../../../../assets/images/cinema/film3.png')} />
       <div className='slider-content'>
      <Text>MA15+</Text>
      <Title level={3}>The Irish Man</Title></div>
      <div className='clients-logo'>
      <img src={require('../../../../assets/images/cinema/clientlogo1.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo2.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo3.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo4.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo5.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo6.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo7.png')}/>
      </div>
      {/* <img src={require('../../../../assets/images/cinema/complain-list.png')}/> */}
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/film1.png')} />
    <div className='slider-content'>
      <Text>MA15+</Text>
      <Title level={3}>1917</Title></div>
      <div className='clients-logo'>
      <img src={require('../../../../assets/images/cinema/clientlogo1.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo2.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo3.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo4.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo5.png')}/>
     
      </div>
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/film2.png')} />
    <div className='slider-content'>
      <Text>MA15+</Text>
      <Title level={3}>Ford V Ferrary</Title></div>
      <div className='clients-logo'>
      <img src={require('../../../../assets/images/cinema/clientlogo1.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo2.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo3.png')}/>
      <img src={require('../../../../assets/images/cinema/clientlogo4.png')}/>
      
      </div>
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/film3.png')} />
      
    </div>
    <div className='list-slider'>
    <img src={require('../../../../assets/images/cinema/film3.png')} />
     
    </div>
    
  </Carousel>
                            </Col>
                            </Row>
                            <Row>
                            <Col className='event-cinema'>
                              {/* Experience event cinema */}
                              <h2 className='section-heading pb-30' >Experience Event Cinemas </h2>
                              <Row  gutter={16}>
                                  <Col offset={3} span={9} className='mb-15' >
                                  <img src={require('../../../../assets/images/cinema/event1.png')} width='100%' />
                                  </Col>
                                  <Col  md={9} className='mb-15'>
                                  <img src={require('../../../../assets/images/cinema/event2.png')} width='100%' />
                                  </Col>
                                  <Col offset={3} md={6} span='' className='mb-10'>
                                  <img src={require('../../../../assets/images/cinema/event3.png')} width='100%' />
                                  </Col>
                                  <Col  md={6} span='' className='mb-10'>
                                  <img src={require('../../../../assets/images/cinema/event4.png')} width='100%' />
                                  </Col>
                                  <Col md={6} span='' className='mb-10'>
                                  <img src={require('../../../../assets/images/cinema/event5.png')} width='100%' />
                                  </Col>
                              </Row>
                            </Col>
                            </Row>
                        
                        </Layout>
                        </Layout>
                        </Layout>
        )
}
}