import React from "react";
import { connect } from "react-redux";
import {
  Empty,
  Col,
  Input,
  Layout,
  Avatar,
  Row,
  Typography,
  Button,
  Menu,
  Dropdown,
  Select,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  SearchOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getAllChat,
  getChatDetail,
  updateMessage,
} from "../../../actions";
import AppSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import history from "../../../common/History";
import "./message.less";
import { DASHBOARD_KEYS } from "../../../config/Constant";
import { displayDateTimeFormate } from "../../../components/common";
import { STATUS_CODES } from "../../../config/StatusCode";
import ChatDetail from "./ChatDetails";
import moment from "moment";
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">Inbox</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">Unread</a>
    </Menu.Item>
    <Menu.Item key="2">
      <a href="http://www.taobao.com/">Newest</a>
    </Menu.Item>
    <Menu.Item key="3">
      <a href="http://www.taobao.com/">Oldest</a>
    </Menu.Item>
    <Menu.Item key="4">
      <a href="http://www.taobao.com/">Archived</a>
    </Menu.Item>
  </Menu>
);

class Message extends React.Component {
  constructor(props) {
    // console.log("Props11233342", props);
    super(props);
    this.state = {
      chatList: [],
      chatList123: [],

      itemDetail: "",
      getMessageDetails: [],
      showOption: "inbox",
      filter: [],
      read_status: false,
      msg: [],
      messegeDataa: [],
      getNotificationData: [],
      row: [],
      List: [],
      datata: [],
      aaa: [],
      count_msg: 0,
      fb: [],
      abc: [],
      var: [],
      id11: [],
    };
  }

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.getAllChat();

