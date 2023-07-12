import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AppSidebar from "./Sidebar";
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
  deleteSearch,
  applyClassifiedFilterAttributes,
  getSaveSearchList,
  saveSearch,
  getRetailDynamicAttribute,
  editSaveSearchList,
  openLoginModel,
  applyRetailFilter,
  saveSearchList,
  createRetailSearch,
  updateRetailSavedSerach
} from "../../actions";
import Icon from "../../components/customIcons/customIcons";
import history from "../../common/History";
import { toastr } from "react-redux-toastr";
import { renderField } from "../forminput";
import { MESSAGES } from "../../config/Message";
import { STATUS_CODES } from "../../config/StatusCode";
import PlacesAutocomplete from "../common/LocationInput";
import AutoComplete from "./AutoComplete";
import { langs } from "../../config/localization";
import {
  getRetailSubcategoryRoute,
  getRetailCatLandingRoutes,
} from "../../common/getRoutes";
import moment from "moment";
import {RightOutlined} from '@ant-design/icons';
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
      defaultOption:'',
      classifiedList: [],
      attribute: [],
      savedSearch: [],
      label: false,
      isSaveSearch: false,
      address:'',
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
      tabKey: '1'
    };
  }

  /**
   * @method componentWillMount
   * @description called before mounting the component
   */
  componentWillMount() {
    let parameter = this.props.match.params;
    const { retailList } = this.props
    let categoryId = parameter.categoryId;
    let isJobPage = parameter.subCategoryId === undefined && parameter.categoryId;
    if (parameter.all === langs.key.all) {
      // this.props.enableLoading();
      // let subcategories = retailList && retailList.filter(el => el.id == categoryId)
      // 
      // if(subcategories && Array.isArray(subcategories) && subcategories.length){
      //   let retailId = []
      //   let childData = subcategories[0].category_childs && Array.isArray(subcategories[0].category_childs) && subcategories[0].category_childs.length ? subcategories[0].category_childs : ''
      //   retailId = childData && childData.map(el => el.id);
      //   
      //     if(retailId && retailId.length){
      //       let allid = retailId.join()
      //       this.getClassifiedListing(allid);
      //       this.props.getRetailDynamicAttribute(
      //       { categoryid: allid, filter: 1, category_level:3 },(res) => {
      //         this.props.disableLoading()
      //         if (res.status === 200) {
      //           const atr = Array.isArray(res.data.attributes)
      //             ? res.data.attributes
      //             : [];
      //           this.setState({ attribute: atr, allIds: categoryId });
      //         }
      //       }
      //     )
      //   } 
      // }
        this.getClassifiedListing(categoryId);
            this.props.getRetailDynamicAttribute(
            { categoryid: categoryId, filter: 1, category_level:3 },(res) => {
              this.props.disableLoading()
              this.getAllSavedFilter()
              if (res.status === 200) {
                const atr = Array.isArray(res.data.attributes)
                  ? res.data.attributes
                  : [];
                this.setState({ attribute: atr, allIds: categoryId });
              }
            }
          )
    } else {
      let subCategoryId = parameter.subCategoryId;
      this.getClassifiedListing(subCategoryId);
      this.props.enableLoading();
      this.props.getRetailDynamicAttribute(
        { categoryid: subCategoryId, filter: 1, category_level:3 },
        (res) => {
          this.props.disableLoading();
          this.getAllSavedFilter()
          if (res.status === 200) {
            const atr = Array.isArray(res.data.attributes)
              ? res.data.attributes
              : [];
            this.setState({ attribute: atr });
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
    this.props.saveSearchList((res) => {
      if (res.status === 200) {
        this.setState({ savedSearch: res.data.data });
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
        let templateName =
          Array.isArray(res.data.data) &&
          res.data.data.length &&
          res.data.data[0].template_slug;
        this.setState({
          classifiedList: res.data.data,
          templateName: templateName,
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
              {renderField(data, data.attr_type_name, data.value, true)}
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
      tabKey,
    } = this.state;
    let parameter = this.props.match.params;
    let categoryId = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let subCategoryId =
      parameter.all === langs.key.all ? categoryId : parameter.subCategoryId;
    let subCategoryName = parameter.subCategoryName;
    let templateName = ''
    let allData = parameter.all === langs.key.all ? true : false;
    let subCategoryPath = getRetailSubcategoryRoute(
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      // allData
    );
    let categoryPagePath = getRetailCatLandingRoutes(
      categoryId,
      categoryName,
      allData
    );

    let index = Object.keys(value).findIndex((el) => value[el] !== undefined);
    let index2 = Object.keys(selectedOption).length === 0;
    if (index2 && index < 0) {
      toastr.warning(langs.warning, MESSAGES.ATLEAST_ONE_FILTER);
      return true;
    }
    let temp = {},temp2 =[]

    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        attribute.map((el, index) => {
          if (el.att_name == key) {
            let att = attribute[index];
            let dropDropwnValue, checkedValue;
            if(att.attr_type_name === 'Radio-button'){
              let selectedValueIndex = att.value.findIndex((el) => (el.id === value[key] || el.name === value[key]))
              checkedValue = att.value[selectedValueIndex]
              
            }
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
            temp2.push({
              key: att.att_name,
              value: (att.attr_type_name === 'Drop-Down') ? dropDropwnValue.name : (att.attr_type_name === 'calendar') ? moment(value[key]).format('YYYY') : (att.attr_type_name === 'Date') ? moment(value[key]).format('MMMM Do YYYY, h:mm:ss a') : att.attr_type_name === 'Radio-button' ? checkedValue.name : value[key]
            })
          }
        });
      }
    });
    let secondArray = [{ key: 'address', value: address},{ key: 'name', value:selectedOption.title },
    {key: 'distance',value: value.distance == undefined ? "" : value.distance},
    { key: 'postwithin', value: value.postwithin === undefined ? "" : value.postwithin }]
    let finalArray = temp2.concat(secondArray)
    
    let reqData = {
      user_id: this.props.isLoggedIn ? this.props.loggedInDetail.id : 0,
      category_id: subCategoryId,
      search_keys: finalArray,
      distance: value.distance == undefined ? "" : value.distance,
      // name: value.name === undefined ? '' : value.name,
      title: selectedOption.title,
      email_frequency:
      value.email_frequency == undefined ? "" : value.email_frequency,
      postwithin: value.postwithin === undefined ? "" : value.postwithin,
      condition: tabKey === '2' ? 'new' : tabKey === '3' ? 'used' : 'all'
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
      // if (isEdit.flag === true) {
      //   
      //   reqData.id = isEdit.id;
      //   reqData.email_frequency = value.email_frequency;

      //   // this.props.editSaveSearchList(reqData, (res) => {
      //     this.props.updateRetailSavedSerach(reqData, (res) => {
      //     
      //     if (res.status === STATUS_CODES.OK || res.status === 1) {
      //       this.getAllSavedFilter()
      //       this.formRef.current.resetFields();
      //       this.setState({
      //         isEdit: {
      //           flag: false,
      //           id: undefined,
      //         },
      //       });
      //       toastr.success(langs.success, MESSAGES.FILTER_UPDATE_SUCCESS);
      //     }
      //   });
      // } 
      // else {
        const formData = new FormData()
          Object.keys(reqData).forEach((key) => {
            if (typeof reqData[key] == 'object') {
              formData.append(key, JSON.stringify(reqData[key]))
            }else {
              formData.append(key, reqData[key])
            }
          })
        // this.props.saveSearch(reqData, (res) => {
          this.props.createRetailSearch(formData, (res) => {
          this.setState({ isSaveSearch: false });
          if (res.status === STATUS_CODES.OK || res.status === 1) {
            
            this.getAllSavedFilter()
            this.formRef.current.resetFields();
            toastr.success(langs.success, MESSAGES.FILTER_SAVE_SUCCESS);
            this.setState({address: ''})
          }
        });
      // }
    } 
    
    else {
      if (parameter.all === langs.key.all) {
        this.props.history.push({
          pathname: categoryPagePath,
          state: {
            // classifiedList: res.data,
            templateName: templateName,
            filterReqData: reqData,
          },
        });
      }else {
        this.props.history.push({
          pathname: subCategoryPath,
          state: {
            // classifiedList: res.data,
            templateName: templateName,
            filterReqData: reqData,
          },
        });
      }
      
    }
  };

  /**
   * @method onFinish
   * @description handle submit form
   */
  onFinish = (value) => {
    this.applyFilter(value);
  };

  getAutofetchedData = (el) => {
    
    let parameter = this.props.match.params
    // let search_keys = el.search_keys && JSON.parse(el.search_keys)
    // this.formRef.current &&
    //   this.formRef.current.setFieldsValue({
    //     name: el.title,
    //   });
    //   if (search_keys && search_keys.length) {
    //     search_keys.map((el) => {
    //       if (el.type === 'calendar') {
    //         this.formRef.current && this.formRef.current.setFieldsValue({
    //           [el.key]: moment(el.value)
    //         });
    //       }else {
    //         this.formRef.current && this.formRef.current.setFieldsValue({
    //           [el.key]: el.value
    //         });
    //       }
    //       if(el.key === 'address'){
    //          this.setState({address: el.value ? el.value.full_add : ''})
    //       }
    //       if(el.key === 'name'){
    //         this.setState({defaultOption: el.value})
    //       }
    //     })
    //   }
    // this.setState({
    //   isEdit: { flag: true, id: el.id,  },
    //   // selectedFrequency: el.emailfrequency,
    // });

    let categoryId = parameter.categoryId;
    let categoryName = parameter.categoryName;
    let subCategoryId =
      parameter.all === langs.key.all ? categoryId : parameter.subCategoryId;
    let subCategoryName = parameter.subCategoryName;
    let templateName = ''
    let allData = parameter.all === langs.key.all ? true : false;
    let subCategoryPath = getRetailSubcategoryRoute(
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      // allData
    );
    let categoryPagePath = getRetailCatLandingRoutes(
      categoryId,
      categoryName,
      allData
    );

    if (parameter.all === langs.key.all) {
      this.props.history.push({
        pathname: categoryPagePath,
        state: {
          // classifiedList: res.data,
          templateName: '',
          filterReqData: el,
        },
      });
    }else {
      this.props.history.push({
        pathname: subCategoryPath,
        state: {
          // classifiedList: res.data,
          templateName: '',
          filterReqData: el,
        },
      });
    }
  }

  renderSavedSearchList = () => {
    const { savedSearch } = this.state;

    return savedSearch.map((el) => (
      <li>
        <Row>
          <Col style={{ cursor: "pointer" }} md={20}>
            <Text
              onClick={() => this.getAutofetchedData(el)}
            >
              {el.title}
            </Text>
          </Col>
          <Col md={4}>
            <Button
              type="link"
              size="small"
              danger
              className="ml-8"
              onClick={() => {
                this.props.deleteSearch({ id: el.id }, (res) => {
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
   * @method renderTabDetail
   * @description render tab details
   */
  renderTabDetail = () => {
    const { selectedFrequency, isEdit, classifiedList, allIds,address } = this.state;
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
    let categoryPagePath = getRetailCatLandingRoutes(
      categoryId,
      categoryName,
      // allData
    );
    let subCategoryPath = getRetailSubcategoryRoute(
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      // allData
    );
    return(
      <div>
          <Row gutter={[14, 0]}>
          <Col md={24}>
            <Form.Item name={"name"} label="Title">
              {/* <Input placeholder='Keyword' /> */}
              <AutoComplete
                allIds={categoryId}
                className="suraj"
                defaultOption={this.state.defaultOption}
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
        <Row gutter={[14, 0]}>
          <Col md={24}>
            <Form.Item label="Address" name="address">
              <PlacesAutocomplete
                name="address"
                handleAddress={this.handleAddress}
                addressValue={address && address.full_add}
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
                {!isEdit.flag && <Button htmlType='submit' type='default' onClick={() => {
                    if (!this.props.isLoggedIn) {
                        this.props.openLoginModel()
                    } else {
                        this.setState({ isSaveSearch: true })
                    }
                }}>
                  {/* {isEdit.flag ? 'Update Search' : 'Save Search'} */}
                  {'Save Search'}
                </Button>}
            </Form.Item>
        </Col>
      </Row>
    </div>
    )
  }

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
    let categoryPagePath = getRetailCatLandingRoutes(
      categoryId,
      categoryName,
      // allData
    );
    let subCategoryPath = getRetailSubcategoryRoute(
      categoryName,
      categoryId,
      subCategoryName,
      subCategoryId,
      // allData
    );
    return (
      <Layout className="retail-theme">
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
                        <Link to="/retail">Retail</Link>
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
                <Title level={3} className="purple-text mb-0">
                  {"Refines"}
                </Title>
                
                <Form
                  layout="vertical"
                  onFinish={this.onFinish}
                  ref={this.formRef}
                  id="filterForm"
                >
                  <div className="filter-page">
                    <Tabs type="card" className={"tab-style2 retail-filter"} onChange={(key) => this.setState({tabKey:key })}>
                      <TabPane tab={subCategoryName} key="1"> 
                      <Row gutter={[58, 0]}>
                      <Col md={16}>
                        <div className="filter-page-content">
                          <Tabs defaultActiveKey="1" className="tab-style5">
                            <TabPane tab="All" key="1">
                              {this.renderTabDetail()}
                            </TabPane>
                            <TabPane tab="New" key="2">
                              {this.renderTabDetail()}
                            </TabPane>
                            <TabPane tab="Used" key="3">
                              {this.renderTabDetail()}
                            </TabPane>
                          </Tabs>
                        </div>
                      </Col>
                        {/* <Col md={8}>
                          <div className="black-box">
                            <Title level={3}>Christmas Gift Idea</Title>
                            <Button className="pink-btn-fullfill"> Show me <RightOutlined /></Button>
                          </div>
                        </Col> */}
                         <Col md={8}>
                            <div className='saved-filter-list'>
                                <Title level={4}>Saved Filter list</Title>
                                <ul> {this.renderSavedSearchList()} </ul>
                            </div>
                        </Col>
                        </Row>
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
  const { auth, classifieds,common } = store;
  const { isOpenLoginModel,categoryData } = common;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
    selectedClassifiedList: classifieds.classifiedsList,
    retailList: categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
  };
};

export default connect(mapStateToProps, {
  getClassfiedCategoryListing,
  enableLoading,
  disableLoading,
  getClassfiedCategoryDetail,
  getRetailDynamicAttribute,
  applyClassifiedFilterAttributes,
  saveSearch,
  getSaveSearchList,
  deleteSearch,
  editSaveSearchList,
  openLoginModel,
  getChildCategory,
  saveSearchList,
  createRetailSearch,
  updateRetailSavedSerach
})(Filter);
