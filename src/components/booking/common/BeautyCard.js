import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link, Redirect, withRouter } from "react-router-dom";
import { toastr } from "react-redux-toastr";
import Icon from "../../../components/customIcons/customIcons";
import { DEFAULT_IMAGE_CARD, TEMPLATE } from "../../../config/Config";
import { STATUS_CODES } from "../../../config/StatusCode";
import { langs } from "../../../config/localization";
import { Card, Row, Col, Rate, Typography } from "antd";
import "../../common/bookingDetailCard/bookingDetailCard.less";
import {
  openLoginModel,
  setFavoriteItemId,
  addToFavorite,
  removeToFavorite,
} from "../../../actions/index";
import { getBookingSubCatDetailRoute } from "../../../common/getRoutes";
import {
  displayDateTimeFormate,
  dateFormate,
  capitalizeFirstLetter,
} from "../../common";
const { Title, Text, Paragraph } = Typography;

class BeautyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      favoriteItem: [],
      is_favourite: false,
    };
  }

  /**
   * @method componentDidMount
   * @description called before mounting the component
   */
  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.setState({ is_favourite: data.is_favourite === 1 ? true : false });
    }
  }

  /**
   * @method onSelection
   * @description favorite unfavorite
   */
  onSelection = (data) => {
    const { isLoggedIn, loggedInDetail } = this.props;
    const { is_favourite } = this.state;
    if (isLoggedIn) {
      if (data.is_favourite === 1 || is_favourite) {
        const requestData = {
          user_id: loggedInDetail.id,
          item_id: data.id,
        };
        this.props.removeToFavorite(requestData, (res) => {
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.message);
            this.setState({ is_favourite: false });
          }
        });
      } else {
        const requestData = {
          user_id: loggedInDetail.id,
          item_type: "trader",
          item_id: data.id,
          category_id: data.trader_profile.booking_cat_id,
          sub_category_id: data.trader_profile.booking_sub_cat_id,
        };
        this.props.addToFavorite(requestData, (res) => {
          if (res.status === STATUS_CODES.OK) {
            toastr.success(langs.success, res.data.message);
            this.setState({ is_favourite: true });
          }
        });
      }
    } else {
      this.props.openLoginModel();
    }
  };

  /**
   * @method selectTemplateRoute
   * @description navigate to detail Page
   */
  selectTemplateRoute = (el) => {
    let parameter = this.props.match.params;
    let cat_id =
      parameter.categoryId !== undefined ? parameter.categoryId : el.id;
    let templateName = parameter.categoryName;
    let subCategoryName = parameter.subCategoryName;
    let subCategoryId = parameter.subCategoryId;
    let classifiedId = el.id;
    let catName = "";
    let path = "";
    if (templateName === TEMPLATE.BEAUTY) {
      path = getBookingSubCatDetailRoute(
        templateName,
        cat_id,
        subCategoryId,
        subCategoryName,
        classifiedId
      );
      this.setState({ redirect: path });
    } else if (templateName === TEMPLATE.EVENT) {
      path = getBookingSubCatDetailRoute(
        templateName,
        cat_id,
        subCategoryId,
        subCategoryName,
        classifiedId
      );
      this.setState({ redirect: path });
    } else if (templateName === TEMPLATE.WELLBEING) {
      path = getBookingSubCatDetailRoute(
        templateName,
        cat_id,
        subCategoryId,
        subCategoryName,
        classifiedId
      );
      this.setState({ redirect: path });
    }
    // window.open(path, "_blank")
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { data } = this.props;
    const { is_favourite, redirect } = this.state;
    let parameter = this.props.match.params;
    let subCategoryName = parameter.subCategoryName;
    let templateName = parameter.categoryName;
    let categoryId = parameter.categoryId;
    let subCategoryId = parameter.subCategoryId;
    let label = "",
      label1 = "";
    if (templateName === TEMPLATE.BEAUTY) {
      label = "Beauty + Brows";
      label1 = "Per adult";
    } else if (templateName === TEMPLATE.EVENT) {
      label = "10% off";
      label1 = "Start From";
    }
    let cat_id =
      parameter.categoryId !== undefined ? parameter.categoryId : data.id;
    let classifiedId = data.id;
    let path = "";
    if (templateName === TEMPLATE.BEAUTY) {
      path = getBookingSubCatDetailRoute(
        templateName,
        cat_id,
        subCategoryId,
        subCategoryName,
        classifiedId
      );
    } else if (templateName === TEMPLATE.EVENT) {
      path = getBookingSubCatDetailRoute(
        templateName,
        cat_id,
        subCategoryId,
        subCategoryName,
        classifiedId
      );
    } else if (templateName === TEMPLATE.WELLBEING) {
      path = getBookingSubCatDetailRoute(
        templateName,
        cat_id,
        subCategoryId,
        subCategoryName,
        classifiedId
      );
    }
    return (
      <Fragment>
        {data && (
          <Card
            bordered={false}
            className={"booking-detail-card daily-deal"}
            cover={
              <Link to={path}>
                <img
                  src={
                    data && data.image !== undefined && data.image !== null
                      ? data.image
                      : DEFAULT_IMAGE_CARD
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_IMAGE_CARD;
                  }}
                  onClick={() => this.selectTemplateRoute(data)}
                  style={{ cursor: "pointer" }}
                  alt={data && data.title !== undefined ? data.title : ""}
                />
              </Link>
            }
            title={"First Trial 10% off"}
            actions={[
              data && (
                <Link to={path}>
                  <div
                    className="date-info align-left"
                    //onClick={() => this.selectTemplateRoute(data)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* <strong>{displayDateTimeFormate(data.created_at)}</strong> <br /> */}
                    {`Valid ${dateFormate(data.created_at)} - ${dateFormate(
                      data.updated_at
                    )}`}
                  </div>
                </Link>
              ),
              <Icon
                icon="wishlist"
                className={is_favourite ? "active" : ""}
                size="20"
                onClick={() => this.onSelection(data)}
              />,
            ]}
          >
            {/* {templateName === TEMPLATE.BEAUTY && <div className='tag'>Save <br />55%</div>} */}
            <Link to={path}>
              <Row
                //onClick={() => this.selectTemplateRoute(data)}
                style={{ cursor: "pointer" }}
              >
                <Col span={13}>
                  <div className="rate-section">
                    {"3.0"}
                    <Rate allowHalf defaultValue={3.0} />
                  </div>
                  <div
                    className="title"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {/* {'Remedial Brows'} */} {"Laurel Beauty and spa"}
                    {data.trader_profile.title
                      ? capitalizeFirstLetter(data.trader_profile.title)
                      : ""}
                  </div>
                  <div
                    className="category-box"
                    onClick={() => this.selectTemplateRoute(data)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="category-name">
                      {/* {subCategoryName ? subCategoryName : ''} */}
                      {data && data.sub_cat_name !== undefined
                        ? data.sub_cat_name
                        : subCategoryName}
                    </div>
                  </div>
                  {/* <div className='location-name'>
                                    {data.business_city_id && data.business_city_id !== 'N/A' && <Icon icon='location' size='15' className='mr-5' />}
                                    {data.business_city_id && data.business_city_id !== 'N/A' ? data.business_city_id : ''}
                            </div> */}
                </Col>
                <Col span={11}>
                  <div className="price-box">
                    <div className="price">
                      {data.trader_profile.rate_per_hour
                        ? `AU$${data.trader_profile.rate_per_hour}`
                        : ""}
                      <Paragraph className="sub-text">{"start from"}</Paragraph>
                    </div>
                  </div>
                </Col>
              </Row>
            </Link>
          </Card>
        )}
        {redirect && (
          <Redirect
            push
            to={{
              pathname: redirect,
            }}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  const { isOpenLoginModel, favoriteId } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
    isOpenLoginModel,
    favoriteId,
  };
};

export default connect(mapStateToProps, {
  openLoginModel,
  setFavoriteItemId,
  addToFavorite,
  removeToFavorite,
})(withRouter(BeautyCard));
