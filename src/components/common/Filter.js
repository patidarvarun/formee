import React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppSidebar from "../sidebar";
import {
  Tabs,
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Breadcrumb,
} from "antd";
import {
  getClassfiedCategoryListing,
  enableLoading,
  disableLoading,
  getClassfiedCategoryDetail,
  getChildCategory,
  deleteSaveSearchList,
  applyClassifiedFilterAttributes,
  getSaveSearchList,
  saveSearch,
  getClassifiedDynamicInput,
  editSaveSearchList,
  openLoginModel,
} from "../../actions";
import Icon from "../../components/customIcons/customIcons";
import history from "../../common/History";
import { toastr } from "react-redux-toastr";
import { renderField } from "../forminput";
import { MESSAGES } from "../../config/Message";
import { STATUS_CODES } from "../../config/StatusCode";
import PlacesAutocomplete from "../common/LocationInput";
import AutoComplete from "../forminput/AutoComplete";
import { langs } from "../../config/localization";
import {
  getClassifiedSubcategoryRoute,
  getClassifiedCatLandingRoute,
} from "../../common/getRoutes";
import moment from "moment";

const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

class Filter extends React.Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      key: "tab1",
      noTitleKey: "app",
      classifiedList: [],
      attribute: [],
      savedSearch: [],
      label: false,
      isSaveSearch: false,
      templateName: "",
      isEdit: {
        flag: false,
        id: undefined,
      },
      emailFrequency: [
        { id: 0, name: "Immediately" },
        { id: 1, name: "Daily" },
        { id: 2, name: "Weekly" },
        { id: 3, name: "never" },
      ],
      postedWithIn: [
        { id: "1-10", name: "1 - 10 days" },
        { id: "10-20", name: "10 - 20 days" },
        { id: "20-30", name: "20 - 30 days" },
      ],
      address: null,
      selectedOption: {},
      selectedFrequency: "",
      allIds: "",
      tempSlug: '',
      catName: '',
      catId: '',
      subCatName: '',
      subCatId: '',
      templateName: '',
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    let parameter = this.props.match.params;
    let catId = parameter.classified_id;
    let categoryId = parameter.categoryId;
    let isJobPage =
      parameter.subCategoryId === undefined && parameter.categoryId;
    if (parameter.all === langs.key.all && isJobPage) {
      this.props.enableLoading();
      this.props.getChildCategory({ pid: categoryId }, (res1) => {
        this.props.disableLoading();
        if (res1.status === 200) {
          const data =
            Array.isArray(res1.data.newinsertcategories) &&
            res1.data.newinsertcategories;
          let classifiedId = data && data.length && data.map((el) => el.id);
          if (classifiedId && classifiedId.length) {
            let id = classifiedId.join(",");
            this.getClassifiedListing(id);
            this.props.getClassifiedDynamicInput(
              { categoryid: id, filter: 1 },
              (res) => {
                if (res.status === 200) {
                  const atr = Array.isArray(res.data.attributes)
                    ? res.data.attributes
                    : [];
                  this.setState({ attribute: atr, allIds: id });
                  this.props.isLoggedIn && this.getAllSavedFilter()
                }
              }
            );
          }
        }
      });
    } else {
      let subCategoryId = parameter.subCategoryId;
      this.getClassifiedListing(subCategoryId);
      this.props.enableLoading();
      this.props.getClassifiedDynamicInput(
        { categoryid: subCategoryId, filter: 1 },
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            const atr = Array.isArray(res.data.attributes)
              ? res.data.attributes
              : [];
            this.setState({ attribute: atr });
            this.props.isLoggedIn && this.getAllSavedFilter()
          }
        }
      );
    }
  }

  /**
   * @method getClassifiedListing
   * @description called to get ClassifiedListing
   */
  getAllSavedFilter = () => {
    const { isLoggedIn, loggedInDetail } = this.props
    let loggedInId = isLoggedIn && loggedInDetail.id;
    let reqData = {
      user_id: loggedInId !== undefined ? loggedInId : 0,
    };
    this.props.getSaveSearchList(reqData, (res) => {
      if (res.status === 1) {
        this.setState({ savedSearch: res.data });
      }
    });
  };

  /**
   * @method getClassifiedListing
   * @description called to get ClassifiedListing
   */
  getClassifiedListing = (id) => {
    let reqData = {
      id: id,
      page: 1,
      page_size: 9,
    };
    this.props.getClassfiedCategoryListing(reqData, (res) => {
      if (res.status === 200) {
        // let templateName =
        //   Array.isArray(res.data.data) &&
        //   res.data.data.length &&
        //   res.data.data[0].template_slug;
        this.setState({
          classifiedList: res.data.data,
          tempSlug: res.data.template_slug,
          catName: res.data.category_name,
          catId: res.data.category_id,
          subCatName: res.data.sub_category_name,
          subCatId: res.data.sub_category_id,
          templateName: res.data.template_slug,
        });
      }
    });
  };

  /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = () => {
    const { attribute } = this.state;
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
        return (
          <Row gutter={[14, 0]}>
            <Col md={24}>
              {renderField(data, data.attr_type_name, data.value, true, false)}
            </Col>
          </Row>
        );
      });
    }
  };

  /**
   * @method applyFilter
   * @description appy filter
   */
  applyFilter = (value) => {
    const {
      attribute,
      classifiedList,
      isSaveSearch,
      selectedOption,
      isEdit,
      address,
      allIds,
      catId,
      subCatName,
      subCatId,
      tempSlug,
      catName
    } = this.state;
    let parameter = this.props.match.params;
    let categoryId = catId
    // parameter.categoryId;
    let categoryName = catName
    // parameter.categoryName;
    let subCategoryId = subCatId
    // parameter.all === langs.key.all ? allIds : parameter.subCategoryId;
    let subCategoryName = subCatName
    //  parameter.subCategoryName;
    let templateName = tempSlug
    // classifiedList.length && classifiedList[0].template_slug;
    let allData = parameter.all === langs.key.all ? true : false;
    let subCategoryPath = getClassifiedSubcategoryRoute(
      templateName,
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      allData
    );

    let index = Object.keys(value).findIndex((el) => value[el] !== undefined);
    let index2 = Object.keys(selectedOption).length === 0;
    if (index2 && index < 0) {
      toastr.warning(langs.warning, MESSAGES.ATLEAST_ONE_FILTER);
      return true;
    }
    let temp = {};

    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        attribute.map((el, index) => {
          if (el.att_name == key) {
            let att = attribute[index];
            let dropDropwnValue;
            if (att.attr_type_name === "Drop-Down") {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id === value[key]
              );
              dropDropwnValue = att.value[selectedValueIndex];
            }

            temp[att.att_id] = {
              name: att.att_name,
              attr_type_id: att.attr_type,
              attr_value:
                att.attr_type_name === "Drop-Down"
                  ? dropDropwnValue.id
                  : att.attr_type_name === "calendar"
                    ? moment(value[key]).format("MMMM Do YYYY, h:mm:ss a")
                    : value[key],
              parent_value_id: 0,
              parent_attribute_id:
                att.attr_type_name === "Drop-Down" ? att.att_id : 0,
              attr_type_name: att.attr_type_name,
            };
          }
        });
      }
    });
    let reqData = {
      user_id: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
      userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
      category_id: subCategoryId,
      inv_attributes: temp,
      distance: value.distance == undefined ? "" : value.distance,
      // name: value.name === undefined ? '' : value.name,
      name: selectedOption.title,
      email_frequency:
        value.email_frequency == undefined ? "" : value.email_frequency,
      postwithin: value.postwithin === undefined ? "" : value.postwithin,
    };
    
    if (isSaveSearch) {
      if (address !== null) {
        reqData.address = address.full_add;
        reqData.lat = address.latLng.lat;
        reqData.lng = address.latLng.lng;
        reqData.usr_state = address.state;
        reqData.usr_city = address.city;
        reqData.usr_pcode = address.p_code;
      }
      if (isEdit.flag === true) {
        reqData.id = isEdit.id;
        reqData.email_frequency = value.email_frequency;

        this.props.editSaveSearchList(reqData, (res) => {
          
          if (res.status === STATUS_CODES.OK || res.status === 1) {
            this.getAllSavedFilter()
            this.formRef.current.resetFields();
            this.setState({
              isEdit: {
                flag: false,
                id: undefined,
              },
            });
            toastr.success(langs.success, MESSAGES.FILTER_UPDATE_SUCCESS);
          }
        });
      } else {
        this.props.saveSearch(reqData, (res) => {
          this.setState({ isSaveSearch: false });
          if (res.status === STATUS_CODES.OK || res.status === 1) {
            
            this.getAllSavedFilter()
            this.formRef.current.resetFields();
            toastr.success(langs.success, MESSAGES.FILTER_SAVE_SUCCESS);
          }
        });
      }
    } else {
      this.props.history.push({
        pathname: subCategoryPath,
        state: {
          // classifiedList: res.data,
          templateName: templateName,
          filterReqData: reqData,
        },
      });
      // this.props.applyClassifiedFilterAttributes(reqData, res => {
      //     
      // if (res.status === 1) {
      //     return this.props.history.push({
      //         pathname: subCategoryPath,
      //         state: {
      //             classifiedList: res.data,
      //             filterReqdata: reqData
      //         }
      //     })
      // } else {
      //     return this.props.history.push({
      //         pathname: subCategoryPath,
      //         state: {
      //             classifiedList: [],
      //             filterReqdata: reqData
      //         }
      //     })
      // }
      // })
    }
  };

  /**
   * @method onFinish
   * @description handle submit form
   */
  onFinish = (value) => {
    this.applyFilter(value);
  };

  renderSavedSearchList = () => {
    const { savedSearch, classifiedList, allIds } = this.state;

    if (savedSearch.length === 0) {
      return <Text>No Records found</Text>
    }
    return savedSearch.map((el) => (
      <li>
        <Row>
          <Col style={{ cursor: "pointer" }} md={20}>
            <Text
              onClick={() => {
                
                let parameter = this.props.match.params;
                let categoryId = parameter.categoryId;
                let categoryName = parameter.categoryName;
                let subCategoryId =
                  parameter.all === langs.key.all ? allIds : parameter.subCategoryId;
                let subCategoryName = parameter.subCategoryName;
                let templateName = classifiedList.length && classifiedList[0].template_slug;
                let allData = parameter.all === langs.key.all ? true : false;
                let subCategoryPath = getClassifiedSubcategoryRoute(
                  templateName,
                  categoryName,
                  categoryId,
                  subCategoryName,
                  subCategoryId,
                  allData
                );
                let reqData = {
                  user_id: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
                  userid: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
                  // category_id: subCategoryId,
                  inv_attributes: el.inv_attributes,
                  // distance: value.distance == undefined ? "" : value.distance,
                  name: el.phrase === undefined ? '' : el.phrase,
                  email_frequency: el.emailfrequency == undefined ? "" : el.emailfrequency,
                  // postwithin: value.postwithin === undefined ? "" : value.postwithin,
                };
                
                this.props.history.push({
                  pathname: subCategoryPath,
                  state: {
                    // classifiedList: res.data,
                    templateName: templateName,
                    filterReqData: reqData,
                  },
                });
                // this.formRef.current &&
                //   this.formRef.current.setFieldsValue({
                //     name: el.phrase,
                //     email_frequency: el.emailfrequency,
                //   });
                // 
                // this.setState({
                //   isEdit: { flag: true, id: el.id },
                //   selectedFrequency: el.emailfrequency,
                // });
              }}
            >
              {el.phrase}
            </Text>
          </Col>
          <Col md={4}>
            <Button
              type="link"
              size="small"
              danger
              className="ml-8"
              onClick={() => {
                this.props.deleteSaveSearchList({ id: el.id }, (res) => {
                  if (res.status === STATUS_CODES.OK || res.status === 1) {
                    this.getAllSavedFilter()
                    toastr.success(
                      langs.success,
                      MESSAGES.FILTER_DELETE_SUCCESS
                    );
                  }
                });
              }}
            >
              <Icon icon="delete" size="16" />
            </Button>
          </Col>
        </Row>{" "}
      </li>
    ));
  };

  /**
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    let state = "";
    let city = "";
    let p_code = "";
    result.address_components.map((el) => {
      if (el.types[0] === "administrative_area_level_1") {
        state = el.long_name;
      } else if (el.types[0] === "administrative_area_level_2") {
        city = el.long_name;
      } else if (el.types[0] === "postal_code") {
        p_code = el.long_name;
      }
    });

    this.setState({
      address: {
        full_add: address,
        latLng,
        state,
        city,
        p_code,
      },
    });
  };

  /**
   * @method renderFrequency
   * @description render renderFrequency list
   */
  renderFrequency = (key) => {
    if (key === "frequency") {
      return this.state.emailFrequency.map((keyName, i) => {
        return (
          <Option key={i} value={keyName.id}>
            {keyName.name}
          </Option>
        );
      });
    } else {
      return this.state.postedWithIn.map((keyName, i) => {
        return (
          <Option key={i} value={keyName.id}>
            {keyName.name}
          </Option>
        );
      });
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedFrequency, isEdit, classifiedList, allIds } = this.state;
    let templateName = classifiedList.length && classifiedList[0].template_slug;
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let subCategoryName =
      parameter.all === langs.key.all
        ? langs.key.All
        : parameter.subCategoryName;
    let subCategoryId =
      parameter.all === langs.key.all ? "" : parameter.subCategoryId;
    let allData = parameter.all === langs.key.all ? true : false;
    let categoryPagePath = getClassifiedCatLandingRoute(
      templateName,
      categoryId,
      categoryName,
      allData
    );
    let subCategoryPath = getClassifiedSubcategoryRoute(
      templateName,
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      allData
    );
    return (
      <Layout>
        <Layout>
          <AppSidebar
            history={history}
            activeCategoryId={categoryId}
            moddule={1}
          />
          <Layout>
            <Content className="site-layout">
              <div className="wrap-inner">
                <Row className="mb-20">
                  <Col md={24}>
                    <Breadcrumb separator="|" className="pb-10">
                      <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <Link to="/classifieds">Classified</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <Link to={categoryPagePath}>{categoryName}</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>
                        <Link to={subCategoryPath}>{subCategoryName}</Link>
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>Filter</Breadcrumb.Item>
                    </Breadcrumb>
                  </Col>
                </Row>
                <Title level={3} className="text-lightblue mb-0">
                  {"Refines"}
                </Title>
                <Form
                  layout="vertical"
                  onFinish={this.onFinish}
                  ref={this.formRef}
                  id="filterForm"
                >
                  <div className="filter-page">
                    <Tabs type="card" className={"tab-style2"}>
                      <TabPane tab={subCategoryName} key="1">
                        <div className="filter-page-content">
                          <Row gutter={[58, 0]}>
                            <Col md={12}>
                              <Row gutter={[14, 0]}>
                                <Col md={24}>
                                  <Form.Item name={"name"} label="Title">
                                    {/* <Input placeholder='Keyword' /> */}
                                    <AutoComplete
                                      allIds={allIds}
                                      className="suraj"
                                      handleSearchSelect={(option) => {
                                        this.setState({
                                          selectedOption: option,
                                        });
                                      }}
                                      handleValueChange={(value) => {
                                        this.setState({ searchItem: value });
                                      }} 
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={[14, 0]}>
                                <Col md={24}>
                                  <Form.Item
                                    name={"distance"}
                                    label="Distance (in kilometers)"
                                  >
                                    <Input
                                      type={"number"}
                                      placeholder="distance in kilometers"
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={[14, 0]}>
                                <Col md={24}>
                                  <Form.Item
                                    name={"postwithin"}
                                    label="Posted within"
                                  >
                                    {/* <Input type={'number'} /> */}
                                    <Select
                                      placeholder="Select"
                                      allowClear
                                    // value={selectedFrequency}
                                    >
                                      {this.renderFrequency("postedWithin")}
                                    </Select>
                                  </Form.Item>
                                </Col>
                              </Row>

                              {/* <Row gutter={[14, 0]}>
                                  <Col md={24}>
                                      <Form.Item
                                          name='email_frequency'
                                          label='Email Frequency'
                                      >
                                          <Select
                                              placeholder='Select'
                                              allowClear
                                              value={selectedFrequency}
                                              onChange={(e) => }
                                          >
                                              {this.renderFrequency('frequency')}
                                          </Select>
                                      </Form.Item>
                                  </Col>
                              </Row> */}
                              <Row gutter={[14, 0]}>
                                <Col md={24}>
                                  <Form.Item label="Address" name="address">
                                    <PlacesAutocomplete
                                      name="address"
                                      handleAddress={this.handleAddress}
                                    />
                                  </Form.Item>
                                </Col>
                              </Row>
                              {this.renderItem()}

                              <Row gutter={[14, 0]}>
                                <Col md={12}>
                                  <Form.Item className="align-center">
                                    <Button htmlType="submit" type="default">
                                      {"Search"}
                                    </Button>
                                  </Form.Item>
                                </Col>
                                <Col md={12}>
                                  <Form.Item className='align-center ml-20'>
                                    <Button htmlType='submit' type='default' onClick={() => {
                                      if (!this.props.isLoggedIn) {
                                        this.props.openLoginModel()
                                      } else {
                                        this.setState({ isSaveSearch: true })
                                      }
                                    }}>
                                      {isEdit.flag ? 'Update Search' : 'Save Search'}
                                    </Button>
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Col>
                            <Col md={12}>
                              {this.props.isLoggedIn && <div className='saved-filter-list'>
                                <Title level={4}>Saved Filter list</Title>
                                <ul> {this.renderSavedSearchList()} </ul>
                              </div>}
                            </Col>
                          </Row>
                        </div>
                      </TabPane>
                    </Tabs>
                  </div>
                </Form>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, classifieds } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
  };
};

export default connect(mapStateToProps, {
  getClassfiedCategoryListing,
  enableLoading,
  disableLoading,
  getClassfiedCategoryDetail,
  getClassifiedDynamicInput,
  applyClassifiedFilterAttributes,
  saveSearch,
  getSaveSearchList,
  deleteSaveSearchList,
  editSaveSearchList,
  openLoginModel,
  getChildCategory,
})(withRouter(Filter));