    const { userDetails } = this.props;
    this.setState({ userDetails });
  }

  updateStatus = (messageId1) => {
    console.log(
      "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXmessageId1",
      messageId1
    );

    // const idd = this.state.itemDetail.messages.filter((read_status) => {
    //   return read_status.read_status === 0;
    // });
    // const id1 = idd.map((ee) => ee.id);
    // console.log("neewiddddd^^^^^^^^^6666666666666666666666", id1);

    //_______________________________________________________________________
    // const data = this.state.chatList.map((ee) => {
    //   return ee.messages;
    // });
    // console.log("&&&&&&&&&&&&&&&&&&&&", data);
    // const data1 = data.filter((read_status) => read_status.read_status === 0);
    // console.log("@@@@@@@@@@@@@@@data1", data1);
    // //_____________________________________________________________________________________

    const data1 = messageId1.filter(
      (read_status) => read_status.read_status === 0
    );
    console.log("@@@@@@@@@@@@@@@data1", data1);
    const id1 = data1.map((ee) => {
      return ee.id;
    });
    console.log("iddddddddddddddddddddddd111!!!!!!!!!!!!nnnnnnnnn123333", id1);
    // const idd = this.state.chatList.map((messages) => {
    //   return messages.messages.filter(
    //     (read_status) => read_status.read_status === 0
    //   );
    // });
    // console.log("+++++++++++++++++++++++++++++++++++++++++++", idd);
    // const id1 = idd.map((ee) => {
    //   return ee.map((e) => e.id);
    // });
    // console.log(
    //   "iddddddddddddddddddddddd111!!!!!!!!!!!!nnnnnnnnn12333333",
    //   id1
    // );

    let reqData = {
      // message_ids: id1.join(),
      message_ids: id1.join(","),
    };
    console.log("message_ids1111@@@@@", reqData);

    this.props.enableLoading();
    this.props.updateMessage(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        //  this.setState({ chatList: res.data.data });
      }
    });
  };

  getAllChat = () => {
    this.props.enableLoading();
    const { id } = this.props.loggedInUser;
    let reqData = {
      user_id: id,
      sort_type: "",
    };
    this.props.getAllChat(reqData, (res) => {
      this.props.disableLoading();

      if (
        res.status === STATUS_CODES.OK &&
        Array.isArray(res.data.data && res.data.blocked_users_data)
      ) {
        // if (reqData.sort_type === "block") {
        //   this.setState({
        //     chatList: res.data.blocked_users_data,
        //   });
        // } else
        // {
        this.setState({
          chatList: res.data.data,
        });
        //  }

        let fbPages = [];
        const result = this.state.chatList.map((read) => {
          read.messages.map((re) => {
            if (re.read_status == 1) {
              this.setState({ count_msg: this.state.count_msg + 1 });
              fbPages.push({
                id: re.id,
                count: this.state.count_msg,
                //[re.id]: this.state.count_msg,
              });
            }
            this.setState({ count_msg: 0 });
          });
        });
        // console.log("Fbbbbb", fbPages);
        this.setState({ fb: fbPages });
        this.setState({ datata: result });

        this.setState({ row: res.data.data });
        this.setState({ getNotificationData: res.data.data });
      }
      // console.log("$$$$$$$$$$$$$$$$$$$$", this.state.chatList);
    });
  };

  searchText = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleSorting = (value) => {
    if (value === "inbox") {
      this.props.enableLoading();
      const { id } = this.props.loggedInUser;
      let reqData = {
        user_id: id,
        sort_type: value,
      };
      this.props.getAllChat(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK && Array.isArray(res.data.data)) {
          this.setState({ chatList: res.data.data });
        }
      });
    } else if (value === "unread") {
      this.props.enableLoading();
      const { id } = this.props.loggedInUser;
      let reqData = {
        user_id: id,
        sort_type: value,
      };
      this.props.getAllChat(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK && Array.isArray(res.data.data)) {
          // console.log("^^^^^^^^^^^^^^^^^^^^^^^^", res.data.data);

          {
            this.setState({ chatList: res.data.data });
          }
        }
      });
    } else if (value === "block") {
      this.props.enableLoading();
      const { id } = this.props.loggedInUser;
      let reqData = {
        user_id: id,
        sort_type: "block",
      };
      this.props.getAllChat(reqData, (res) => {
        //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA!@#", reqData);
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK && Array.isArray(res.data.data)) {
          //  console.log("^^^^^^^^^^^^^^^^^^^^^^^^", res.data.data);
          {
            this.setState({ chatList: res.data.data });
          }
        }
      });
    } else if (value === "newest") {
      this.props.enableLoading();

      const { id } = this.props.loggedInUser;
      let reqData = {
        user_id: id,
        sort_type: value,
      };

      this.props.getAllChat(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK && Array.isArray(res.data.data)) {
          this.setState({ chatList: res.data.data });
        }
      });
    } else if (value === "oldest") {
      this.props.enableLoading();

      const { id } = this.props.loggedInUser;
      let reqData = {
        user_id: id,
        sort_type: value,
      };

      this.props.getAllChat(reqData, (res) => {
        this.props.disableLoading();
        if (res.status === STATUS_CODES.OK && Array.isArray(res.data.data)) {
          this.setState({ chatList: res.data.data });
        }
      });
    }
  };
  handleSelect = (item) => {
    const { id } = this.props.loggedInUser;
    let distinctId =
      item.receiver && item.receiver.id === id
        ? item.sender && item.sender.id
        : item.receiver
        ? item.receiver.id
        : "";
    let messageId =
      item.messages && Array.isArray(item.messages) && item.messages.length
        ? item.messages[0].id
        : "";

    let messageId1 =
      item.messages && Array.isArray(item.messages) && item.messages.length
        ? item.messages
        : "";
    //  console.log("************88888888888888888888", messageId);
    //  console.log("###############3333333333333333333333", item.messages[0].id);
    this.setState({ itemDetail: item, selectedId: messageId });
    this.updateStatus(messageId1);
  };
  /**
   * @method renderMessageList
   * @description render message list
   */
  renderMessageList = () => {
    const { chatList, selectedId } = this.state;
    // console.log("chatlist^^^^^^^^^^^^^^^^^^%%%%$$$", this.state.chatList);
    if (this.props.loggedInUser.user_type === "private") {
      const dataSearch = chatList.filter((item) => {
        console.log("item%%%%%%%%%%%%%%%%%%%%%%%%%%%", item);
        return item.sender.name
          .toString()
          .toLowerCase()
          .includes(this.state.filter.toString().toLowerCase());
      });
      // console.log("dataSearch", dataSearch.length);

      return dataSearch.length !== 0 ? (
        dataSearch &&
          dataSearch.map((el, i) => {
            // console.log("mappppppp!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", el);
            const { id } = this.props.loggedInUser;
            let distinctId =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.id
                : el.receiver
                ? el.receiver.id
                : "";
            let image =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.image
                : el.receiver
                ? el.receiver.image
                : "";
            let name =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.name
                : el.receiver
                ? el.receiver.name
                : "";
            let messageData =
              el.messages && Array.isArray(el.messages) && el.messages.length
                ? el.messages[el.messages.length - 1]
                : "";

            let chattitle = el.title;
            // messages_list = { ...el.messages };
            let message = messageData.massage;

            return (
              <div
                className={
                  messageData && messageData.id === selectedId
                    ? "item active"
                    : "item"
                }
                key={i}
                // onClick={() => this.setState({itemDetail: el})}
                onClick={() => this.handleSelect(el)}
              >
                <div className="info">
                  {image ? (
                    <Avatar src={image} alt={""} size={50} />
                  ) : (
                    <Avatar size={50} icon={<UserOutlined />} />
                  )}
                  <div className="info-content">
                    {/* <Title level={4} className='title'>{name}</Title> */}
                    <Title level={4} className="title">
                      {name}
                    </Title>
                    {/* <Text className='duration'>{displayDateTimeFormate(el.messages[0].updated_at)}</Text> */}
                    {/* <span className='break'>&nbsp;</span> */}
                    <Text className="duration">
                      {displayDateTimeFormate(
                        messageData && messageData.updated_at
                      )}
                    </Text>

                    {el.unread_count === 0 ? (
                      ""
                    ) : (
                      <span className="message-notification">
                        {el.unread_count}{" "}
                      </span>
                    )}

                    {/* <span className='unr-msg-count'>2</span> */}
                    <span className="service-name">{chattitle} </span>
                    {/* <img
                    src="/static/media/message.71c6fa9c.png"
                    alt=""
                    width="16"
                    className={msgBox === null ? "aaa" : "bbb"}
                  /> */}
                  </div>
                </div>
                <Paragraph>
                  {message.includes("jpeg") ||
                  message.includes("jpg") ||
                  message.includes("png") ||
                  message.includes("gif") ||
                  message.includes("raw") ||
                  message.includes("tiff") ? (
                    <div className="image-icon"></div>
                  ) : message.includes("mp4") ||
                    message.includes("mov") ||
                    message.includes("wmv") ||
                    message.includes("fiv") ||
                    message.includes("avi") ||
                    message.includes("mkv") ? (
                    <div className="video-icon"></div>
                  ) : message.includes("doc") ||
                    message.includes("pdf") ||
                    message.includes("docx") ? (
                    <div className="file-icon"></div>
                  ) : (
                    message
                  )}

                  {/* {messageData && messageData.massage} */}
                  {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum gravida rhoncus eu fusce. Lorem ipsum dolor sit amet, consectetur adipiscing elit... */}
                </Paragraph>
              </div>
            );
          })
      ) : (
        <Paragraph className="msg-count">{`No Chat found`}</Paragraph>
      );
    } else if (
      (this.props.loggedInUser.user_type === "handyman", "wellbeing")
    ) {
      const dataSearch = chatList.filter((item) => {
        console.log("@@@@@@@@@@@@@@@@@@@@@@@@", item);
        return item.receiver.name
          .toString()
          .toLowerCase()
          .includes(this.state.filter.toString().toLowerCase());
      });

      return dataSearch.length !== 0 ? (
        dataSearch &&
          dataSearch.map((el, i) => {
            // console.log("mappppppp00000000000000000000", el.id);
            // console.log("mappppppp1111111111111111111111111", el);

            const { id } = this.props.loggedInUser;

            let distinctId =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.id
                : el.receiver
                ? el.receiver.id
                : "";
            let image =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.image
                : el.receiver
                ? el.receiver.image
                : "";
            let name =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.name
                : el.receiver
                ? el.receiver.name
                : "";
            let messageData =
              el.messages && Array.isArray(el.messages) && el.messages.length
                ? el.messages[el.messages.length - 1]
                : "";

            let chattitle = el.title;
            // messages_list = { ...el.messages };
            let message = messageData.massage;

            return (
              <div
                className={
                  messageData && messageData.id === selectedId
                    ? "item active"
                    : "item"
                }
                key={i}
                // onClick={() => this.setState({itemDetail: el})}
                onClick={() => this.handleSelect(el)}
              >
                <div className="info">
                  {image ? (
                    <Avatar src={image} alt={""} size={50} />
                  ) : (
                    <Avatar size={50} icon={<UserOutlined />} />
                  )}
                  <div className="info-content">
                    {/* <Title level={4} className='title'>{name}</Title> */}
                    <Title level={4} className="title">
                      {name}
                    </Title>
                    {/* <Text className='duration'>{displayDateTimeFormate(el.messages[0].updated_at)}</Text> */}
                    {/* <span className='break'>&nbsp;</span> */}
                    <Text className="duration">
                      {displayDateTimeFormate(
                        messageData && messageData.updated_at
                      )}
                    </Text>
                    {el.unread_count === 0 ? (
                      ""
                    ) : (
                      <span className="message-notification">
                        {el.unread_count}{" "}
                      </span>
                    )}
                    {/* <span className='unr-msg-count'>2</span> */}
                    <span className="service-name">{chattitle} </span>
                  </div>
                </div>
                <Paragraph>
                  {message.includes("jpeg") ||
                  message.includes("jpg") ||
                  message.includes("png") ||
                  message.includes("gif") ||
                  message.includes("raw") ||
                  message.includes("tiff") ? (
                    <div className="image-icon"></div>
                  ) : message.includes("mp4") ||
                    message.includes("mov") ||
                    message.includes("wmv") ||
                    message.includes("fiv") ||
                    message.includes("avi") ||
                    message.includes("mkv") ? (
                    <div className="video-icon"></div>
                  ) : message.includes("doc") ||
                    message.includes("pdf") ||
                    message.includes("docx") ? (
                    <div className="file-icon"></div>
                  ) : (
                    message
                  )}

                  {/* {messageData && messageData.massage} */}
                  {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit. Elementum gravida rhoncus eu fusce. Lorem ipsum dolor sit amet, consectetur adipiscing elit... */}
                </Paragraph>
              </div>
            );
          })
      ) : (
        <Paragraph className="msg-count">{`No Chat found`}</Paragraph>
      );
    } else {
      const dataSearch = chatList.filter((item) => {
        // console.log("item", item);
        return item.sender.name
          .toString()
          .toLowerCase()
          .includes(this.state.filter.toString().toLowerCase());
      });

      // console.log("dataSearch", dataSearch);

      return dataSearch.length !== 0 ? (
        dataSearch &&
          dataSearch.map((el, i) => {
            // console.log("mappppppp", el);
            const { id } = this.props.loggedInUser;
            let distinctId =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.id
                : el.receiver
                ? el.receiver.id
                : "";
            let image =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.image
                : el.receiver
                ? el.receiver.image
                : "";
            let name =
              el.receiver && el.receiver.id === id
                ? el.sender && el.sender.name
                : el.receiver
                ? el.receiver.name
                : "";
            let messageData =
              el.messages && Array.isArray(el.messages) && el.messages.length
                ? el.messages[el.messages.length - 1]
                : "";

            let chattitle = el.title;
            // messages_list = { ...el.messages };
            let message = messageData.massage;

            return (
              <div
                className={
                  messageData && messageData.id === selectedId
                    ? "item active"
                    : "item"
                }
                key={i}
                // onClick={() => this.setState({itemDetail: el})}
                onClick={() => this.handleSelect(el)}
              >
                <div className="info">
                  {image ? (
                    <Avatar src={image} alt={""} size={50} />
                  ) : (
                    <Avatar size={50} icon={<UserOutlined />} />
                  )}
                  <div className="info-content">
                    {/* <Title level={4} className='title'>{name}</Title> */}
                    <Title level={4} className="title">
                      {name}
                    </Title>
                    {/* <Text className='duration'>{displayDateTimeFormate(el.messages[0].updated_at)}</Text> */}
                    {/* <span className='break'>&nbsp;</span> */}
                    <Text className="duration">
                      {displayDateTimeFormate(
                        messageData && messageData.updated_at
                      )}
                    </Text>
                    {el.unread_count === 0 ? (
                      ""
                    ) : (
                      <span className="message-notification">
                        {el.unread_count}{" "}
                      </span>
                    )}
                    {/* <span className='unr-msg-count'>2</span> */}
                    <span className="service-name">{chattitle} </span>
                  </div>
                </div>
                <Paragraph>
                  {" "}
                  {message.includes("jpeg") ||
                  message.includes("jpg") ||
                  message.includes("png") ||
                  message.includes("gif") ||
                  message.includes("raw") ||
                  message.includes("tiff") ? (
                    <div className="image-icon"></div>
                  ) : message.includes("mp4") ||
                    message.includes("mov") ||
                    message.includes("wmv") ||
                    message.includes("fiv") ||
                    message.includes("avi") ||
                    message.includes("mkv") ? (
                    <div className="video-icon"></div>
                  ) : message.includes("doc") ||
                    message.includes("pdf") ||
                    message.includes("docx") ? (
                    <div className="file-icon"></div>
                  ) : (
                    message
                  )}
                </Paragraph>
              </div>
            );
          })
      ) : (
        <Paragraph className="msg-count">{`No Chat found`}</Paragraph>
      );
    }
  };

  onChangeShow = (e) => {
    this.setState({
      showOption: e,
    });
    // call api for show filter
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { itemDetail, chatList, showOption } = this.state;
    const { isLoggedIn } = this.props;
    console.log("(***********)))))))))))**************", this.state.itemDetail);

    isLoggedIn &&
      document.body.classList.add(
        "user_type_" + this.props.loggedInUser.user_type
      );
    return (
      <Layout>
        <Layout>
          <AppSidebar
            activeTabKey={DASHBOARD_KEYS.MESSAGES}
            history={history}
          />
          <Layout>
            <div
              className="my-profile-box messages-row"
              style={{ height: "100%" }}
            >
              <div className="card-container signup-tab">
                <div className="top-head-section">
                  <div className="left">
                    <Title level={2}>Messages </Title>
                  </div>
                  <div className="right"></div>
                </div>
                <div className="sub-head-section">
                  {/* <Text>Search Chat</Text> */}
                </div>
                {chatList && chatList.length !== 0 ? (
                  <div className="message-box" key={chatList.id}>
                    <Row gutter={[14, 0]}>
                      <Col span={8}>
                        <div className="message-box-left">
                          <div className="head">
                            {/* <Button
                                            type='primary'
                                            icon={<PlusOutlined />}
                                        >
                                            {'Create new Chat'}
                                        </Button> */}
                            <div className="search-box">
                              <img
                                src={require("../../../assets/images/icons/search-chat-list.svg")}
                                className="search-icon"
                                alt=""
                              />
                              <input
                                type="text"
                                placeholder="Search"
                                prefix={
                                  <SearchOutlined className="site-form-item-icon" />
                                }
                                value={this.state.filter}
                                onChange={this.searchText}
                              />
                            </div>
                            <div className="sort-filter">
                              <label>Show:</label>
                              {/* <Dropdown overlay={menu} trigger={["click"]}>
                                <a
                                  className="ant-dropdown-link"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  Inbox <CaretDownOutlined />
                                </a>
                              </Dropdown> */}
                              <Select
                                defaultValue="Inbox"
                                onChange={this.handleSorting}
                                dropdownClassName="msg-dropdown"
                              >
                                <Option value="inbox">Inbox</Option>
                                <Option value="unread">Unread</Option>
                                <Option value="newest">Newest</Option>
                                <Option value="oldest">Oldest</Option>
                                <Option value="block">Block</Option>
                              </Select>
                            </div>
                          </div>
                          <Paragraph className="msg-count">
                            {this.state.filter.length === 0
                              ? `You have ${chatList.length} messages`
                              : ""}
                          </Paragraph>
                          <div className="user-list">
                            {this.renderMessageList()}
                          </div>
                        </div>
                      </Col>
                      {itemDetail &&
                        itemDetail.receiver &&
                        itemDetail.sender && (
                          <ChatDetail
                            selectedUser={itemDetail && itemDetail}
                            onBlockUserSuccess={this.getAllChat}
                          />
                        )}
                    </Row>
                  </div>
                ) : (
                  <div className="message-box">
                    <Row gutter={[14, 0]}>
                      <Col span={8}>
                        <div className="message-box-left">
                          <div className="head">
                            <div className="search-box">
                              <img
                                src={require("../../../assets/images/icons/search-chat-list.svg")}
                                className="search-icon"
                                alt=""
                              />
                              <input
                                type="text"
                                placeholder="Search"
                                prefix={
                                  <SearchOutlined className="site-form-item-icon" />
                                }
                                value={this.state.filter}
                                onChange={this.searchText}
                              />
                            </div>
                            <div>
                              Show:
                              <Select
                                defaultValue="Inbox"
                                onChange={this.handleSorting}
                              >
                                <Option value="inbox">Inbox</Option>
                                <Option value="unread">Unread</Option>
                                <Option value="newest">Newest</Option>
                                <Option value="oldest">Oldest</Option>
                                <Option value="block">Block</Option>
                              </Select>
                            </div>
                          </div>
                          <Paragraph className="msg-count">{`No Chat found`}</Paragraph>

                          <div className="user-list"></div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  // <Empty description={"No Chat found"} />
                )}
              </div>
            </div>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getAllChat,
  enableLoading,
  disableLoading,
  getChatDetail,
  updateMessage,
})(Message);
