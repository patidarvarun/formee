import React from "react";
import { connect } from "react-redux";
import {
  Pagination,
  List,
  message,
  Avatar,
  Spin,
  Button,
  Row,
  Col,
  Typography,
  Switch,
  Modal,
} from "antd";
// import Pagination from '../../common/Pagination'
import Icon from "../../../components/customIcons/customIcons";
import {
  PlusOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  EditFilled,
  DeleteFilled,
} from "@ant-design/icons";
import { openLoginModel } from "../../../actions/index";
const { Text, Title } = Typography;
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

class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
    postPerPage: 9,
    visibleDelMenu: false,
  };

  componentDidMount() {
    const { listItem } = this.props;
    console.log(listItem, "ListttItem");
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
    const { data, currentPage, postPerPage, visibleDelMenu } = this.state;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = data.slice(indexOfFirstPost, indexOfLastPost);
    console.log("Current Post", currentPosts);
    console.log("HelloPost1", currentPosts[0]);
    console.log("Data", data);

    const { invisible, deleteMenuItem, updateMenu, editMenu } = this.props;
    return (
      // <div className="demo-infinite-container" >
      <div className="menu-content">
        {currentPosts.map((item) => (
          <Row gutter={0} className="menu-cell">
            <Col xs={2} sm={2} md={2} lg={2} xl={2}>
              <Avatar shape="square" src={item.image} className="menu-thumb" />
            </Col>
            <Col
              xs={10}
              sm={10}
              md={10}
              lg={10}
              xl={10}
              className="item-name-col"
            >
              <Text strong className="item-name">
                {item.name}
              </Text>
              <br />
              <Text className="item-details">{item.details}</Text>
            </Col>
            <Col xs={4} sm={4} md={4} lg={4} xl={4}>
              <Text strong className="item-price">{`AU $${item.price}`}</Text>
            </Col>
            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="switch-col">
              <Switch
                size="medium"
                defaultChecked={item.is_Active}
                onChange={() => {
                  updateMenu(item);
                }}
              />
            </Col>
            {/* <Col xs={2} sm={2} md={2} lg={2} xl={2}>
              <EditFilled />
            </Col> */}
            <Col xs={4} sm={4} md={4} lg={4} xl={4} className="actions-col">
              {/* <DeleteFilled
                onClick={() => {
                  console.log("============================>", item.id);
                  deleteMenuItem(item.id);
                }}
              /> */}
              <svg
                className="edit-menu"
                onClick={() => editMenu(item)}
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 10.2924V12.7379H2.5L9.87332 5.5254L7.37332 3.07994L0 10.2924ZM11.8066 3.63425C12.0666 3.37992 12.0666 2.96908 11.8066 2.71476L10.2467 1.18879C9.98665 0.934465 9.56665 0.934465 9.30665 1.18879L8.08665 2.38217L10.5866 4.82763L11.8066 3.63425Z"
                  fill="#90A8BE"
                />
              </svg>
              <svg
                className="delete-menu"
                onClick={() => {
                  this.setState({ visibleDelMenu: item.id });
                }}
                width="10"
                height="12"
                viewBox="0 0 10 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.666665 10.4339C0.666665 11.1513 1.26666 11.7382 2 11.7382H7.33332C8.06665 11.7382 8.66665 11.1513 8.66665 10.4339V2.60848H0.666665V10.4339ZM9.33331 0.65212H6.99998L6.33332 0H2.99999L2.33333 0.65212H0V1.95636H9.33331V0.65212Z"
                  fill="#90A8BE"
                />
              </svg>
            </Col>
            {/* <Col xs={2} sm={2} md={2} lg={2} xl={2}>
              <DeleteFilled
                onClick={() => {
                  this.setState({
                    visibleDelMenu: item.id,
                  });
                }}
              />
            </Col> */}
          </Row>
        ))}
        {visibleDelMenu && (
          <Modal
            visible={visibleDelMenu}
            layout="vertical"
            className={"custom-modal style1 delete-menu-popup"}
            footer={false}
            onCancel={() => this.setState({ visibleDelMenu: false })}
          >
            <div className="padding">
              <svg
                className="delete-icon"
                width="21"
                height="26"
                viewBox="0 0 21 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 23.1111C1.5 24.7 2.85 26 4.5 26H16.5C18.15 26 19.5 24.7 19.5 23.1111V5.77778H1.5V23.1111ZM21 1.44444H15.75L14.25 0H6.75L5.25 1.44444H0V4.33333H21V1.44444Z"
                  fill="#E3E9EF"
                />
              </svg>
              <Title level={3}>
                Are you sure you want to delete this Menu?
              </Title>
              <div className="popup-footer">
                <Button
                  className="clear-btn"
                  onClick={() =>
                    this.setState({
                      visibleDelMenu: false,
                    })
                  }
                >
                  No, Cancel
                </Button>
                <Button
                  className="orange-btn"
                  onClick={() => {
                    deleteMenuItem(visibleDelMenu);
                    this.setState({
                      visibleDelMenu: false,
                    });
                  }}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </Modal>
        )}
        {/* <List
          dataSource={currentPosts}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={
                  <Avatar src={item.image} />
                }
                title={<strong>{item.name}</strong>}
                description={item.details}
              />
              <div className="last-block"><strong>{`$${item.price}`}</strong>
                {invisible === undefined &&
                  <React.Fragment>
                    <button onClick={() => this.handleOnClick(item)}>
                      <img width='15px' src={require('../../../assets/images/add-color.png')} ></img>
                    </button>
                  </React.Fragment>
                }
              </div>
            </List.Item>
          )}
        > 
        </List>*/}
        {/* <Pagination postPerPage={postPerPage} totalPost={data.length} paginate={(number) => this.setState({currentPage: number})} /> */}
        {/* {data.length > 12 && <Pagination
          defaultCurrent={1}
          defaultPageSize={12} //default size of page
          onChange={this.handlePageChange}
          total={data.length} //total number of card data available
          itemRender={itemRender}
          className={'mb-20'}
        />} */}
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
  InfiniteListExample
);
