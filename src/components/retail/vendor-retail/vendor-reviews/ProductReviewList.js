import React  from 'react';
import { connect } from 'react-redux';
import {Button, List,Col, Input, Layout, Avatar, Row, Typography, Card, Tabs, Select, Rate} from 'antd';
import AppSidebar from '../../../dashboard-sidebar/DashboardSidebar';
import history from '../../../../common/History';
import {getRetailCategoryDetail, getTraderProfile,enableLoading,disableLoading} from "../../../../actions";
import { SearchOutlined } from '@ant-design/icons';
import { renderRating, rating, } from '../../../templates/CommanMethod'
import {salaryNumberFormate, converInUpperCase } from '../../../common'
import ReplyToReviewModel from './ReplyReviewModel'
import ReportThisReview from './ReportReview'
import { DEFAULT_IMAGE_CARD } from '../../../../config/Config'
const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isFilter: false,
        filteredData: [],
        replayReview: false,
        reportReview: false,
        selectedReview:'',
        itemDetail: []
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
    componentDidMount() {
      this.props.enableLoading()
        this.getDetails()
    }

      /**
     * @method getDetails
     * @description get details 
     */
    getDetails = () => {
      const { isLoggedIn, loggedInUser } = this.props
      let classified_id = this.props.match.params.itemId
      let reqData = {
        id: classified_id,
        user_id: isLoggedIn ? loggedInUser.id : ''
      }
      this.props.getRetailCategoryDetail(reqData, (res) => {
        this.props.disableLoading()
        if (res.status === 200) {
          this.setState({ itemDetail: res.data.data, allData: res.data })
        }
      })
    }

    replyToReview = (item) => {
      this.setState({replayReview:true,selectedReview: item})
    }

    reportToReview = (item) => {
      this.setState({reportReview:true,selectedReview: item})
    }
  

    /**
     * @method componentDidMount
     * @description called after render the component
     */
    renderRatings = (temp) => {
        console.log('temp', temp)
        return (
            <div className="demo-infinite-container vendor-review">
            <List
                itemLayout='vertical'
                dataSource={temp && temp}
                renderItem={item => (
                    <List.Item>
                        {}
                        <Rate disabled value={item.rating} className='fs-16 mb-7' />
                        <Button onClick={() => this.replyToReview(item)}>Reply</Button>
                        <Text onClick={() => this.reportToReview(item)}>Report this review</Text>
                        <List.Item.Meta
                            avatar={<Avatar
                              src={item.reviews_bt_users &&
                                    item.reviews_bt_users.image_thumbnail ?
                                    item.reviews_bt_users.image_thumbnail :
                                    'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
                                }                                                                           
                                alt={''}
                                size={37}
                            />}
                            title={<a href='https://ant.design'>{item.reviews_bt_users && converInUpperCase(item.reviews_bt_users.name)}</a>}
                            description={item.review}
                        />
                    </List.Item>
                )}
            />
        </div>
        )
    }

    /**
    * @method handleRatingChange
    * @description handle rating change
    */
    handleRatingChange = (value) => {
        const { itemDetail } = this.state
        let ratings = itemDetail && itemDetail.classified_hm_reviews
        if(ratings && value){
            let filteredData = ratings && ratings.length !== 0 && ratings.filter(el => el.rating == value)
            console.log('ratings',filteredData,value)
            this.setState({filteredData : filteredData, isFilter: true})
        }else {
            this.setState({isFilter: false})
        }
    }

    /**
     * @method render
     * @description render component  
     */
    render() {
        const { userDetails } = this.props
        const {itemDetail,selectedReview,reportReview,replayReview, filteredData, isFilter } = this.state
        let ratings = itemDetail && itemDetail.classified_hm_reviews && itemDetail.classified_hm_reviews.length ? itemDetail.classified_hm_reviews : []
        console.log('userDetails',userDetails)
        let categoryName = itemDetail.categoriesname ? itemDetail.categoriesname.name : "";
        let subCategoryName = itemDetail.mid_level_category ? itemDetail.mid_level_category.name : itemDetail.subcategoriesname ? itemDetail.subcategoriesname.name : "";
        let itemImage = itemDetail && Array.isArray(itemDetail.classified_image) && itemDetail.classified_image.length !== 0 ? itemDetail.classified_image[0] :''
        let avg_rating = itemDetail && itemDetail.classified_hm_reviews && rating(itemDetail.classified_hm_reviews);
        let rateLabel = '';
            if(avg_rating === '5.0'){
                rateLabel = 'Excelent'
            }else if(avg_rating === '4.0'){
                rateLabel = 'Good'
            }else if(avg_rating === '3.0'){
                rateLabel = 'Average'
            }else if(avg_rating === '2.0'){
                rateLabel = 'Poor'
            }else if(avg_rating === '1.0'){
                rateLabel = 'Terrible'
            }
        return (
            <Layout>
            <Layout className="profile-vendor-retail-receiv-order reviews-rating">
              <AppSidebar history={history} activeTabKey={4} />
              <Layout>
                <div className='my-profile-box employee-dashborad-box employee-myad-box' style={{ minHeight: 800 }}>
                  <div className='card-container signup-tab'>
                    <div className='top-head-section'>
                      <div className='left'>
                        <Title level={2}>Reviews</Title>
                      </div>
                      <div className='right'>
                        <div className='right-content'>&nbsp;</div>
                      </div>
                    </div>
    
    
                    <div className='profile-content-box'>
                      <Row gutter={20}>
                            <Col xs={24} md={24} lg={24} >
                              <div className="review-thumb-detail">
                                <div className="thumb">
                                  <img 
                                    src={itemImage && itemImage.full_name ? itemImage.full_name : DEFAULT_IMAGE_CARD}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = DEFAULT_IMAGE_CARD
                                    }}
                                    alt={''}
                                  />                                
                                </div>
                                {itemDetail && <div className="thumb-detail">
                                  <h2>{itemDetail.title }</h2>
                                  <div className="price">{'AU$'}{salaryNumberFormate(itemDetail.price)}</div>
                                  <div className="small-txt">{categoryName}&nbsp;|&nbsp;{subCategoryName}</div>
                                </div>}
                              </div>
                            </Col>
                      </Row>
                        <Row gutter={30}>
                            <Col xs={24} md={16} lg={16} xl={14}>
                                <Card
                                    title={`All Reviews (${ratings && ratings.length})`}
                                    extra={<div className='card-header-select'><label>Show:</label>
                                    <Select defaultValue='All Star'  onChange={this.handleRatingChange}
                                    >
                                        <Option value={''}>All Star</Option>
                                        <Option value={4}>Four Star</Option>
                                        <Option value={3}>Three Star</Option>
                                        <Option value={2}>Two Star</Option>
                                        <Option value={1}>One Star</Option>
                                    </Select></div>}
                                >
                                  <div className={'ml-50'} style={{overflow: 'auto',height: '300'}}>
                                   {isFilter ? this.renderRatings(filteredData) : this.renderRatings(ratings)}

                                  </div>
                                </Card>
                            </Col>
                            <Col xs={24} md={8} lg={8} xl={10}>
                            <div className='product-ratting mb-15'>
                                <Text>{avg_rating ? avg_rating : 'No reviews yet'}</Text>
                                {avg_rating && <Rate disabled defaultValue={avg_rating ? avg_rating : ''} className='fs-15 ml-6 mr-6' style={{ position: 'relative', top: '-1px' }} />}
                                <Text>{avg_rating ? `${avg_rating} of 5.0 /` : ''}  {rateLabel !== '' && rateLabel}</Text>
                            </div>
                                <div>
                                    {isFilter ? renderRating(filteredData) : renderRating(ratings)} 
                                </div>
                            </Col>
                        </Row>
                    </div>
                  </div>
                </div>
              </Layout>
            </Layout>
            {replayReview && 
                <ReplyToReviewModel
                    visible={replayReview}
                    onCancel={() => this.setState({replayReview: false})}
                    selectedReview={selectedReview}
                />
            }
             {reportReview && 
                <ReportThisReview
                    visible={reportReview}
                    onCancel={() => this.setState({reportReview: false})}
                    selectedReview={selectedReview}
                />
            }
        </Layout>
    );
  }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.traderProfile !== null ? profile.traderProfile : null,
  };
};
export default connect(
  mapStateToProps,
  {getRetailCategoryDetail, getTraderProfile, enableLoading,disableLoading}
)(Review);
