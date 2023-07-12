import React, { useState, Fragment } from "react";
import {
  slice, concat,
} from 'lodash';
import { Card, Typography, Button, Row, Col } from 'antd';
import moment from 'moment'

import { getStatusColor, checkBookingForFutureDate } from '../../../../config/Helper'



const LIMIT = 5;
const { Title } = Typography;

export default function LoadMore(props) {
  const [showMore, setShowMore] = useState(true);
  const [list, setList] = useState(slice(props.dashboardListing, 0, LIMIT));
  const [index, setIndex] = useState(LIMIT);

  React.useEffect(() => { setList(slice(props.dashboardListing, 0, LIMIT)) }, [props.dashboardListing]);

  const loadMore = () => {
    const newIndex = index + LIMIT;
    const newShowMore = newIndex < (props.totalRecords - 1);
    const newList = concat(list, slice(props.dashboardListing, index, newIndex));
    setIndex(newIndex);
    setList(newList);
    setShowMore(newShowMore);
  }

  const renderCategoryIcon = (module_type) => {
    if (module_type == 'Booking') {
      return <img className="shopping-img" src={require('../../../../assets/images/shopping-image.png')}></img>
    } else if (module_type == 'Retail') {
      return <img className="shopping-img" src={require('../../../../assets/images/bulb-img.png')}></img>
    } else if (module_type == 'Classified') {
      return <img className="shopping-img" src={require('../../../../assets/images/sent-img.png')}></img>
    }
  }

  const renderCategoryLabel = (module_type, category_name, sub_category_name) => {
    if (module_type == 'Booking') {
      return <div className="orange-text pt-40 "> {category_name && `${category_name}`} {sub_category_name && `| ${sub_category_name}`}</div>
    } else if (module_type == 'Retail') {
      return <div className="pink-text pt-40">{category_name && `${category_name}`} {sub_category_name && `| ${sub_category_name}`}</div>
    } else if (module_type == 'Classified') {
      return <div className="blue-text pt-40"> {category_name && `${category_name}`} {sub_category_name && `| ${sub_category_name}`}</div>
    }
  }

  const renderBookingTime = (value) => {
    if (value.module_type == 'Booking') {
      return <Col>
        {value.time && <div className="qty-hrs-block" style={{ color: '#90A8BE' }}> <span className="qty-hrs">Time</span> | <span className="qty-hrs qty-hrs-small">{moment(value.time).format('hh:mm A')}</span></div>}
        <div className="" style={{ color: '#90A8BE' }}> <span className="qty-hrs">Date</span>  | <span className="qty-hrs qty-hrs-small">{moment(value.booking_date).format("DD/MM/YY")}</span></div>
      </Col>
    }
  }

  return (
    <div className="App">
      <Fragment>
        {list.length > 0 && list.map((value, i) => {
          return (
            <Card key={`listing_data_${i}`} className="mt-20 mb-20 card-profile-detail">
              {renderCategoryIcon(value.module_type)}
              <Row>
                <Col md={12} className="product-name">
                  <div className="product-name-flex-block">
                    <Title level={4} className="mb-3">{value.activity_type}</Title>
                    <Title level={4} className="lightblue-text">{value.title}</Title>
                    {renderCategoryLabel(value.module_type, value.category_name, value.sub_category_name)}
                  </div>
                </Col>
                <Col md={12} className="p-10">
                  <div className="edit-view">
                    {/* <Text className="fs-10"><span class="icon-pencil"></span> View</Text>    */}
                    <Button className="card-attached">{value.business_name}</Button>
                  </div>
                  <Row className="pt-10 pl-15 pb-10 antrow-top" align='middle' justify="space-between">
                    {renderBookingTime(value)}
                    <Col md={value.module_type === 'Classified' ? 24 : 12} className="tex-right">
                      <Title level={3} className="mb-0 f-30 ">{value.price && `AU$${value.price}`}</Title>
                      <Button type='default' className={`${getStatusColor(value.status)} btn-sml`}>{value.status}</Button>
                    </Col>
                  </Row>
                  {/* <div className="mb-10 mt-10 text-right">
                    <Button className="purple-button">{value.status}</Button>
                  </div> */}
                </Col>
              </Row>
            </Card>
          )
        })
        }
      </Fragment>
      {showMore && <div className="show-more">
        <div type='default' size={'middle'} onClick={loadMore}>{'Show More'}</div>
      </div>}
    </div>
  );
}