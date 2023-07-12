import React, { Component } from "react";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import copy from "copy-to-clipboard";
import {
  Col,
  Input,
  Avatar,
  Typography,
  Button,
  Menu,
  Dropdown,
  Modal,
  Image,
} from "antd";
import {
  PlusOutlined,
  SendOutlined,
  SmileOutlined,
  AppstoreOutlined,
  UserOutlined,
  EllipsisOutlined,
  FileTwoTone,
  PlayCircleOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import {
  enableLoading,
  disableLoading,
  getChatDetail,
  updateMessage,
  sendMessageAPI,
  getChatImages,
  deleteChatMessage,
  blockUnblockChatUser,
} from "../../../actions";
import { MESSAGES } from "../../../config/Message";
import { displayDateTimeFormate } from "../../../components/common";
import "./message.less";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import axios from "axios";
import { reverse } from "lodash";
import { Document, Page, pdfjs } from "react-pdf";
const { Title, Text } = Typography;
const { TextArea } = Input;

class ChatDetail extends Component {
  constructor(props) {
    super(props);
    const { selectedUser } = this.props;
    const { id } = this.props.loggedInUser;
    let distinctId =
      this.props.selectedUser.receiver.id === id
        ? this.props.selectedUser.sender.id
        : this.props.selectedUser.receiver.id;
    this.messagesEndRef = React.createRef();

    this.state = {
      visible: false,
      message: "",
      dropdownOpen: false,
      blockedUser: false,
      isRedirect: false,
      fromObject: false,
      showEmojis: false,
      source: "",
      type: "",
      isClick: false,
      search: "",
      isSearch: false,
      selectedMessage: null,
      copyMessage: null,
      selectedUserId: selectedUser.id,
      distinctId,
      reportmsg: "",
      confirmBlockUser: false,
      isModalVisible: false,
      clickedImage: "",
    };
  }

  scrollToBottom = () => {
    this.messagesEndRef.scroll({
      top: this.messagesEndRef.scrollHeight,
    });
  };

  /**
   * @method componentDidMount
   * @description Used to call just after mounting the component
   */

  showEmojis = (e) => {
    this.setState(
      {
        showEmojis: true,
      },
      () => document.addEventListener("click", this.closeMenu)
    );
  };

  addEmoji = (e) => {
    // console.log(e.native);
    console.log(e.native, "emojiiiii");
    let emoji = e.native;
    this.setState({
      message: this.state.message + emoji,
    });
  };

  closeMenu = (e) => {
    console.log(this.emojiPicker);
    if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
      this.setState(
        {
          showEmojis: false,
        },
        () => document.removeEventListener("click", this.closeMenu)
      );
    }
  };

  componentDidMount = () => {
    this.getDetails();
  };

  /**
   * @method componentWillReceiveProps
   * @description receive props
   */
  componentWillReceiveProps(nextprops, prevProps) {
    const { id } = this.props.loggedInUser;
    const { selectedUser } = this.props;

    let distinctId =
      this.props.selectedUser.receiver.id === id
        ? this.props.selectedUser.sender.id
        : this.props.selectedUser.receiver.id;
    let distinctIdNext =
      nextprops.selectedUser.receiver.id === id
        ? nextprops.selectedUser.sender.id
        : nextprops.selectedUser.receiver.id;
    if (selectedUser.id !== nextprops.selectedUser.id) {
      this.setState(
        {
          selectedUserId: nextprops.selectedUser.id,
          distinctId: distinctIdNext,
        },
        () => this.getDetails()
      );
    }
  }

  /**
   * @method getDetails
   * @description get details
   */
  getDetails = () => {
    const { userDetails } = this.props;
    const { selectedUserId, distinctId } = this.state;
    console.log("Enenquire_id@@@@@@@@@@@@@@@@@@@", this.props);
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!", selectedUserId);

    // const idd = this.props.selectedUser.messages.filter((read_status) => {
    //   return read_status.read_status === 0;
    // });
    // const id1 = idd.map((ee) => ee.id);
    // console.log("!!!!!!!!!!!!nnnnnnnnn12333333", id1);
    // console.log(
    //   "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^@@@^",
    //   this.props.selectedUser.messages
    // );

    if (this.props.selectedUser.object_type === "event") {
      let requestData = {
        chat_user_id: distinctId,
        user_id: userDetails.id,
        event_id: selectedUserId,
        limit: "",
        id: "",
      };
      // let reqData = {
      //   message_ids: id1.join(","),
      //   //  message_ids: id1.split(","),
      // };
      // this.props.enableLoading();
      // this.props.updateMessage(reqData, (res) => {
      //   this.props.disableLoading();

      //   if (res.status === 200) {
      //     //  this.setState({ getMessageDetails: res.data.data });
      //   }
      // });

      this.props.enableLoading();
      this.props.getChatDetail(requestData, (res) => {
        this.props.disableLoading();

        if (res.status === 200) {
          this.setState({ getMessageDetails: res.data.data }, () =>
            this.scrollToBottom()
          );
        }
      });
    } else if (this.props.selectedUser.object_type === "job") {
      let requestData = {
        chat_user_id: distinctId,
        user_id: userDetails.id,
        // classified_id: selectedUserId,
        job_id: selectedUserId,
        limit: "",
        id: "",
      };
      // let reqData = {
      //   message_ids: id1.join(","),
      //   //  message_ids: id1.split(","),
      // };
      // this.props.enableLoading();
      // this.props.updateMessage(reqData, (res) => {
      //   this.props.disableLoading();

      //   if (res.status === 200) {
      //     //  this.setState({ getMessageDetails: res.data.data });
      //   }
      // });

      this.props.enableLoading();
      this.props.getChatDetail(requestData, (res) => {
        this.props.disableLoading();

        if (res.status === 200) {
          this.setState({ getMessageDetails: res.data.data }, () =>
            this.scrollToBottom()
          );
        }
      });
    } else if (this.props.selectedUser.object_type === "service") {
      let requestData = {
        chat_user_id: distinctId,
        user_id: userDetails.id,
        // classified_id: selectedUserId,
        // job_id: selectedUserId,
        service_booking_id: selectedUserId,
        limit: "",
        id: "",
      };

      // let reqData = {
      //   message_ids: id1.join(","),
      //   //  message_ids: id1.split(","),
      // };
      // this.props.enableLoading();
      // this.props.updateMessage(reqData, (res) => {
      //   this.props.disableLoading();

      //   if (res.status === 200) {
      //     //  this.setState({ getMessageDetails: res.data.data });
      //   }
      // });

      this.props.enableLoading();
      this.props.getChatDetail(requestData, (res) => {
        this.props.disableLoading();

        if (res.status === 200) {
          this.setState({ getMessageDetails: res.data.data }, () =>
            this.scrollToBottom()
          );
        }
      });
    } else if (this.props.selectedUser.object_type === "quote") {
      let requestData = {
        chat_user_id: distinctId,
        user_id: userDetails.id,
        // classified_id: selectedUserId,
        trader_quote_request_id: selectedUserId,
        limit: "",
        id: "",
      };
      // let reqData = {
      //   message_ids: id1.join(","),
      //   //  message_ids: id1.split(","),
      // };
      // this.props.enableLoading();
      // this.props.updateMessage(reqData, (res) => {
      //   this.props.disableLoading();

      //   if (res.status === 200) {
      //     //  this.setState({ getMessageDetails: res.data.data });
      //   }
      // });

      this.props.enableLoading();
      this.props.getChatDetail(requestData, (res) => {
        this.props.disableLoading();

        if (res.status === 200) {
          this.setState({ getMessageDetails: res.data.data }, () =>
            this.scrollToBottom()
          );
        }
      });
    } else if (this.props.selectedUser.object_type === "enquire") {
      let requestData = {
        chat_user_id: distinctId,
        user_id: userDetails.id,
        enquire_id: selectedUserId,
        limit: "",
        id: "",
      };
      // let reqData = {
      //   message_ids: id1.join(","),
      //   //  message_ids: id1.split(","),
      // };
      // this.props.enableLoading();
      // this.props.updateMessage(reqData, (res) => {
      //   this.props.disableLoading();

      //   if (res.status === 200) {
      //     //  this.setState({ getMessageDetails: res.data.data });
      //   }
      // });

      this.props.enableLoading();
      this.props.getChatDetail(requestData, (res) => {
        this.props.disableLoading();

        if (res.status === 200) {
          this.setState({ getMessageDetails: res.data.data }, () =>
            this.scrollToBottom()
          );
        }
      });
    } else {
      let requestData = {
        chat_user_id: distinctId,
        user_id: userDetails.id,
        classified_id: selectedUserId,
        limit: "",
        id: "",
      };

      // let reqData = {
      //   message_ids: id1.join(","),
      //   //  message_ids: id1.split(","),
      // };
      // this.props.enableLoading();
      // this.props.updateMessage(reqData, (res) => {
      //   this.props.disableLoading();

      //   if (res.status === 200) {
      //     //  this.setState({ getMessageDetails: res.data.data });
      //   }
      // });

      this.props.enableLoading();
      this.props.getChatDetail(requestData, (res) => {
        this.props.disableLoading();

        if (res.status === 200) {
          this.setState({ getMessageDetails: res.data.data }, () =>
            this.scrollToBottom()
          );
        }
      });
    }
  };
  /**
   * @method sendMessageToTalent
   * @description used to send message to user
   */
  sendMessage = () => {
    const { loggedInUser, selectedUser } = this.props;
    const { id } = this.props.loggedInUser;
    const { reportmsg } = this.state;
    // console.log("$$$$$$$$$$$$$$$$$$$$111111111111112222", this.props);

    if (this.props.selectedUser.object_type === "event") {
      if (this.state.message) {
        let distinctId =
          this.props.selectedUser.receiver.id === id
            ? this.props.selectedUser.sender.id
            : this.props.selectedUser.receiver.id;
        if (reportmsg) {
          const requestData = {
            // classifiedid: selectedUser.id,
            event_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: reportmsg + this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "", reportmsg: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        } else {
          const requestData = {
            // classifiedid: selectedUser.id,
            event_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        }
      }
    } else if (this.props.selectedUser.object_type === "job") {
      if (this.state.message) {
        let distinctId =
          this.props.selectedUser.receiver.id === id
            ? this.props.selectedUser.sender.id
            : this.props.selectedUser.receiver.id;
        if (reportmsg) {
          const requestData = {
            //trader_quote_request_id: selectedUser.id,
            job_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: reportmsg + this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "", reportmsg: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        } else {
          const requestData = {
            // classifiedid: selectedUser.id,
            //trader_quote_request_id: selectedUser.id,
            job_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        }
      }
    } else if (this.props.selectedUser.object_type === "service") {
      if (this.state.message) {
        let distinctId =
          this.props.selectedUser.receiver.id === id
            ? this.props.selectedUser.sender.id
            : this.props.selectedUser.receiver.id;
        if (reportmsg) {
          const requestData = {
            // classifiedid: selectedUser.id,
            service_booking_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: reportmsg + this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "", reportmsg: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        } else {
          const requestData = {
            // classifiedid: selectedUser.id,
            service_booking_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        }
      }
    } else if (this.props.selectedUser.object_type === "quote") {
      if (this.state.message) {
        let distinctId =
          this.props.selectedUser.receiver.id === id
            ? this.props.selectedUser.sender.id
            : this.props.selectedUser.receiver.id;
        if (reportmsg) {
          const requestData = {
            trader_quote_request_id: selectedUser.id,
            //job_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: reportmsg + this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "", reportmsg: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        } else {
          const requestData = {
            // classifiedid: selectedUser.id,
            trader_quote_request_id: selectedUser.id,
            //job_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        }
      }
    } else if (this.props.selectedUser.object_type === "enquire") {
      if (this.state.message) {
        let distinctId =
          this.props.selectedUser.receiver.id === id
            ? this.props.selectedUser.sender.id
            : this.props.selectedUser.receiver.id;
        if (reportmsg) {
          const requestData = {
            // classifiedid: selectedUser.id,
            enquire_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: reportmsg + this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "", reportmsg: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        } else {
          const requestData = {
            // classifiedid: selectedUser.id,
            enquire_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        }
      }
    } else {
      if (this.state.message) {
        let distinctId =
          this.props.selectedUser.receiver.id === id
            ? this.props.selectedUser.sender.id
            : this.props.selectedUser.receiver.id;
        if (reportmsg) {
          const requestData = {
            classifiedid: selectedUser.id,
            //job_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: reportmsg + this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "", reportmsg: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        } else {
          const requestData = {
            classifiedid: selectedUser.id,
            //job_id: selectedUser.id,
            receiver_id: distinctId,
            user_id: id,
            massage: this.state.message,
          };
          this.props.sendMessageAPI(requestData, (res) => {
            console.log(res, "requestdata");
            if (res.status === 200) {
              toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
              this.setState({ message: "" });
              this.getDetails(distinctId, selectedUser.id);
            }
          });
        }
      }
    }
  };

  // onCancel = () => {
  //   console.log("okkkkkko");
  // };
  onReport = () => {
    const { selectedMessage } = this.state;
    this.setState({ reportmsg: selectedMessage.massage });
  };
  onRemoveMessage = () => {
    const { selectedMessage } = this.state;

    const { userDetails } = this.props;
    let reqData = {
      user_id: userDetails.id,
      message_id: selectedMessage.id,
    };
    this.props.enableLoading();
    this.props.deleteChatMessage(reqData, (res) => {
      this.props.disableLoading();
      if (res.status == 200) {
        toastr.success("Success", "Message deleted.");
        this.getDetails();
      } else {
        toastr.error("Error occured", "Please try again later.");
      }
    });
  };
  openImage(el) {
    console.log("OpenImage@@@@", el.massage);
    this.setState({ isModalVisible: true, clickedImage: el.massage });

    // return <Image width={200} src={el.message} />;
  }
  /**
   * @method renderChatDetail
   * @description get chat details
   */
  renderChatDetail = () => {
    const { getMessageDetails, source, type, selectedMessage } = this.state;
    const { loggedInUser, selectedUser } = this.props;
    if (selectedUser && getMessageDetails) {
      const menuicon = (
        <Menu className="copymessage">
          <Menu.Item key="0">
            <div
              onClick={() => {
                navigator.clipboard.writeText(this.state.copyMessage);
              }}
              className="edit-delete-icons"
            >
              <a href="javascript:void(0)">
                <span>Copy</span>
              </a>
            </div>
          </Menu.Item>
          <Menu.Item key="1">
            <div className="edit-delete-icons">
              <a href="javascript:void(0)" onClick={this.onRemoveMessage}>
                <span>Remove</span>
              </a>
            </div>
          </Menu.Item>
          {selectedMessage && loggedInUser.id !== selectedMessage.sender_id && (
            <Menu.Item key="2">
              <div className="edit-delete-icons">
                <a href="javascript:void(0)">
                  <span onClick={this.onReport}>Report</span>
                </a>
              </div>
            </Menu.Item>
          )}
        </Menu>
      );

      return (
        getMessageDetails &&
        getMessageDetails
          .map((el, i) => {
            if (loggedInUser.id !== el.sender_id) {
              return (
                <div className="receive-msg">
                  {selectedUser.receiver.image && el.deleted_at == 1 ? (
                    <Avatar
                      src={selectedUser.receiver.image}
                      alt={""}
                      size={54}
                    />
                  ) : el.deleted_at == 1 ? (
                    <Avatar size={36} icon={<UserOutlined />} />
                  ) : null}
                  <div className="msg">
                    {el.massage.includes("https") ? null : el.deleted_at ==
                      1 ? (
                      <p className="msg-text">{el.massage}</p>
                    ) : null}
                    {el.massage.includes("jpeg") ||
                    el.massage.includes("png") ||
                    el.massage.includes("gif") ||
                    el.massage.includes("raw") ||
                    el.massage.includes("tiff") ? (
                      <span
                        className="attachment"
                        onClick={() => {
                          this.openImage(el);
                        }}
                      >
                        <img
                          src={el.massage}
                          alt=""
                          className="attach-icon"
                          width="60px"
                          height="70px"
                        />
                      </span>
                    ) : null}
                    {el.massage.includes("mp4") ||
                    el.massage.includes("mov") ||
                    el.massage.includes("wmv") ||
                    el.massage.includes("fiv") ||
                    el.massage.includes("avi") ||
                    el.massage.includes("mkv") ? (
                      <video width="200" height="200" controls>
                        <source src={el.massage} type={type} />
                      </video>
                    ) : null}
                    {el.massage.includes("doc") ||
                    el.massage.includes("pdf") ||
                    el.massage.includes("docx") ? (
                      <object
                        width="100%"
                        height="300"
                        data={el.massage}
                        type={type}
                      >
                        {" "}
                      </object>
                    ) : null}
                    {el.massage.includes("wav") ||
                    el.massage.includes("mp3") ? (
                      <audio width="200" height="200" controls>
                        <source src={source} type="audio/mp4" />
                      </audio>
                    ) : null}
                    {el.deleted_at == 1 ? (
                      <div className="duration">
                        {displayDateTimeFormate(el.updated_at)}
                      </div>
                    ) : null}
                  </div>
                  {el.deleted_at == 1 ? (
                    <Dropdown
                      overlay={menuicon}
                      trigger={["click"]}
                      overlayClassName="show-phone-number retail-dashboard"
                      placement="bottomRight"
                      arrow
                      onClick={() =>
                        this.setState({
                          selectedMessage: el,
                          copyMessage: el.massage,
                        })
                      }
                    >
                      <EllipsisOutlined
                        style={{ fontSize: 30, color: "#90A8BE" }}
                      />
                    </Dropdown>
                  ) : null}
                </div>
              );
            } else {
              return (
                <div className="sent-msg">
                  {el.deleted_at == 1 ? (
                    <Dropdown
                      overlay={menuicon}
                      trigger={["click"]}
                      overlayClassName="show-phone-number retail-dashboard"
                      placement="bottomRight"
                      arrow
                      onClick={() =>
                        this.setState({
                          selectedMessage: el,
                          copyMessage: el.massage,
                        })
                      }
                    >
                      <EllipsisOutlined
                        style={{ fontSize: 30, color: "#90A8BE" }}
                      />
                    </Dropdown>
                  ) : null}

                  {el.deleted_at == 1 ? (
                    <div className="msg">
                      {el.massage.includes("https") ? null : el.deleted_at ==
                        1 ? (
                        <p className="msg-text">{el.massage}</p>
                      ) : null}

                      {el.massage.includes("jpeg") ||
                      el.massage.includes("png") ||
                      el.massage.includes("gif") ||
                      el.massage.includes("raw") ||
                      el.massage.includes("tiff") ? (
                        <span
                          className="attachment"
                          onClick={() => {
                            this.openImage(el);
                          }}
                        >
                          <img
                            src={el.massage}
                            alt=""
                            className="attach-icon"
                            width="60px"
                            height="70px"
                          />
                        </span>
                      ) : null}
                      {el.massage.includes("mp4") ||
                      el.massage.includes("mov") ||
                      el.massage.includes("wmv") ||
                      el.massage.includes("fiv") ||
                      el.massage.includes("avi") ||
                      el.massage.includes("mkv") ? (
                        <video width="200" height="200" controls>
                          <source src={el.massage} type={type} />
                        </video>
                      ) : null}
                      {el.massage.includes("doc") ||
                      el.massage.includes("pdf") ||
                      el.massage.includes("docx") ? (
                        <object
                          width="100%"
                          height="300"
                          data={el.massage}
                          type={type}
                        >
                          {" "}
                        </object>
                      ) : null}
                      {el.massage.includes("wav") ||
                      el.massage.includes("mp3") ? (
                        <audio width="200" height="200" controls>
                          <source src={source} type="audio/mp4" />
                        </audio>
                      ) : null}
                      {el.deleted_at == 1 ? (
                        <div className="duration">
                          {displayDateTimeFormate(el.updated_at)}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  {el.deleted_at == 1 ? (
                    <img
                      src={require("../../../assets/images/icons/all-done.png")}
                      alt=""
                      className="all-done"
                    />
                  ) : null}
                </div>
              );
            }
          })
          .reverse()
      );
    }
  };

  /**
   * @method handleText
   * @description handle  message change
   */
  handleText = (e) => {
    const { ChosenEmoji } = this.state;
    let message = e.target.value;
    this.setState({ message: message });
  };

  onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      this.sendMessage();
    }
  };

  getGallery = async (event) => {
    console.log(" Gallery File Uploading", event.target.files);
    let types = event.target.files[0].type;
    if (
      types == "image/jpg" ||
      types == "image/jpeg" ||
      types == "image/gif" ||
      types == "image/gif" ||
      types == "image/png" ||
      types == "image/raw"
    ) {
      let form = new FormData();
      form.append("image", event.target.files[0]);
      const row = await axios.post(
        "https://devformee.mangoitsol.com/formee/api/image_send_msg",
        form
      );
      this.setState({ message: row.data.url });
      console.log("SOURCE", this.state.message);
      this.sendMessage();
    } else {
      toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
      console.log("Please Select Right Image  Format");
    }
  };

  getFiles = async (event) => {
    let types = event.target.files[0].type;
    console.log("#################", types);
    if (
      types == "application/doc" ||
      types == "application/pdf" ||
      types == "application/docx"
    ) {
      let form = new FormData();
      form.append("image", event.target.files[0]);
      const row = await axios.post(
        "https://devformee.mangoitsol.com/formee/api/image_send_msg",
        form
      );
      this.setState({ message: row.data.url });
      console.log("SOURCE", this.state.message);
      this.sendMessage();
    } else {
      toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
      console.log("Please Select Right Pdf Format");
    }
  };

  getVideo = async (event) => {
    console.log(" Video File Uploading", event.target.files);
    let types = event.target.files[0].type;
    if (
      types == "video/mp4" ||
      types == "video/mov" ||
      types == "video/wmv" ||
      types == "video/fiv" ||
      types == "video/avi" ||
      types == "video/mkv"
    ) {
      let form = new FormData();
      form.append("image", event.target.files[0]);
      const row = await axios.post(
        "https://devformee.mangoitsol.com/formee/api/image_send_msg",
        form
      );
      this.setState({ message: row.data.url });
      console.log("SOURCE", this.state.message);
      this.sendMessage();
    } else {
      toastr.success("Success", MESSAGES.MESSAGE_SENT_SUCCESS);
      console.log("Please Select Right Videos Format");
    }
  };

  event1 = (e) => {
    const { getMessageDetails } = this.state;
    const { loggedInUser, selectedUser } = this.props;
    const { id } = this.props.loggedInUser;
    console.log("Event Called", e.target.value);
    let distinctId =
      this.props.selectedUser.receiver.id === id
        ? this.props.selectedUser.sender.id
        : this.props.selectedUser.receiver.id;
    if (!e.target.value) {
      this.getDetails(distinctId, selectedUser.id);
    } else {
      this.setState({ search: e.target.value });
    }
    // if(!e.target.value){
    //     this.setState({isSearch:true})
    // }else{
    //     this.setState({isSearch:false})
    // }
  };
  onSubmit = () => {
    const { search, getMessageDetails, isSearch } = this.state;
    console.log("Submit Button Called", search);
    const { type, message } = this.state;
    console.log("MESSAGE DETAILS", getMessageDetails);
    let filteredValues = getMessageDetails.filter((val) => {
      if (val.massage.toLowerCase().includes(search.toLowerCase())) {
        return val;
      }
    });
    console.log("FIlterted", filteredValues);
    // if(filteredValues){
    this.setState({ getMessageDetails: filteredValues });
    //     this.setState({isSearch:""})
    //     this.setState({isSearch:true})
    // }else if(!filteredValues){
    //     this.setState({isSearch:""})
    //     this.setState({isSearch:false})
    // }
    this.setState({ isSearch: true });
    if (isSearch == true) {
      this.setState({ isSearch: false });
    }
    // let demo=getMessageDetails.filter((val)=>{
    //    if( val.massage=="qqq" && val.sender_id!=1700 && val.receiver_id!=1735){
    //     return val;
    //   }
    // })
  };

  unblocked = () => {
    const { loggedInUser } = this.props;
    const { distinctId } = this.state;
    let reqData = {
      user_id: loggedInUser.id,
      blocked_user_id: distinctId,
      status: "unblock",
    };
    this.props.enableLoading();
    this.props.blockUnblockChatUser(reqData, (res) => {
      this.props.disableLoading();
      if (res.status == 200) {
        toastr.success("Success", "User unblocked.");
        // this.props.onBlockUserSuccess();
      } else {
        toastr.error("Error occured", "Please try again later.");
      }
    });
  };

  getInitialState() {
    return { showHideSidenav: "hidden" };
  }
  clickImage = () => {
    const { isClick } = this.state;
    if (isClick == false) {
      this.setState({ isClick: true });
    } else {
      this.setState({ isClick: false });
    }
  };

  onBlockUser = () => {
    // call report api
    const { loggedInUser } = this.props;
    const { distinctId } = this.state;
    let reqData = {
      user_id: loggedInUser.id,
      blocked_user_id: distinctId,
      status: "block", // block/unblock
    };
    this.props.enableLoading();
    this.props.blockUnblockChatUser(reqData, (res) => {
      this.props.disableLoading();
      if (res.status == 200) {
        toastr.success("Success", "User blocked.");
        this.props.onBlockUserSuccess();
        this.setState({
          confirmBlockUser: false,
        });
      } else {
        toastr.error("Error occured", "Please try again later.");
      }
    });
  };

  /**
   * @method render
   * @description render screen
   */
  render() {
    const { confirmBlockUser } = this.state;

    const { isLoggedIn } = this.props;

    const toggleplus = false;
    const { reportmsg } = this.state;
    // console.log("**************************", reportmsg);
    isLoggedIn &&
      document.body.classList.add(
        "user_type_" + this.props.loggedInUser.user_type
      );
    console.log(this.state.message, "messssagedata");
    const { selectedUser, loggedInUser } = this.props;
    const { message } = this.state;

    let distinctData =
      this.props.selectedUser.receiver.id === loggedInUser.id
        ? this.props.selectedUser.sender
        : this.props.selectedUser.receiver;
    // console.log("messageData");
    //console.log("#####################################", distinctData);
    // let changeClass = async(event) => {
    //     console.log(this);
    // }
    const chatOptions = (
      <Menu className="block-section-dropdown">
        <Menu.Item key="0">
          <div className="edit-delete-icons">
            {this.props.selectedUser.is_blocked_user === 1 ? (
              <a href="javascript:void(0)" onClick={this.unblocked}>
                <span>Unblock</span>
              </a>
            ) : (
              <a
                href="javascript:void(0)"
                onClick={() => this.setState({ confirmBlockUser: true })}
              >
                <span>Block</span>
              </a>
            )}
          </div>
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Col span={16}>
          <div className="message-box-right">
            <div className="head chat-head">
              {distinctData.image ? (
                <Avatar src={distinctData.image} alt={""} size={54} />
              ) : (
                <Avatar size={54} icon={<UserOutlined />} />
              )}
              <div className="pl-20 chat-person">
                <Title level={4} className="title">
                  {distinctData && distinctData.name}
                </Title>
                <a href="javascript:void(0);" className="service-name">
                  {selectedUser.title}
                </a>
                {/* <Text className='duration'>{selectedUser && displayDateTimeFormate(selectedUser.messages[0].updated_at)}</Text> */}
                <span>{this.title}</span>
              </div>
              <div className="header-right">
                <div
                  className={
                    this.state.isSearch == true
                      ? "true Class  chat-search"
                      : "false Class  chat-search"
                  }
                >
                  <input
                    type="button"
                    onClick={this.onSubmit}
                    value="Search"
                    className="search-button"
                  />
                  <input type="text" onChange={this.event1} />
                </div>
                <div className="chat-option" style={{ margin: 10 }}>
                  <Dropdown
                    overlay={chatOptions}
                    trigger={["click"]}
                    overlayClassName="show-phone-number retail-dashboard"
                    placement="bottomRight"
                    arrow
                  >
                    <svg
                      width="5"
                      height="17"
                      viewBox="0 0 5 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.71649 4.81189C3.79054 4.81189 4.66931 3.93312 4.66931 2.85907C4.66931 1.78502 3.79054 0.90625 2.71649 0.90625C1.64244 0.90625 0.763672 1.78502 0.763672 2.85907C0.763672 3.93312 1.64244 4.81189 2.71649 4.81189ZM2.71649 6.76471C1.64244 6.76471 0.763672 7.64348 0.763672 8.71753C0.763672 9.79158 1.64244 10.6704 2.71649 10.6704C3.79054 10.6704 4.66931 9.79158 4.66931 8.71753C4.66931 7.64348 3.79054 6.76471 2.71649 6.76471ZM2.71649 12.6232C1.64244 12.6232 0.763672 13.5019 0.763672 14.576C0.763672 15.65 1.64244 16.5288 2.71649 16.5288C3.79054 16.5288 4.66931 15.65 4.66931 14.576C4.66931 13.5019 3.79054 12.6232 2.71649 12.6232Z"
                        fill="#C5C7CD"
                      />
                    </svg>
                  </Dropdown>
                </div>
              </div>
            </div>

            <div className="content" ref={(el) => (this.messagesEndRef = el)}>
              {this.renderChatDetail()}
            </div>
            <div className="message-input">
              {/* <Button
                            type='primary'
                            shape='circle'
                        >
                            <PlusOutlined />
                        </Button> */}
              <span
                className={
                  this.state.isClick == true
                    ? "active plus-attachment"
                    : "plus-attachment"
                }
              >
                <img
                  src={require("./icon/plus.svg")}
                  alt="edit"
                  className="attachment-image"
                  onClick={this.clickImage}
                />
                <div
                  className={
                    this.state.isClick == true
                      ? "openbox attachment"
                      : "noopen attachment"
                  }
                >
                  <label htmlFor="videos">
                    <span>
                      <img
                        src={require("./icon/film.svg")}
                        alt="edit"
                        className="attachment"
                      />
                    </span>
                  </label>
                  <label htmlFor="files">
                    <span>
                      <img
                        src={require("./icon/file.svg")}
                        alt="edit"
                        className="attachment"
                      />
                    </span>
                  </label>

                  <label htmlFor="gallery">
                    <span>
                      <img
                        src={require("./icon/image.svg")}
                        alt="edit"
                        className="attachment"
                      />
                    </span>
                  </label>

                  <input
                    type="file"
                    id="videos"
                    style={{ display: "none" }}
                    multiple={false}
                    onChange={this.getVideo}
                  />

                  <input
                    type="file"
                    id="files"
                    style={{ display: "none" }}
                    multiple={false}
                    onChange={this.getFiles}
                  />
                  <input
                    type="file"
                    id="gallery"
                    style={{ display: "none" }}
                    multiple={false}
                    onChange={this.getGallery}
                  />
                </div>
              </span>
              {/* <span
                className="reportt"
                style={{ marginTop: "0" }}
                // onClick={this.onCancel}
              >
                {reportmsg}
              </span> */}
              <TextArea
                value={
                  this.state.message.includes("https")
                    ? null
                    : this.state.message
                }
                rows={1}
                placeholder="Type a message here"
                onChange={this.handleText}
                onKeyDown={this.onEnterPress}
              />
              {this.state.showEmojis ? (
                <span ref={(el) => (this.emojiPicker = el)}>
                  <Picker
                    onSelect={this.addEmoji}
                    style={{
                      position: "absolute",
                      bottom: "76px",
                      height: "418",
                      width: "301px",
                      right: "20px",
                    }}
                  />
                  <p className="smilie">
                    <svg
                      width="23"
                      height="24"
                      viewBox="0 0 23 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="11.3831"
                        cy="11.9046"
                        r="9.9046"
                        stroke="#707C97"
                        stroke-opacity="0.5"
                        stroke-width="2.5"
                      />
                      <path
                        d="M7.32715 13.4258C8.08949 14.9323 9.6198 15.9609 11.3834 15.9609C13.1469 15.9609 14.6772 14.9323 15.4396 13.4258"
                        stroke="#707C97"
                        stroke-opacity="0.5"
                        stroke-width="2.5"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="8.3412"
                        cy="8.86171"
                        r="1.01405"
                        fill="#707C97"
                        fill-opacity="0.5"
                      />
                      <circle
                        cx="14.4252"
                        cy="8.86171"
                        r="1.01405"
                        fill="#707C97"
                        fill-opacity="0.5"
                      />
                    </svg>
                  </p>
                </span>
              ) : (
                <p className="smilie" onClick={this.showEmojis}>
                  {
                    <svg
                      width="23"
                      height="24"
                      viewBox="0 0 23 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="11.3831"
                        cy="11.9046"
                        r="9.9046"
                        stroke="#707C97"
                        stroke-opacity="0.5"
                        stroke-width="2.5"
                      />
                      <path
                        d="M7.32715 13.4258C8.08949 14.9323 9.6198 15.9609 11.3834 15.9609C13.1469 15.9609 14.6772 14.9323 15.4396 13.4258"
                        stroke="#707C97"
                        stroke-opacity="0.5"
                        stroke-width="2.5"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="8.3412"
                        cy="8.86171"
                        r="1.01405"
                        fill="#707C97"
                        fill-opacity="0.5"
                      />
                      <circle
                        cx="14.4252"
                        cy="8.86171"
                        r="1.01405"
                        fill="#707C97"
                        fill-opacity="0.5"
                      />
                    </svg>
                  }
                </p>
              )}
              {/* 
                         <span>
                  <Picker onSelect={this.addEmoji} />
                           </span> */}
              {/* <div className='emoji-icons'>
                            <SmileOutlined />
                        </div> */}
              <Button
                type="primary"
                shape="circle"
                className="btn-send"
                onClick={this.sendMessage}
                disabled={message === "" ? true : false}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M9.58671 14.0414C9.57044 14.0414 9.55495 14.0406 9.53946 14.0399C9.18933 14.0189 8.89729 13.7649 8.82758 13.4209L7.63621 7.55934C7.57423 7.25414 7.33643 7.01633 7.03122 6.95436L1.16964 5.76221C0.825703 5.69327 0.571626 5.40124 0.550711 5.05111C0.529796 4.7002 0.745916 4.37951 1.07901 4.26951L13.473 0.138435C13.7511 0.0439308 14.0578 0.116746 14.2654 0.32512C14.473 0.532719 14.5451 0.839471 14.4529 1.11756L10.3211 13.5116C10.2157 13.8299 9.91825 14.0414 9.58671 14.0414Z"
                    fill="#231F20"
                  />
                </svg>

                {/* <SendOutlined /> */}
                {/* <span class="send-outlined"></span> */}
              </Button>
            </div>
          </div>
        </Col>
        {
          <Modal
            title=""
            visible={this.state.isModalVisible}
            footer={false}
            width={1000}
            onCancel={() => this.setState({ isModalVisible: false })}
          >
            <img src={this.state.clickedImage}></img>
          </Modal>
        }
        {confirmBlockUser && (
          <Modal
            title=""
            visible={confirmBlockUser}
            className={
              "custom-modal style1 cancellation-reason-modal block-user"
            }
            footer={false}
            onCancel={() => this.setState({ confirmBlockUser: false })}
            destroyOnClose={true}
          >
            <div
              className="content-block"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div>
                <DeleteFilled />
              </div>
              <h3
                style={{
                  color: "#EE4928",
                }}
              >
                Block this user?
              </h3>
              <p>You will no longer receive messages from this user.</p>
              <div className="button-block">
                <button
                  className="ant-btn-default grey-without-border mr-5"
                  onClick={() => {
                    this.setState({
                      confirmBlockUser: false,
                    });
                  }}
                >
                  No, Cancel
                </button>
                <button
                  className="ant-btn-default btn-orange-fill ml-5"
                  onClick={this.onBlockUser}
                >
                  Yes, Block
                </button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

/**
 * @method mapStateToProps
 * @description return state to component as props
 *  @param {} state
 */
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

export default connect(mapStateToProps, {
  getChatDetail,
  updateMessage,
  sendMessageAPI,
  enableLoading,
  disableLoading,
  deleteChatMessage,
  blockUnblockChatUser,
})(ChatDetail);
