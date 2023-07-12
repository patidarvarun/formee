import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Pagination, List, message, Avatar, Spin, Button } from "antd";
// import Pagination from '../../common/Pagination'
import Icon from "../../customIcons/customIcons";
import { PlusOutlined } from "@ant-design/icons";
import { openLoginModel } from "../../../actions/index";
import "./restaurantDetailCard.less";

// Pagination
function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return (
      <a>
        <Icon icon="arrow-left" size="14" className="icon" /> Back
      </a>
    );
  }
  if (type === "next") {
    return (
      <a>
        Next <Icon icon="arrow-right" size="14" className="icon" />
      </a>
    );
  }
  return originalElement;
}

class RestaurantDetailCard extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
    postPerPage: 9,
  };

  componentDidMount() {
    const { listItem } = this.props;

    this.setState({
      data: listItem,
    });
  }

  /**
   * @method handlePageChange
   * @description handle page change
   */
  handlePageChange = (e) => {
    this.setState({ currentPage: e });
  };

  handleOnClick = (item) => {
    const { isLoggedIn } = this.props;
    if (isLoggedIn) {
      this.props.displayAddToCartModal(item);
    } else {
      this.props.openLoginModel();
    }
  };

  render() {
    const { data, currentPage, postPerPage } = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
    const { invisible } = this.props;
    return (
      <div className="restaurant-detail-card">
        <List
          itemLayout="vertical"
          size="large"
          dataSource={currentPosts}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <strong>{`$${item.price}`}</strong>,
                // <span>{`3140 kJ`}</span>,
              ]}
              extra={
                <Fragment>
                  <img
                    className="product-image"
                    alt="product image"
                    src={item.image}
                  />
                  {invisible === undefined && (
                    <button onClick={() => this.handleOnClick(item)}>
                      <img
                        src={require("../../../assets/images/icons/plus-icon.svg")}
                      />
                    </button>
                  )}
                </Fragment>
              }
            >
              <List.Item.Meta title={item.name} description={item.details} />
            </List.Item>
          )}
        ></List>
        {/* <Pagination postPerPage={postPerPage} totalPost={data.length} paginate={(number) => this.setState({currentPage: number})} /> */}
        {data.length > 12 && (
          <Pagination
            defaultCurrent={1}
            defaultPageSize={12} //default size of page
            onChange={this.handlePageChange}
            total={data.length} //total number of card data available
            itemRender={itemRender}
            className={"mb-20"}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, common } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};
export default connect(mapStateToProps, { openLoginModel })(
  RestaurantDetailCard
);
