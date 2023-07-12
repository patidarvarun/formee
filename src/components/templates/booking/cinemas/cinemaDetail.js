import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import AppSidebar from '../../../sidebar';
import { Layout, Row, Col, Rate, Typography, List, Avatar, Card, Content ,Tabs, Form, Input, Select,Carousel ,Checkbox, Button, Breadcrumb, Space, Slider } from 'antd';
import Icon from '../../../../components/customIcons/customIcons';
import { getBannerById } from '../../../../actions/index';
import { getClassfiedCategoryListing, getClassfiedCategoryDetail } from '../../../../actions/classifieds';
import { getChildCategory } from '../../../../actions'
import DetailCard from '../../../common/DetailCard'
import history from '../../../../common/History';
import { CarouselSlider } from '../../../common/CarouselSlider';
import BannerCard from '../../../common/bannerCard/BannerCard'
import BookingDetailCard from '../../../common/bookingDetailCard/BookingDetailCard';
import {SearchOutlined, PlayCircleOutlined } from '@ant-design/icons';   
import './cinemas.less'


export default class CinemaDetail extends React.Component {

    constructor(props) {    
        super(props);
        this.state = {
            key: 'tab1',
            noTitleKey: 'app',
            classifiedList: []
        };
        
      

    
    };
      
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
        const data = [
            {
              title: 'Ant Design Title 1',
            },
            {
              title: 'Ant Design Title 2',
            },
            {
              title: 'Ant Design Title 3',
            },
            {
              title: 'Ant Design Title 4',
            },
          ];
          const { Header, Footer, Sider, Content } = Layout;
        return (
            <Layout>
                <Layout>
                    <AppSidebar history={history} />
                    <Layout>
                   
                    <div className='cinema-detail '>
                        <div className='container'>
                        <Title className='mb-10' level={3}>The Irish Man</Title>
                        <Text className='m-5'>MA15+</Text><br/>
                        <Text className='m-5'>210 Mins</Text><br/>
                        <Button className=''> <PlayCircleOutlined /> Watch Trailer</Button>
                        <Row >
                        <Link>
                        <img className='m-5' src={require('../../../../assets/images/cinema/Wishlist.png')} alt='Home'/>
                        </Link>
                        <Link>
                        <img className='m-5' src={require('../../../../assets/images/cinema/share.png')} alt='Home'/>
                        </Link></Row>
                        </div>
                        </div>
                        <div className='detail-movie'>
                            <div className='container'>
                            <Row>
                                <Col md={4}>
                                <img src={require('../../../../assets/images/cinema/movie-image.png')} alt='Home'/>
                                </Col>
                                <Col md={16} className='content-detail'>
                                    <Text>A modern retelling of Louisa May Alcott's classic novel, we follow the lives of four sisters - Meg, Jo, Beth, and Amy March - detailing their passage from childhood to womanhood. Despite harsh times, they cling to optimism, and as they mature, they face blossoming ambitions and relationships, as well as tragedy, while maintaining their unbreakable bond as sisters.</Text>
                                 <div className='d-flex'>
                                            <Text className='title-content'>RATING</Text>
                                            <Text>MA15+</Text>
                                  </div>
                                  <div className='d-flex'>
                                            <Text className='title-content'>DURATION</Text>
                                            <Text>210 mins</Text>
                                  </div>
                                  <div className='d-flex'>
                                            <Text className='title-content'>CAST</Text>
                                            <Text>Al Pacino, Robert De Niro, Joe Pesci</Text>
                                  </div>
                                  <div className='d-flex'>
                                            <Text className='title-content'>DIRECTOR</Text>
                                            <Text>Martin Scorsese</Text>
                                  </div>
                                  <div className='d-flex'>
                                            <Text className='title-content'>Synopsis</Text>
                                            <Text>A mob hitman recalls his possible involvement with the slaying of Jimmy Hoffa.</Text>
                                  </div>
                                </Col>
                                <Col md={24} className='mt-30'>
                                    <Title level={3}>Select a Cinema</Title>
                                    <div>
                                <Link>
                                    <img src={require('../../../../assets/images/cinema/hoyts.png')} alt='Home'/>
                                 </Link>
                                 <Link>
                                    <img src={require('../../../../assets/images/cinema/reading.png')} alt='Home'/>
                                 </Link>
                                 <Link>
                                    <img src={require('../../../../assets/images/cinema/village.png')} alt='Home'/>
                                 </Link>
                     
                                    </div>
                                    <Select defaultValue='Hoyts Dandenong' className='line-select' >
                                <Option value='jack'>Select a Movie</Option>
                                <Option value='lucy'>Lucy</Option>
                                <Option value='disabled' disabled>
                                    Disabled
                                </Option>
                                <Option value='Yiminghe'>yiminghe</Option>
                             </Select> 

                             <div className='pb-20 pt-20'>
                                 <Title level={3}>Select Day </Title>
                                 <div>
                                     <Button className='round-btn'>All Films</Button>
                                     <Button className='round-btn active'>Today</Button>
                                     <Button className='round-btn'>Tomorrow</Button>
                                     <Button className='round-btn'>Saturday</Button>
                                     <Button className='round-btn'>Sunday</Button>
                                     <Button className='round-btn'>Monday</Button>
                                     <Button className='round-btn'>Tuesday</Button>
                                     <Button className='round-btn'>Wednesday</Button>
                                 </div>
                             </div>
                             <div className='mb-20'>
                                 <Title level={3}>Select Session </Title>
                                 <div>
                                     <Button className='round-btn'>12:00 PM</Button>
                                     <Button className='round-btn active'>3:45 PM</Button>
                                     <Button className='round-btn'>7:30 PM</Button>
                                    
                                 </div>
                             </div>
                             <Button className='yellow-btn mt-20'>Book Tickets </Button>

                                </Col>
                            </Row>
                            </div>
                            </div>

                        
                     </Layout>
                     </Layout>
                     </Layout>
        )
}
}