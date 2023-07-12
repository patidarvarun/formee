import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../../sidebar';
import { Layout, Row, Col, Rate, Typography, Card, Content ,Tabs, Form, Input, Select,Carousel ,Checkbox, Button, Breadcrumb, Space, Slider } from 'antd';
import Icon from '../../../../components/customIcons/customIcons';
import { getBannerById } from '../../../../actions/index';
import { getClassfiedCategoryListing, getClassfiedCategoryDetail } from '../../../../actions/classifieds';
import { getChildCategory } from '../../../../actions'
import DetailCard from '../../../common/DetailCard'
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider';
import BannerCard from '../../../common/bannerCard/BannerCard'
import BookingDetailCard from '../../../common/bookingDetailCard/BookingDetailCard';
import {SearchOutlined } from '@ant-design/icons';   
import './cinemas.less'


export default class MovieLandingPage extends React.Component {

    // constructor(props) {    
    //     super(props);
    //     this.state = {
    //         key: 'tab1',
    //         noTitleKey: 'app',
    //         classifiedList: []
    //     };
        
    // };   
  
      
    render() {
         const { Option } = Select;
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
                            <div className='pt-20'>
                            <Select defaultValue='Select a Movie' className='line-select' >
                                <Option value='jack'>Select a Movie</Option>
                                <Option value='lucy'>Lucy</Option>
                                <Option value='disabled' disabled>
                                    Disabled
                                </Option>
                                <Option value='Yiminghe'>yiminghe</Option>
                             </Select> 
                             <Select defaultValue='Select a Location' className='line-select' >
                                <Option value='jack'>Select a Location</Option>
                                <Option value='lucy'>Lucy</Option>
                                <Option value='disabled' disabled>
                                    Disabled
                                </Option>
                                <Option value='Yiminghe'>yiminghe</Option>
                             </Select> 
                             <Button className='search-btn'><SearchOutlined /></Button>
                            </div>
                            </div>
                            
                            </Col> 
                            
                            </Row>
                            </div>
                            <div  className='film-section p-20'>
                            <Tabs defaultActiveKey='1' className='cinemas-tabs'>
                                <TabPane tab='Now Showing' key='1' >
                                <Row gutter={16}> 
                            <Col  md={8}>
                            <div className='list-slider'>
                                <img src={require('../../../../assets/images/cinema/film3.png')} width='100%'/>
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
                            </div>
                            </Col>
                            <Col md={8}>
                            <div className='list-slider'>
                                <img src={require('../../../../assets/images/cinema/film2.png')} width='100%' />
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
                            </Col>
                            <Col md={8}>
                            <div className='list-slider'>
                                <img src={require('../../../../assets/images/cinema/film1.png')} width='100%' />
                                <div className='slider-content'>
                                <Text>MA15+</Text>
                                <Title level={3}>The Irish Man</Title></div>
                                <div className='clients-logo'>
                                    <img src={require('../../../../assets/images/cinema/clientlogo1.png')}/>
                                    <img src={require('../../../../assets/images/cinema/clientlogo2.png')}/>
                                    <img src={require('../../../../assets/images/cinema/clientlogo3.png')}/>
                                    <img src={require('../../../../assets/images/cinema/clientlogo4.png')}/>
                                    
                                    </div>
                            </div>
                            </Col>
                           
                            
                            </Row> 
                           
                            </TabPane>
                            <TabPane tab='Coming Soon' key='2'>
                            Coming Soon
                            </TabPane>
                            </Tabs>
                            </div>
                            
                        
                        </Layout>
                        </Layout>
                        </Layout>
        )
}
}