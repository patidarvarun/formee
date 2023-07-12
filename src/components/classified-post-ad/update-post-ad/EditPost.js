import React, { Fragment } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { toastr } from 'react-redux-toastr';
import 'react-quill/dist/quill.snow.css';
import { Divider } from 'antd';
import {
  Switch,
  Select,
  Layout,
  Typography,
  DatePicker,
  TimePicker,
  Row,
  Col,
  message,
  Upload,
  Form,
  Checkbox,
  Radio,
  Tabs,
  Button,
  Collapse,
  Input,
  InputNumber,
} from 'antd';
import Icon from '../../customIcons/customIcons';
import { langs } from '../../../config/localization';
import { MESSAGES } from '../../../config/Message';
import '../../auth/registration/style.less';
import '../postAd.less';
import { renderField } from '../../forminput';
import { required, validMobile } from '../../../config/FormValidation';
import { getAddress, converInUpperCase } from '../../common';
import {
  enableLoading,
  disableLoading,
  getClassfiedCategoryDetail,
} from '../../../actions';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  bussinessUserPostAnAd,
  deleteInspectionAPI,
  updatePostAdAPI,
  getChildInput,
  getClassifiedDynamicInput,
  setAdPostData,
  getPostAdDetail,
  deleteClassifiedImages
} from '../../../actions/classifieds/PostAd';
import { QUESTION_TYPES } from '../../../config/Config';
import PlacesAutocomplete from '../../common/LocationInput';
import Preview from './Preview';
import JobPreview from './PreviewJobModel';
import MembershipPlan from './Payment';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;
const { Text, Title, Paragraph } = Typography;


class UpdateClassifiedAds extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      attribute: [],
      label: false,
      otherAttribute: [],
      specification: '',
      fileList: [],
      Question1: false,
      Question2: false,
      Question3: false,
      questions: [],
      textInputs: [
        {
          question: ``,
          ans_type: QUESTION_TYPES.TEXT,
          options: [],
          ansInputs: [],
        },
      ],
      // ansInputs: []
      inspectiontime: [],
      initial: false,
      address: '',
      adPostDetail: '',
      byAppointment: false,
      weekly: false,
      singleDate: false,
      data: '',
      specification: '',
      inspectionPreview: [],
      classifiedDetail: '',
      jobModal: false,
      paymentScreen: false,
      formData: '',
      videoList: [],
      floorPlan: [],
      companyLogo: [],
      editorState: BraftEditor.createEditorState(''),
      is_ad_free: false,
      isOpen: false,
      formmeTemplate: [],
      isShow: true,
      sale_via_exp: false,
      rent_data: '',
      per_week_data: '',
      rentChildren: '',
      isNegotiable: true,
      is_ad_free: false,
      isPerweekVisible: false,
      deleted_video: [],
      image_url: [],
      file_url: [],
      uploaded_image: []
    };
  }

  /**
   * @method componentWillMount
   * @description called after render the component
   */
  componentWillMount() {
    this.props.enableLoading();
    this.getPostAdDetails();
  }

  getPostAdDetails = () => {
    const { loggedInUser, userDetails } = this.props;
    let catId = this.props.match.params.adId;
    let reqData = {
      id: catId,
      user_id: loggedInUser.id,
    };
    this.props.getPostAdDetail(reqData, (res) => {
      this.props.disableLoading();

      if (res.status === 200) {
        let data = res.data.data;

        const atr =
          data &&
            Array.isArray(data.classified_attribute) &&
            data.classified_attribute.length
            ? data.classified_attribute
            : [];
        const mandate = atr.filter((el) => el.validation === 1);
        const optional = atr.filter((el) => el.validation === 0);
        let negotiable = atr.filter(
          (el) =>
            el.slug === 'is_price_negotiable?' ||
            el.att_name === 'Is price negotiable?'
        );
        let formmeTemplate = atr.filter(
          (el) =>
            el.slug === 'about_you:' ||
            el.slug === 'key_responsibilities:' ||
            el.slug === 'How_to_apply' ||
            el.att_name === 'How to Apply' ||
            el.att_name === 'About You:' ||
            el.att_name === 'Key Responsibilities:'
        );
        let negotiable_data =
          negotiable && Array.isArray(negotiable) && negotiable.length
            ? negotiable[0]
            : '';
        let rent = atr.filter((el) => el.slug === 'rent');
        let rent_data =
          rent && Array.isArray(rent) && rent.length ? rent[0] : '';
        let per_week = atr.filter(
          (el) => el.slug === 'per_week' || el.att_name === 'Per week'
        );
        let per_week_data =
          per_week && Array.isArray(per_week) && per_week.length
            ? per_week[0]
            : '';

        let job_functions = atr.filter((el) => el.is_functional_area === 1);
        let job_functions_data =
          job_functions && Array.isArray(job_functions) && job_functions.length
            ? job_functions[0]
            : '';

        let allAtt = [...mandate, ...optional];
        let inspectionTime = data.inspection_times;
        this.getDefaultINVAttribute(allAtt, per_week_data);
        this.getInspectionType(inspectionTime);
        this.getAllInitialValue(data, mandate, optional);
        this.getClassifiedDetails(catId);
        this.setState({
          negotiable_data: negotiable_data,
          formmeTemplate: formmeTemplate,
          rent_data: rent_data,
          per_week_data: per_week_data,
          job_functions_data: job_functions_data,
        });
      }
    });
  };

  getClassifiedDetails = (catId) => {
    const { isLoggedIn, loggedInUser } = this.props;
    let reqData = {
      id: catId,
      user_id: isLoggedIn ? loggedInUser.id : '',
    };
    this.props.getClassfiedCategoryDetail(reqData, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        this.setState({ classifiedDetail: res.data });
      }
    });
  };

  /**
   * @method getAllInitialValue
   * @description get all initial values
   */
  getAllInitialValue = (data, mandate, optional) => {
    const { fname, lname } = this.props.userDetails;
    let predefinedImages = [], video_list = [], url = [];
    data.classified_image &&
      data.classified_image.map((el, index) => {
        predefinedImages.push({
          uid: `${el.id}`,
          name: 'image.png',
          status: 'done',
          isPrevious: true,
          url: `${el.image_url}`,
          type: 'image/jpeg',
          size: '1024',
        });
      });
      data.videos && data.videos.length && data.videos.slice(0,1).map((el, index) => {
        video_list.push({
          uid: `${index}`,
          status: 'done',
          isPrevious: true,
          url: `${el.full_url}`,
          name: el.file_url,
          type: 'video/mp4',
          size: '1024',
        });
      });
    const {
      contact_name,
      contact_email,
      title,
      price,
      description,
      contact_mobile,
      category_name,
      subcategory_name,
      hide_mob_number,
      location,
      sub_sub_category_name,
      is_ad_free,
      is_sale_via_expression,
    } = data;
    this.formRef.current &&
      this.formRef.current.setFieldsValue({
        fname: fname ? converInUpperCase(fname) : '',
        lname: lname ? converInUpperCase(lname) : '',
        contact_email,
        title,
        price,
        description: BraftEditor.createEditorState(description),
        parent_categoryid: category_name,
        category_id: subcategory_name
          ? subcategory_name
          : sub_sub_category_name
            ? sub_sub_category_name
            : '',
        contact_mobile:
          contact_mobile && contact_mobile !== 'N/A' ? contact_mobile : '',
        hide_mob_number: hide_mob_number ? hide_mob_number : false,
        address: location,
        inspection_type: data.inspection_type,
        is_sale_via_expression: is_sale_via_expression,
      });
    if (data.inspection_type === 'Weekly Time') {
      this.setState({ weekly: true, singleDate: false, byAppointment: false });
    } else if (data.inspection_type === 'Single Date') {
      this.setState({ weekly: false, singleDate: true, byAppointment: false });
    }else {
      this.setState({byAppointment: true,weekly: false, singleDate: false})
    }
    this.setState({
      adPostDetail: data,
      category_name: category_name,
      subcategory_name: subcategory_name,
      address: data.location,
      attribute: mandate,
      otherAttribute: optional,
      fileList: predefinedImages,
      videoList:video_list,
      image_url: predefinedImages,
      floorPlan: data.floor_plan
        ? [
          {
            uid: `-${1}`,
            name: 'image.png',
            status: 'done',
            url: data.floor_plan ? data.floor_plan : '',
            type: 'image/jpeg',
            size: '1024',
          },
        ]
        : [],
      companyLogo: [
        {
          uid: `-${1}`,
          name: 'image.png',
          status: 'done',
          url: data.company_logo ? data.company_logo : '',
          type: 'image/jpeg',
          size: '1024',
        },
      ],
      is_ad_free: is_ad_free ? true : false,
      sale_via_exp: is_sale_via_expression ? true : false,
    });
  };

  /**
   * @method getDefaultINVAttribute
   * @description get default inv attributes
   */
  getDefaultINVAttribute = (allAtt, per_week_data) => {
    if (allAtt && allAtt.length) {
      allAtt.map((el) => {
        if (
          el.slug === 'How_to_apply' ||
          el.att_name === 'How to Apply' ||
          el.att_name === 'About You:' ||
          el.att_name === 'Key Responsibilities:'
        ) {
          this.setState({ isOpen: true });
        }
        if (el.attr_type_name === 'calendar' || el.attr_type_name === 'Date') {
          let d = new Date(el.selectedvalue);
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: moment(d),
            });
        } else if (el.attr_type_name === 'Drop-Down') {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: Number(el.selectedvalue),
            });
          if (el.slug === 'lease' || el.slug === 'rent') {
            let selectedObj = el.value.filter(
              (el2) => String(el2.id) === String(el.selectedvalue)
            );
            if (selectedObj && selectedObj.length) {
              let obj = selectedObj[0];
              if (obj.slug === 'rent' || obj.slug === 'lease') {
                this.setState({
                  isPerweekVisible: true,
                  per_week_data: per_week_data,
                  rentChildren:
                    per_week_data && per_week_data.value.length
                      ? per_week_data.value
                      : '',
                });
              } else {
                this.setState({ isPerweekVisible: false });
              }
              if (obj.slug === 'sold' || obj.slug === 'lease') {
                this.setState({ isSaleVisible: true });
              }
              if (obj.slug === 'lease') {
                this.setState({ isNegotiable: false });
              }
            }
          }
        } else if (el.attr_type_name === 'Radio-button') {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: Number(el.selectedvalue),
            });
        } else if (el.attr_type_name === 'Multi-Select') {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: el.selectedvalue
                ? el.selectedvalue.split(',')
                : '',
            });
        } else if (el.attr_type_name === 'textarea') {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: BraftEditor.createEditorState(el.selectedvalue),
            });
        } else {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.att_name]: el.selectedvalue,
              [`${el.att_name}_measure_unit`]: el.selected_measure_unit_value
            });
        }
      });
    }
  };

  /**
   * @method formateTime
   * @descriptionget format default time
   */
  formateTime = (time) => {
    let time1 = new Date();
    let [hours, minutes, seconds] = time.split(':'); // Using ES6 destructuring
    time1.setHours(+hours);
    time1.setMinutes(minutes);
    time1.setSeconds(seconds);
    return time1;
  };

  /**
   * @method getInspectionType
   * @descriptionget initial inspection list
   */
  getInspectionType = (inspectionTime) => {
    const { singleDate } = this.state;
    let tempArray = [],
      temp2 = [];
    if (inspectionTime) {
      inspectionTime &&
        Array.isArray(inspectionTime) &&
        inspectionTime.length &&
        inspectionTime.map((el, i) => {
          let time1 = this.formateTime(el.inspection_start_time);
          let time2 = this.formateTime(el.inspection_end_time);
          tempArray.push({
            id: el.id ? el.id : '',
            inspection_date: moment(el.inspection_date),
            inspection_start_time: moment(time1),
            inspection_end_time: moment(time2),
          });
          temp2.push({
            inspection_date: moment(el.inspection_date).format('DD-MM-YYYY'),
            inspection_start_time: moment(time1).format('HH:mm:ss'),
            inspection_end_time: moment(time2).format('HH:mm:ss'),
          });
        });
      this.setState({ inspectiontime: temp2, initial:temp2.length ? true : false });
      this.formRef.current &&
        this.formRef.current.setFieldsValue({
          inspection_time: tempArray.length ? tempArray : [
            {
              id: '',
              inspection_date: '',
              inspection_start_time: '',
              inspection_end_time: '',
            },
          ],
        });
    }
  };

  /*
   * @method renderSelect
   * @descriptionhandle render select
   */
  renderMinSalary = (data) => {
    return (
      <div>
        <Form.Item
          label={data.att_name}
          name={data.att_name}
          className='w-100 price-input-num'
          rules={data.validation === 1 && [required('')]}
        >
          {/* <Input
            onChange={(e) => {
              this.setState({ flag: true });
            }}
            type={'number'}
          /> */}
          <InputNumber
            onChange={(e) => {
              this.setState({ flag: true });
            }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
      </div>
    );
  };

  /*
   * @method renderSelect
   * @descriptionhandle render select
   */
  renderMaxSalary = (data) => {
    const { min_salary } = this.state;
    let currentField =
      this.formRef.current && this.formRef.current.getFieldsValue();
    let minimum_salary = currentField['Minimum Salary'];
    return (
      <div>
        <Form.Item
          label={data.att_name}
          name={data.att_name}
          className='w-100 price-input-num'
          rules={[
            {
              validator: (rule, value, callback) => {
                if (value === '' || value === undefined || value === null) {
                  callback('This field is required');
                  return;
                } else if (Number(value) < Number(minimum_salary)) {
                  callback(
                    'Maximum salary must be greater than minimum salary.'
                  );
                  return;
                } else {
                  callback();
                  return;
                }
              },
            },
          ]}
        >
          {/* <Input
            disabled={min_salary || minimum_salary ? false : true}
            type={'number'}
          /> */}
          <InputNumber
            onChange={(e) => {
              this.setState({ flag: true });
            }}
            disabled={min_salary || minimum_salary ? false : true}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>
      </div>
    );
  };

  renderFeatures = (data, categoryName) => {
    const { loggedInUser } = this.props;
    let realStateVendor =
      loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.real_estate;
    return (
      <Form.Item
        label={categoryName !== 'Automotive' && data.att_name}
        name={data.att_name}
        rules={
          categoryName !== 'Automotive' &&
          data.validation === 1 && [required('')]
        }
        style={{ paddingLeft: '8px', paddingRight: '8px' }}
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            {data &&
              data.value &&
              data.value.map((el, i) => {
                return (
                  <Col
                    className='name-features-box pb-18'
                    span={realStateVendor ? 8 : 12}
                    key={i}
                  >
                    <Checkbox value={el.name}>{el.name}</Checkbox>
                  </Col>
                );
              })}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    );
  };

  /**
   * @method renderMultiSelect
   * @description render Multiselect
   */
  renderMultiSelect = (data) => {
    const { adPostDetail, isShow } = this.state;
    let categoryName = adPostDetail && adPostDetail.category_name;
    return categoryName === 'Automotive' ? (
      <Collapse
        defaultActiveKey={['1']}
        onChange={() => this.setState({ isShow: !isShow })}
      >
        <Panel
          header='Features'
          key='1'
          extra={
            <MinusCircleOutlined
              title={isShow ? 'Hide Features' : 'Show Features'}
            />
          }
        >
          {this.renderFeatures(data, categoryName)}
        </Panel>
      </Collapse>
    ) : (
      <> {this.renderFeatures(data, categoryName)}</>
    );
  };

  /**
   * @method handleAttValueChange
   * @descriptionhandle handle item change
   */
  handleAttValueChange = (value, allValues) => {
    const { per_week_data } = this.state;
    let selectedObj =
      allValues && allValues.filter((el) => String(el.id) === String(value));
    if (per_week_data && selectedObj && selectedObj.length) {
      let obj = selectedObj[0];
      if (obj.slug === 'rent' || obj.slug === 'lease') {
        this.setState({
          isPerweekVisible: true,
          per_week_data: per_week_data,
          rentChildren:
            per_week_data && per_week_data.value.length
              ? per_week_data.value
              : '',
        });
      } else {
        this.setState({ isPerweekVisible: false });
      }
      if (obj.slug === 'sold' || obj.slug === 'lease') {
        this.setState({ isSaleVisible: true });
      } else {
        this.setState({ isSaleVisible: false });
      }
      if (obj.slug === 'lease') {
        this.setState({ isNegotiable: false });
      } else {
        this.setState({ isNegotiable: true });
      }
    }
  };

  /**
   * @method renderSelect
   * @description render Multiselect
   */
  renderSelect = (data) => {
    return (
      <div>
        <Form.Item
          label={data.att_name}
          name={data.att_name}
          rules={data.validation === 1 && [required('')]}
          className='w-100'
        >
          <Select
            placeholder={data.att_name}
            onChange={(value) => this.handleAttValueChange(value, data.value)}
            allowClear
          >
            {data.value.map((el, i) => {
              return (
                <Option key={i} value={el.id}>
                  {el.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </div>
    );
  };

  /**
   * @method renderItem
   * @description render dynamic input
   */
  renderItem = () => {
    const { attribute,adPostDetail} = this.state;
    const { loggedInUser } = this.props
    let realStateVendor =
    (loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.real_estate) ||
    (adPostDetail && adPostDetail.category_name === 'Real Estate');
    if (attribute && attribute.length) {
      let sorted_list =
        attribute &&
        attribute.sort((a, b) => {
          if (a.position < b.position) return -1;
          if (a.position > b.position) return 1;
          return 0;
        });
      return sorted_list.map((data, i) => {
        let min_salary =
          data.slug === 'minimum_salary' || data.att_name === 'Minimum Salary';
        let max_salary =
          data.slug === 'maximum_salary' || data.att_name === 'Maximum Salary';
        let column =
          data.slug === 'property_type' ||
          data.slug === 'available_from' ||
          data.slug === 'Property Address'
            ? 24
            : 12;
        let specialAtt =
          data.is_functional_area !== 1 &&
          data.att_name !== 'Per week' &&
          data.slug !== 'per_week' &&
          data.slug !== 'rent' &&
          data.slug !== 'is_price_negotiable?' &&
          data.att_name !== 'Is price negotiable?' &&
          data.slug !== 'about_you:' &&
          data.slug !== 'key_responsibilities:' &&
          data.slug !== 'How_to_apply' &&
          data.att_name !== 'How to Apply' &&
          data.att_name !== 'About You:' &&
          data.att_name !== 'Key Responsibilities:';
        if (
          data.attr_type_name === 'Multi-Select' &&
          (data.slug === 'features' || data.att_name === 'Features')
        ) {
          return (
            <div style={{ width: '100%' }} key={i}>
              <Divider className='custom-hr-line' />
              {this.renderMultiSelect(data)}
              {realStateVendor && <Divider className='custom-hr-line' />}
            </div>
          );
        } else if (data.have_children && data.attr_type_name === 'Drop-Down') {
          return (
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div>{renderField(data, data.attr_type_name, data.value)}</div>
            </Col>
          );
        } else if (specialAtt) {
          return (
            <>
              {i % 2 == 0 ? (
                <Col xs={column} sm={column} md={column} lg={column} xl={column}>
                  <div key={i}>
                    {min_salary
                      ? this.renderMinSalary(data)
                      : max_salary
                        ? this.renderMaxSalary(data)
                        : renderField(data, data.attr_type_name, data.value)}
                  </div>
                </Col>
              ) : (
                <Col xs={column} sm={column} md={column} lg={column} xl={column}>
                  <div key={i}>
                    {min_salary
                      ? this.renderMinSalary(data)
                      : max_salary
                        ? this.renderMaxSalary(data)
                        : renderField(data, data.attr_type_name, data.value)}
                  </div>
                </Col>
              )}
            </>
          );
        }
      });
    }
  };

  /**
   * @method renderFormeeTemplate
   * @description render formme template
   */
  renderFormeeTemplate = () => {
    const { formmeTemplate } = this.state;
    if (formmeTemplate && formmeTemplate.length) {
      return formmeTemplate.map((data, i) => {
        return (
          <div key={i}>
            {renderField(data, data.attr_type_name, data.value)}
          </div>
        );
      });
    }
  };

  /**
   * @method renderOtherItem
   * @description render dynamic input
   */
  renderOtherItem = () => {
    const { otherAttribute } = this.state;
    if (otherAttribute && otherAttribute.length) {
      return otherAttribute.map((data, i) => {
        return (
          <div key={i}>
            {renderField(data, data.attr_type_name, data.value, this.child)}
          </div>
        );
      });
    }
  };

  /**
   * @method onFinish
   * @description handle submit form
   */
  onFinish = (value) => {
    this.getAttributes(value);
  };

  /**
   * @method hasDupsObjects
   * @description check duplicate inspection time
   */
  hasDupsObjects = function (array) {
    return array
      .map(function (value) {
        return (
          value.inspection_start_time +
          value.inspection_end_time +
          value.inspection_date
        );
      })
      .some(function (value, index, array) {
        return array.indexOf(value) !== array.lastIndexOf(value);
      });
  };

  PastDate = (array) => {
    if (array.length) {
      return array.map((el) => {
        var dateObj = new Date(); // subtract one day from current time
        dateObj.setDate(dateObj.getDate() - 1);
        let value = moment(el.inspection_date).toString < dateObj;

        return value;
      });
    }
  };

  /**
   * @method getAttributes
   * @description formate attributes value
   */
  getAttributes = (value) => {
    let filter = this.props.match.params.filter;
    const {
      sale_via_exp,
      is_ad_free,
      companyLogo,
      floorPlan,
      videoList,
      inspectiontime,
      data,
      attribute,
      otherAttribute,
      fileList,
      textInputs,
      hide_mob_number,
      adPostDetail,
      deleted_video
    } = this.state;
    const { step1, loggedInUser } = this.props;
    let temp = {},
      specification = [],
      price = '';
    let temp2 = [];
    const me = this.props;
    let allDynamicAttribute = [...otherAttribute, ...attribute];
    let answers = [],
      isReturn = false;
    const job =
      loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.job;
    let realState =
      loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.real_estate;
    let tempArray = [],
      tempArray2 = [];
    if (realState) {
      if (value.inspection_time) {
        let data = value.inspection_time;
        data &&
          Array.isArray(data) &&
          data.length &&
          data.map((el, i) => {
            tempArray.push({
              id: el.id ? el.id : '',
              inspection_date: moment(el.inspection_date).format('DD-MM-YYYY'),
              inspection_start_time: moment(el.inspection_start_time).format(
                'HH:mm:ss'
              ),
              inspection_end_time: moment(el.inspection_end_time).format(
                'HH:mm:ss'
              ),
            });
            tempArray2.push({
              inspection_date: moment(el.inspection_date).format('DD-MM-YYYY'),
              inspection_start_time: moment(el.inspection_start_time).format(
                'hh:mm a'
              ),
              inspection_end_time: moment(el.inspection_end_time).format(
                'hh:mm a'
              ),
            });
          });
      }
      let isDuplicate = this.hasDupsObjects(tempArray2);
      if (isDuplicate) {
        toastr.warning('Inpection time can not be duplicate');
        return true;
      }
    }

    if (this.props.have_questions === 1) {
      //Question Answer reqBody Logic
      textInputs.map((el) => {
        let temp = [];
        Array.isArray(el.ansInputs) &&
          el.ansInputs.map((k) => {
            temp.push(`answerIs_${k + 1}`);
          });

        // Validations
        if (job && !el.question) {
          toastr.warning('Warining', 'All Questions are required');
          isReturn = true;
          return true;
        }

        if (
          (job && el.ans_type === QUESTION_TYPES.RADIO) ||
          el.ans_type === QUESTION_TYPES.CHECKBOX
        ) {
          let i = el.options.findIndex((o) => o == '');

          if (i > -1) {
            toastr.warning('Warining', 'Atleast two Options are Required');
            isReturn = true;
            return true;
          }

          if (el.ansInputs.length == 0) {
            toastr.warning('Warining', 'Atleast Answer is Required');
            isReturn = true;
            return true;
          }
        }

        if (job && el.ans_type === QUESTION_TYPES.RADIO) {
          answers.push({
            options: temp,
          });
        } else if (el.ans_type === QUESTION_TYPES.CHECKBOX) {
          answers.push({
            options: temp,
          });
        } else {
          answers.push({
            options: [],
          });
        }
      });
    }
    Object.keys(value).filter(function (key, index) {
      if (value[key] !== undefined) {
        allDynamicAttribute.map((el, index) => {
          if (el.att_name === key || `${el.att_name}_measure_unit` === key) {
            let att = allDynamicAttribute[index];
            let dropDropwnValue, checkedValue;
            if (att.attr_type_name === 'Radio-button') {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id === value[key] || el.name === value[key]
              );
              checkedValue = att.value[selectedValueIndex];
            }
            if (att.attr_type_name === 'Drop-Down') {
              let selectedValueIndex = att.value.findIndex(
                (el) => el.id === value[key] || el.name === value[key]
              );
              dropDropwnValue = att.value[selectedValueIndex];
              if (att.have_children) {
                const requestData = {
                  attributeValueid: dropDropwnValue.id,
                  attribute_id: att.att_id,
                };
                me.getChildInput(requestData, (res) => {
                  if (res.status === 200) {
                    let data = res.data.data;

                    const childData =
                      res.data.data && Array.isArray(res.data.data.value)
                        ? res.data.data.value
                        : [];
                    Object.keys(value).filter(function (key, index) {
                      if (data.att_name === key) {
                        let selectedValueIndex = childData.findIndex(
                          (el) => el.id == value[key]
                        );

                        dropDropwnValue = childData[selectedValueIndex];

                        temp[data.att_id] = {
                          // name: att.att_name,
                          attr_type_id: data.attr_type,
                          attr_value:
                            att.attr_type_name === 'Drop-Down'
                              ? dropDropwnValue && dropDropwnValue.id
                              : att.attr_type_name === 'calendar'
                                ? moment(value[key]).format('YYYY')
                                : att.attr_type_name === 'Date'
                                  ? moment(value[key]).format(
                                    'MMMM Do YYYY, h:mm:ss a'
                                  )
                                  : att.attr_type_name === 'Radio-button'
                                    ? checkedValue.id
                                    : att.attr_type_name === 'textarea'
                                      ? value[key].toHTML()
                                      : value[key]
                                        ? value[key]
                                        : '',
                          // attr_value: (data.attr_type_name === 'Drop-Down') ? dropDropwnValue.id : value[key],
                          parent_value_id:
                            dropDropwnValue &&
                              dropDropwnValue.attribute_value_id
                              ? dropDropwnValue.attribute_value_id
                              : 0,
                          parent_attribute_id:
                            data.attr_type_name === 'Drop-Down'
                              ? dropDropwnValue &&
                              dropDropwnValue.attribute_parent_id
                              : 0,
                          attr_type_name: data.attr_type_name,
                        };
                        specification.push({
                          key: data.att_name,
                          slug: data.slug,
                          value: dropDropwnValue && dropDropwnValue.name,
                        });
                      }
                    });
                  }
                });
              }
            }

            temp[att.att_id] = {
              // name: att.att_name,
              measure_unit_value: value[`${el.att_name}_measure_unit`] ? value[`${el.att_name}_measure_unit`] : '',
              attr_type_id: att.attr_type,
              attr_value:
                att.attr_type_name === 'Drop-Down'
                  ? dropDropwnValue && dropDropwnValue.id
                  : att.attr_type_name === 'calendar'
                    ? moment(value[key]).format('YYYY')
                    : att.attr_type_name === 'Date'
                      ? moment(value[key]).format('DD/MM/YYYY')
                      : att.attr_type_name === 'Radio-button'
                        ? checkedValue && checkedValue.id
                        : att.attr_type_name === 'textarea'
                          ? value[key].toHTML()
                          : value[key]
                            ? value[key]
                            : '',
              parent_value_id: 0,
              parent_attribute_id:
                att.attr_type_name === 'Drop-Down' ? att.att_id : 0,
              attr_type_name: att.attr_type_name,
            };

            specification.push({
              key: att.att_name,
              slug: att.slug,
              value:
                att.attr_type_name === 'Drop-Down'
                  ? dropDropwnValue && dropDropwnValue.name
                  : att.attr_type_name === 'calendar'
                    ? moment(value[key]).format('YYYY')
                    : att.attr_type_name === 'Date'
                      ? moment(value[key]).format('DD/MM/YYYY')
                      : att.attr_type_name === 'Radio-button'
                        ? checkedValue && checkedValue.name
                        : att.attr_type_name === 'textarea'
                          ? value[key].toHTML()
                          : value[key]
                            ? value[key]
                            : '',
            });
            temp2.push({
              key: att.att_name,
              type: att.attr_type_name,
              value:
                att.attr_type_name === 'Drop-Down'
                  ? dropDropwnValue && dropDropwnValue.name
                  : att.attr_type_name === 'calendar'
                    ? value[key]
                    : att.attr_type_name === 'Date'
                      ? value[key]
                      : att.attr_type_name === 'textarea'
                        ? value[key].toHTML()
                        : value[key],
            });
            //
          }
        });
      }
    });

    let secondArray = [
      { key: 'title', value: value.title, type: 'text' },
      { key: 'description', value: value.description, type: 'text' },
      {
        key: 'fileList',
        value: fileList && fileList.length ? fileList : [],
        type: 'image',
      },
      { key: 'questions', value: textInputs, type: 'questions' },
      {
        key: 'inspection_time',
        value: value.inspection_time,
        type: 'inspection_time',
      },
    ];
    const { adId } = this.props.match.params;
    const reqData = {
      parent_categoryid: adPostDetail.parent_categoryid,
      category_id: adPostDetail.category_id,
      attributes: temp,
      user_id: loggedInUser.id,
      // price: price ? price : '',
      price: value.price ? value.price : '',
      contact_email: adPostDetail.contact_email,
      contact_name: adPostDetail.contact_name
        ? adPostDetail.contact_name
        : value.fname + '' + value.lname,
      contact_mobile: adPostDetail.contact_mobile
        ? adPostDetail.contact_mobile
        : value.contact_mobile,
      hide_mob_number: hide_mob_number ? 1 : 0,
      // description: value.description,
      description: value.description.toHTML(),
      title: value.title,
      lng:
        data && data.lng
          ? data.lng
          : adPostDetail.lng
            ? adPostDetail.lng
            : 151.2092955,
      lat:
        data && data.lat
          ? data.lat
          : adPostDetail.lat
            ? adPostDetail.lat
            : -33.8688197,
      state_id:
        data && data.state_id
          ? data.state_id
          : adPostDetail.state_id
            ? adPostDetail.state_id
            : '',
      subregions_id:
        data && data.subregions_id
          ? data.subregions_id
          : adPostDetail.subregions_id
            ? adPostDetail.subregions_id
            : '',
      location:
        data && data.address
          ? data.address
          : adPostDetail.location
            ? adPostDetail.location
            : '',
      quantity: 1,
      fileList: fileList,
      inspection_times: tempArray
        ? tempArray
        : inspectiontime
          ? inspectiontime
          : [],
      inspection_type: value.inspection_type
        ? value.inspection_type
        : adPostDetail.inspection_type,
      // attr_value_video: videoList,
      videos:videoList,
      deleted_videos: deleted_video.length ? deleted_video.join(',') : '',
      floor_plan: floorPlan ? floorPlan : [],
      company_logo: companyLogo && companyLogo.length ? companyLogo : [],
      is_ad_free: is_ad_free ? 1 : 0,
      is_sale_via_expression: sale_via_exp ? 1 : 0,
      contact_title: adPostDetail.contact_name
        ? adPostDetail.contact_name
        : value.fname + '' + value.lname,
      price_taken_type: value['Per week'] ? value['Per week'] : '',
    };
    if (filter === undefined) {
      reqData.id = adId;
    }
    const formData = new FormData();
    Object.keys(reqData).forEach((key) => {
      if (
        typeof reqData[key] == 'object' &&
        key !== 'fileList' &&
        key !== 'floor_plan' &&
        key !== 'company_logo' && key !== 'videos'
      ) {
        formData.append(key, JSON.stringify(reqData[key]));
      } else if (key === 'fileList') {
        let data = [];
        reqData[key].length &&
          reqData[key].map((e, i) => {
            formData.append(`image${i + 1}`, reqData[key][i].originFileObj ? reqData[key][i].originFileObj : e);
          });
      } else if (key === 'videos') {
        reqData[key].length &&
          reqData[key].map((e, i) => {
            formData.append(
              `videos[]`,
              reqData[key][i].originFileObj
            );
          });
      } else if (key === 'floor_plan') {
        reqData[key].length
          ? reqData[key].map((e, i) => {
            formData.append(`floor_plan`, reqData[key][i].originFileObj);
          })
          : formData.append(`floor_plan`, adPostDetail.floor_plan);
      } else if (key === 'company_logo') {
        reqData[key].length
          ? reqData[key].map((e, i) => {
            formData.append(`company_logo`, reqData[key][i].originFileObj);
          })
          : formData.append(`company_logo`, adPostDetail.company_logo);
      } else {
        formData.append(key, reqData[key]);
      }
    });
    this.setState({
      specification: specification,
      inspectionPreview: value.inspection_time,
    });
    let have_plan =
      adPostDetail.membership_plan_user_id !== null &&
      adPostDetail.membership_plan_user_id !== '' &&
      adPostDetail.membership_plan_user_id !== undefined;
    //let have_plan = adPostDetail.package_user_id !== null && adPostDetail.package_user_id !== '' && adPostDetail.package_user_id !== undefined
    if (!have_plan) {
      this.setState({ paymentScreen: true, formData: reqData });
    } else {
      this.props.enableLoading();
      if (filter === langs.key.classified) {
        this.props.bussinessUserPostAnAd(formData, (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            toastr.success(langs.success, MESSAGES.POST_ADD_SUCCESS);
            this.props.history.push('/my-ads');
          }
        });
      } else {
        this.props.updatePostAdAPI(formData, (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            toastr.success(
              'success',
              'Your post has been updated successfully'
            );
            this.props.history.push('/my-ads');
            this.getPostAdDetails();
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        });
      }
    }
  };

   /**
   * @method handleProductImageChange
   * @description handle product image change
   */
  handleProductImageChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    let img = new Image()
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false;
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    } else {
      if(file.originFileObj){
        this.setState({ fileList});
      }
    }
  };

   /**
   * @method onFloorPlanChange
   * @description handle floor plan change
   */
  onFloorPlanChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false;
    } else if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false;
    } else {
      this.setState({ floorPlan: fileList });
    }
  };

  /**
   * @method uploadCompanyLogo
   * @description handle company logo change
   */
  uploadCompanyLogo = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false;
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      return false;
    } else {
      this.setState({ companyLogo: fileList });
    }
  };

   /**
   * @method onVideoUploadChange
   * @description handle vedio upload change
   */
  onVideoUploadChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/webm';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload mp4 ,webm file!');
      return false;
    } else if (!isLt2M) {
      message.error('Video must smaller than 2MB!');
      return false;
    } else {
      this.setState({ videoList: fileList });
    }
  };

  /**
   * @method dummyRequest
   * @description ser dummy request for image upload
   */
  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  /**
   * @method appendInput
   * @description append input
   */
  appendInput() {
    let newInput = {
      question: ``,
      ans_type: QUESTION_TYPES.TEXT,
      options: [],
    };
    this.setState((prevState) => ({
      textInputs: prevState.textInputs.concat([newInput]),
    }));
  }
  /**
   * @method ChangeOption
   * @description render component
   */
  ChangeOption = (e, questionNo, optionNo) => {
    const { textInputs } = this.state;
    let st1 = e.target.value;
    textInputs[questionNo].options[optionNo] = st1;
    // update state
    this.setState({
      textInputs,
    });
  };

  /**
   * @method ChangIseOption
   * @description render component
   */
  ChangeIsOption = (e, questionNo, optionNo) => {
    const { textInputs } = this.state;
    // let st1 = e.target.checked
    if (e == true) {
      textInputs[questionNo].ansInputs.push(optionNo);
    } else {
      let i = textInputs[questionNo].ansInputs.findIndex((l) => l == optionNo);
      if (i > -1) {
        textInputs[questionNo].ansInputs.splice(i, 1);
      }
    }

    // update state
    this.setState({
      textInputs,
    });
  };

  /**
   * @method ChangesIseOptionRadio
   * @description ChangesIseOptionRadio
   */
  ChangeIsOptionRadio = (e, questionNo, optionNo) => {
    const { textInputs } = this.state;
    if (!textInputs[questionNo].ansInputs.includes(optionNo)) {
      // textInputs[questionNo].ansInputs.push(optionNo)
      textInputs[questionNo].ansInputs[0] = optionNo;
    }
    // update state
    this.setState({
      textInputs,
    });
  };

  /**
   * @method renderQuestionbar
   * @description render component
   */
  renderQuestionBar = () => {
    const { textInputs } = this.state;
    return (
      <div id='dynamicInput'>
        {textInputs.map((input, i) => (
          <span>
            <Form.Item label='Ask a Question'>
              <Input
                size='large'
                value={input.question}
                placeholder='Enter your Question'
                onChange={(e) => {
                  let q = e.target.value;
                  this.setState((prevState) => ({
                    textInputs: prevState.textInputs.map((obj, index) => {
                      if (index === i) {
                        return Object.assign(obj, { question: q });
                      } else {
                        return obj;
                      }
                    }),
                  }));
                }}
              />
              <Row gutter={24} className='fm-radio-grp'>
                <Col
                  gutter={12}
                  span={24}
                  className='ant-form-item fm-main-radiobtn'
                >
                  <Radio.Group
                    onChange={(e) => {
                      let q_type = e.target.value;
                      this.setState((prevState) => ({
                        textInputs: prevState.textInputs.map((obj, index) => {
                          if (index === i) {
                            return Object.assign(obj, {
                              ans_type: q_type,
                              options: [],
                              ansInputs: [],
                            });
                          } else {
                            return obj;
                          }
                        }),
                        Question_type: e.target.value,
                      }));
                      // this.setState({ Question_type: e.target.value })
                    }}
                    value={textInputs[i].ans_type}
                  >
                    <Radio value={QUESTION_TYPES.TEXT}>Text</Radio>
                    <Radio value={QUESTION_TYPES.RADIO}>Single Choice</Radio>
                    <Radio value={QUESTION_TYPES.CHECKBOX}>Multi Choce</Radio>
                  </Radio.Group>
                </Col>
              </Row>
              {textInputs[i].ans_type == QUESTION_TYPES.CHECKBOX ? (
                <Row gutter={24} className='fm-radio-grp'>
                  <Col gutter={12} span={24} className='ant-form-item'>
                    <Row gutter={24} align='middle'>
                      <Col md={19}>
                        <Input
                          value={textInputs[i].options[0]}
                          onChange={(e) => this.ChangeOption(e, i, 0)}
                          size='large'
                          placeholder='Enter your first Option'
                        />
                      </Col>
                      <Col md={5}>
                        {/* defaultChecked={textInputs[i].options[0].ans_type ? defaultCheck2 : !defaultCheck1} */}
                        <Checkbox
                          defaultChecked={textInputs[i].ansInputs.includes(0)}
                          onChange={(e) => {
                            this.ChangeIsOption(e.target.checked, i, 0);
                          }}
                        >
                          {' '}
                          Is Answer
                        </Checkbox>
                      </Col>
                    </Row>
                    <Row gutter={24} align='middle' className='fm-radio-grp'>
                      <Col md={19}>
                        <Input
                          value={textInputs[i].options[1]}
                          onChange={(e) => this.ChangeOption(e, i, 1)}
                          size='large'
                          placeholder='Enter your second Option'
                        />
                      </Col>
                      <Col md={5}>
                        <Checkbox
                          defaultChecked={textInputs[i].ansInputs.includes(1)}
                          onChange={(e) => {
                            this.ChangeIsOption(e.target.checked, i, 1);
                          }}
                        >
                          {' '}
                          Is Answer
                        </Checkbox>
                      </Col>
                    </Row>
                    <Row gutter={24} align='middle' className='fm-radio-grp'>
                      <Col md={19}>
                        <Input
                          value={textInputs[i].options[2]}
                          onChange={(e) => this.ChangeOption(e, i, 2)}
                          size='large'
                          placeholder='Enter your third Option'
                        />
                      </Col>
                      <Col md={5}>
                        <Checkbox
                          defaultChecked={textInputs[i].ansInputs.includes(2)}
                          onChange={(e) => {
                            this.ChangeIsOption(e.target.checked, i, 2);
                          }}
                        >
                          {' '}
                          Is Answer
                        </Checkbox>
                      </Col>
                    </Row>
                    <Row gutter={24} align='middle' className='fm-radio-grp'>
                      <Col md={19}>
                        <Input
                          value={textInputs[i].options[3]}
                          onChange={(e) => this.ChangeOption(e, i, 3)}
                          size='large'
                          placeholder='Enter your fourth Option'
                        />
                      </Col>
                      <Col md={5}>
                        <Checkbox
                          defaultChecked={textInputs[i].ansInputs.includes(3)}
                          onChange={(e) => {
                            this.ChangeIsOption(e.target.checked, i, 3);
                          }}
                        >
                          {' '}
                          Is Answer
                        </Checkbox>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              ) : this.state.textInputs[i].ans_type == 'radio' ? (
                <Row gutter={24}>
                  <Col gutter={12} span={24} className='ant-form-item'>
                    <Radio.Group
                      onChange={(e) => {
                        this.ChangeIsOptionRadio(true, i, e.target.value);
                      }}
                      value={textInputs[i].ansInputs[0]}
                      className='w-100'
                    >
                      {/* <Radio  onChange={(e) => {
                  this.ChangeIsOption(e.target.checked, i, 0)
                }} > Is Answer</Radio> */}
                      <Row gutter={24} align='middle' className='fm-radio-grp'>
                        <Col md={19}>
                          <Input
                            value={textInputs[i].options[0]}
                            onChange={(e) => this.ChangeOption(e, i, 0)}
                            size='large'
                            placeholder='Enter your first Option'
                          />
                        </Col>
                        <Col md={5}>
                          <Radio value={0}>Is Answer</Radio>
                        </Col>
                      </Row>
                      <Row gutter={24} align='middle' className='fm-radio-grp'>
                        <Col md={19}>
                          <Input
                            value={textInputs[i].options[1]}
                            onChange={(e) => this.ChangeOption(e, i, 1)}
                            size='large'
                            placeholder='Enter your second Option'
                          />
                        </Col>
                        <Col md={5}>
                          <Radio value={1}>Is Answer</Radio>
                        </Col>
                      </Row>
                      {/* <Radio  onChange={(e) => {
                  this.ChangeIsOption(e.target.checked, i, 1)
                }} > Is Answer</Radio> */}
                    </Radio.Group>
                  </Col>
                </Row>
              ) : (
                ''
              )}
              {/* defaultChecked={textInputs[i].ansInputs.includes(0)}
              defaultChecked={textInputs[i].ansInputs.includes(1)} */}
            </Form.Item>
          </span>
        ))}
        <button
          className='ant-btn ant-btn-primary'
          type='button'
          onClick={() => this.appendInput()}
        >
          Add a Question
        </button>
      </div>
    );
  };

  /**
   * @method duplicateEntry
   * @description duplicate entry
   */
  duplicateEntry = function (array, i) {
    let time = array.inspection_time;
    if (time && time.length) {
      return time
        .map(function (value) {
          return (
            moment(value.inspection_date).format('DD-MM-YYYY') +
            moment(value.inspection_start_time).format('hh:m a') +
            moment(value.inspection_end_time).format('hh:m a')
          );
        })
        .some(function (value, index, time) {
          return time.indexOf(value) !== time.lastIndexOf(value);
        });
    }
  };

  /**
   * @method renderQuestionbar
   * @description render component
   */
  renderInspectionTimeInput = () => {
    const { weekly, singleDate, byAppointment } = this.state;
    function disabledDate(current) {
      var dateObj = new Date(); // subtract one day from current time
      dateObj.setDate(dateObj.getDate() - 1);
      return current && current.valueOf() < dateObj;
    }
    return (
      <Form.List name='inspection_time'>
        {(fields, { add, remove }) => {
          let time = singleDate ? fields.slice(0, 1) : fields;
          if(!byAppointment){
          return (
            <div>
              {time.map((field, index) => (
                <div key={field.key}>
                  <Row gutter={(10, 10)} className='inspection-type-box'>
                    <Col md={11}>
                      <Form.Item
                        label={[field.label, 'Date']}
                        name={[field.name, 'inspection_date']}
                        fieldKey={[field.fieldKey, 'inspection_date']}
                        rules={[required('')]}
                      >
                        <DatePicker
                          format='MMMM Do YYYY'
                          disabledDate={disabledDate}
                          onChange={(date, dateString) => {
                            let currentField =
                              this.formRef.current &&
                              this.formRef.current.getFieldsValue();

                            if (currentField) {
                              currentField.inspection_time[
                                field.key
                              ].inspection_start_time = '';
                              currentField.inspection_time[
                                field.key
                              ].inspection_end_time = '';
                              this.formRef.current &&
                                this.formRef.current.setFieldsValue({
                                  ...currentField,
                                });
                            }
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Row gutter={0}>
                        <Col span={12}>
                          <Form.Item
                            label={[field.label, 'From']}
                            name={[field.name, 'inspection_start_time']}
                            fieldKey={[field.fieldKey, 'inspection_start_time']}
                            rules={[required('')]}
                          >
                            <TimePicker
                              use12Hours
                              format='h:mm a'
                              minuteStep={30}
                              className='inspect-time-picker-box inspect-time-picker-box1'
                              defaultOpenValue={moment('24:00', 'h:mm a')}
                              onChange={(e) => {
                                let currentField =
                                  this.formRef.current &&
                                  this.formRef.current.getFieldsValue();

                                let today = Date.now();
                                let currentDate =
                                  moment(today).format('DD/MM/YYYY');
                                let currentTime = moment(today).format('HH:mm');
                                let selectedDate =
                                  currentField.inspection_time[field.key]
                                    .inspection_date;
                                if (
                                  currentDate ===
                                  moment(selectedDate).format('DD/MM/YYYY')
                                ) {
                                  let selectedTime =
                                    currentField.inspection_time[field.key]
                                      .inspection_start_time;

                                  if (
                                    moment(selectedTime).format('HH:mm') <
                                    currentTime
                                  ) {
                                    currentField.inspection_time[
                                      field.key
                                    ].inspection_start_time = '';
                                    toastr.warning(
                                      'warning',
                                      'Time can not be past time'
                                    );
                                  }
                                }
                                let duplicate = this.duplicateEntry(
                                  currentField,
                                  field.key
                                );
                                if (duplicate) {
                                  toastr.warning(
                                    'You have already use this time, please select other time'
                                  );
                                  currentField.inspection_time[
                                    field.key
                                  ].inspection_start_time = '';
                                }
                                if (currentField) {
                                  currentField.inspection_time[
                                    field.key
                                  ].inspection_end_time = '';
                                  // this.formRef.current && this.formRef.current.setFieldsValue({ currentField })
                                }
                                this.formRef.current &&
                                  this.formRef.current.setFieldsValue({
                                    ...currentField,
                                  });
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label={[field.label, 'To']}
                            name={[field.name, 'inspection_end_time']}
                            fieldKey={[field.fieldKey, 'inspection_end_time']}
                            rules={[required('')]}
                          >
                            <TimePicker
                              use12Hours
                              format='h:mm a'
                              // defaultValue={moment('12:00', 'h:mm a')}
                              minuteStep={30}
                              defaultOpenValue={moment('12:00', 'h:mm a')}
                              className='inspect-time-picker-box inspect-time-picker-box2'
                              onChange={(e) => {
                                let currentField =
                                  this.formRef.current &&
                                  this.formRef.current.getFieldsValue();

                                let today = Date.now();
                                let currentDate =
                                  moment(today).format('DD/MM/YYYY');
                                let currentTime = moment(today).format('HH:mm');
                                let selectedDate =
                                  currentField.inspection_time[field.key]
                                    .inspection_date;
                                let selectedTime =
                                  currentField.inspection_time[field.key]
                                    .inspection_end_time;
                                let start =
                                  currentField &&
                                  currentField.inspection_time[field.key]
                                    .inspection_start_time;
                                let startTime = moment(start).format('HH:mm');
                                let endTime =
                                  moment(selectedTime).format('HH:mm');
                                if (
                                  currentDate ===
                                  moment(selectedDate).format('DD/MM/YYYY')
                                ) {
                                  if (
                                    moment(selectedTime).format('HH:mm') <
                                    currentTime
                                  ) {
                                    currentField.inspection_time[
                                      field.key
                                    ].inspection_end_time = '';
                                    toastr.warning(
                                      'warning',
                                      'Time can not be past time'
                                    );
                                  } else if (start) {
                                    if (endTime < startTime) {
                                      currentField.inspection_time[
                                        field.key
                                      ].inspection_end_time = '';
                                      toastr.warning(
                                        'warning',
                                        'End time should be greater than start time'
                                      );
                                    } else if (endTime === startTime) {
                                      currentField.inspection_time[
                                        field.key
                                      ].inspection_end_time = '';
                                      toastr.warning(
                                        'warning',
                                        'Start time and end time can not be same'
                                      );
                                    }
                                  }
                                } else if (start) {
                                  if (endTime < startTime) {
                                    currentField.inspection_time[
                                      field.key
                                    ].inspection_end_time = '';
                                    toastr.warning(
                                      'warning',
                                      'End time should be greater than start time'
                                    );
                                  } else if (endTime === startTime) {
                                    currentField.inspection_time[
                                      field.key
                                    ].inspection_end_time = '';
                                    toastr.warning(
                                      'warning',
                                      'Start time and end time can not be same'
                                    );
                                  }
                                }
                                let duplicate = this.duplicateEntry(
                                  currentField,
                                  field.key
                                );

                                if (duplicate) {
                                  currentField.inspection_time[
                                    field.key
                                  ].inspection_start_time = '';
                                  currentField.inspection_time[
                                    field.key
                                  ].inspection_end_time = '';
                                  this.formRef.current &&
                                    this.formRef.current.setFieldsValue({
                                      ...currentField,
                                    });
                                  toastr.warning(
                                    'You have already use this time slot, please select other time'
                                  );
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                    {field.key !== 0 && (
                      <Col md={1}>
                        <MinusCircleOutlined
                          className='dynamic-delete-button'
                          title={'Add More'}
                          onClick={() => {
                            let currentField =
                              this.formRef.current &&
                              this.formRef.current.getFieldsValue();
                            if (currentField) {
                              let inspection_time =
                                currentField.inspection_time;
                              let id = inspection_time[field.key]
                                ? inspection_time[field.key].id
                                : '';
                              if (id) {
                                this.props.deleteInspectionAPI(
                                  { id: id },
                                  (res) => {
                                    if (res.status === 200) {
                                      remove(field.name);
                                    }
                                  }
                                );
                              } else {
                                remove(field.name);
                              }
                            }
                          }}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              ))}
              {weekly && (
                <Form.Item>
                  
                  <div className='align-right add-card-link add-more-inspect-data'>
                    <div onClick={() => add()} style={{ cursor: 'pointer' }}>
                      <Icon icon='add-circle' size='20' className='mr-5' />
                      <Text style={{ verticalAlign: 'top' }}>Add More</Text>
                    </div>
                  </div>
                </Form.Item>
              )}
            </div>
          )}
        }}
      </Form.List>
    );
  };

  handleMobileNumber = (e) => {
    const { mobileNo, hide_mob_number } = this.state;
    var IndNum = /^[0]?[0-9]+$/;
    if (
      e.target.value &&
      IndNum.test(e.target.value) &&
      e.target.value.length >= 10 &&
      e.target.value.length <= 12
    ) {
      this.setState({ mobileNo: e.target.value, isVisible: true });
    } else {
      this.setState({ isVisible: false });
    }
  };

  /**
   * @method renderRadio
   * @description render radio button
   */
  renderCheckBox = () => {
    const { adPostDetail } = this.state;
    return (
      <div className='show-on-myad'>
        <Form.Item name='hide_mob_number' valuePropName='checked'>
          <Checkbox onChange={this.handleCheck}> {'Show on my ad'}</Checkbox>
        </Form.Item>
      </div>
    );
  };

  /**
   * @method handleCheck
   * @description handle mobile check uncheck
   */
  handleCheck = (e) => {
    const { mobileNo, hide_mob_number } = this.state;
    this.setState({ hide_mob_number: e.target.checked });
  };

  /**
   * @method getCurrentLocation
   * @description get current location
   */
  getCurrentLocation = () => {
    const { lat, long } = this.props;
    getAddress(lat, long, (res) => {
      let state = '';
      let city = '';
      let pincode = '';
      res &&
        res.address_components &&
        res.address_components.map((el) => {
          if (el.types[0] === 'administrative_area_level_1') {
            state = el.long_name;
          } else if (el.types[0] === 'administrative_area_level_2') {
            city = el.long_name;
          } else if (el.types[0] === 'postal_code') {
            this.setState({ postal_code: el.long_name });
            pincode = el.long_name;
            this.formRef.current.setFieldsValue({
              pincode: el.long_name,
            });
          }
        });

      let address = {
        location: res.formatted_address,
        lat: lat,
        lng: long,
        state_id: state,
        subregions_id: city,
      };
      this.setState({ data: address, address: res.formatted_address });
    });
  };

  /**
   * @method handleAddress
   * @description handle address change Event Called in Child loc Field
   */
  handleAddress = (result, address, latLng) => {
    let state = '';
    let city = '';
    result.address_components.map((el) => {
      if (el.types[0] === 'administrative_area_level_1') {
        state = el.long_name;
      } else if (el.types[0] === 'administrative_area_level_2') {
        city = el.long_name;
      }
    });
    this.formRef.current.setFieldsValue({
      address: address,
    });
    this.changeAddress(address, latLng, state, city);
  };

  /**
   * @method changeAddress
   * @description Split out Address city post code
   */
  changeAddress = (add, latLng, state, city) => {
    const { hide_mob_number, mobileNo } = this.state;
    let address = {
      location: add,
      lat: latLng.lat,
      lng: latLng.lng,
      state_id: state,
      subregions_id: city,
    };
    this.setState({ data: address, address: add });
  };

  /**
   * @method handleEditorChange
   * @description handle editor text value change
   */
  handleEditorChange = (editorState) => {
    this.setState({ editorState: editorState });
  };

  /**
   * @method resetForm
   * @description Use to resetForm
   */
  resetForm = () => {
    this.setState({
      inspectiontime: [],
      initial: false,
      fileList: [],
      companyLogo: [],
      floorPlan: [],
      byAppointment: false,
      weekly: false,
      singleDate: false,
      videoList: [],
      min_salary: '',
      editorState: BraftEditor.createEditorState(''),
      negotiable_data: '',
      is_ad_free: false,
      sale_via_exp: false,
      rentChildren: '',
      isNegotiable: true,
      per_week_data: '',
      isPerweekVisible: false,
    });
    this.formRef.current.resetFields();
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    let filter = this.props.match.params.filter;
    const {
      job_functions_data,
      isPerweekVisible,
      rent_data,
      isNegotiable,
      rentChildren,
      per_week_data,
      isSaleVisible,
      sale_via_exp,
      isOpen,
      is_ad_free,
      negotiable_data,
      adPostDetail,
      companyLogo,
      floorPlan,
      videoList,
      formData,
      paymentScreen,
      jobModal,
      hide_mob_number,
      classifiedDetail,
      inspectionPreview,
      specification,
      visible,
      initial,
      inspectiontime,
      otherAttribute,
      fileList,
      address,
      category_name,
      subcategory_name,
      deleted_video,
    } = this.state;
    const { have_questions, loggedInUser } = this.props;
    let realStateVendor =
      (loggedInUser.user_type === langs.key.business &&
        loggedInUser.role_slug === langs.key.real_estate) ||
      (adPostDetail && adPostDetail.category_name === 'Real Estate');
    const job =
      loggedInUser.user_type === langs.key.business &&
      loggedInUser.role_slug === langs.key.job;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img
          src={require('../../../assets/images/icons/upload-small.svg')}
          alt='upload'
        />
      </div>
    );
    const uploadButton2 = (
      <Button danger>
        <label style={{ cursor: 'pointer' }}>Add Pictures</label>
      </Button>
    );
    const controls = ['bold', 'italic', 'underline', 'separator'];
    return (
      <Fragment>
        {paymentScreen ? (
          <MembershipPlan reqData={formData} />
        ) : (
          <Layout>
            <Layout className='classified-edit-post'>
              <div className='wrap edit-adv'>
                <div
                  className='align-left mt-40 pb-30'
                  style={{ position: 'relative' }}
                >
                  <Title level={2} className=''>
                    {filter === langs.key.classified
                      ? 'Repost Ad'
                      : 'My Ad Post'}
                  </Title>
                </div>
                <div className='post-ad-box'>
                  <Form
                    layout='vertical'
                    onFinish={this.onFinish}
                    ref={this.formRef}
                    autoComplete='off'
                    initialValues={{
                      name: 'inspection_time',
                      inspection_time: initial
                        ? inspectiontime
                        : [
                          {
                            id: '',
                            inspection_date: '',
                            inspection_start_time: '',
                            inspection_end_time: '',
                          },
                        ],
                    }}
                  >
                    <div className='card-container signup-tab adv-main'>
                      <Tabs type='card'>
                        <TabPane className=""
                          
                          
                        >
                          <Row justify='end' align='middle'>
                            <Col>
                              <span
                                className='clr-link clear-adv'
                                onClick={this.resetForm}
                              >
                                {/* Clear All <Icon icon='delete' size='16'/> */}
                                Clear All{' '}
                                <img
                                  src={require('../../../assets/images/icons/delete-blue.svg')}
                                  alt='delete'
                                  style={{ top: '-1px' }}
                                />
                              </span>
                            </Col>
                          </Row>
                          <Row gutter={0}>
                            <Col span={12}>
                              <Form.Item
                                label={'Select Category'}
                                name='parent_categoryid'
                                rules={[required('Category')]}
                              >
                                <Input
                                  size='large'
                                  placeholder='Category'
                                  disabled
                                  className='category-field-block'
                                  defaultValue={category_name}
                                />
                              </Form.Item>
                            </Col>
                            
                            {job_functions_data === '' && !realStateVendor && (
                              <Col
                                span={12}
                                className='subcategory-field-block'
                              >
                                <Form.Item className="sub-category"
                                  label={'.'}
                                  name='category_id'
                                  rules={[required('Subcategory')]}
                                >
                                  <Input
                                    size='large'
                                    placeholder='Sub Category'
                                    disabled
                                    className=''
                                    defaultValue={subcategory_name}
                                  />
                                </Form.Item>
                              </Col>
                            )}
                            {job && job_functions_data && (
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={12}
                                xl={12}
                                className='lease-field-block'
                              >
                                {job_functions_data &&
                                  renderField(
                                    job_functions_data,
                                    job_functions_data.attr_type_name,
                                    job_functions_data.value
                                  )}
                              </Col>
                            )}
                            {realStateVendor && (
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={12}
                                xl={12}
                                className='lease-field-block'
                              >
                                {rent_data && this.renderSelect(rent_data)}
                              </Col>
                            )}
                          </Row>
                          {adPostDetail &&
                            adPostDetail.category_name !== 'Automotive' &&
                            !job &&
                            !realStateVendor && (
                              <div className="ad-free">
                                <Text>
                                  Is this ad free ?{' '}
                                  <Switch
                                    checked={is_ad_free}
                                    onChange={(checked) =>
                                      this.setState({
                                        is_ad_free: checked ? true : false,
                                      })
                                    }
                                  />
                                </Text>
                              </div>
                            )}
                          <div>
                            <Form.Item
                              label='Ad Title'
                              name='title'
                              className='label-large'
                              rules={[required('')]}
                            >
                              <Input size='large' placeholder='Type here' />
                            </Form.Item>
                          </div>
                          <div>
                            <Form.Item
                              label='Description'
                              name='description'
                              className='label-large'
                              rules={[required('')]}
                            >
                              {/* <TextArea
                                className='ant-input-lg'
                                rows='5'
                                placeholder='Type here'
                              /> */}
                              <BraftEditor
                                controls={controls}
                                contentStyle={{ height: 150 }}
                                className={'input-editor'}
                                language='en'
                              />
                            </Form.Item>
                          </div>
                          {isOpen && job && this.renderFormeeTemplate()}
                          {job && (
                            <div
                              onClick={() => this.setState({ isOpen: !isOpen })}
                              style={{
                                marginBottom: '20px',
                                color: '#55636D',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              {isOpen
                                ? 'Write a customize descrition'
                                : 'Use Formee template to write description'}
                            </div>
                          )}
                          
                          <div></div>
                          {!is_ad_free && !job && !sale_via_exp && (
                            <Row gutter={12}>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={negotiable_data ? 12 : 24}
                                xl={negotiable_data ? 12 : 24}
                              >
                                <div>
                                  <Form.Item
                                    label={'Price'}
                                    name={'price'}
                                    rules={[required('')]}
                                    className='price-input-num'
                                  >
                                    {/* <Input type={'number'} /> */}
                                    <InputNumber
                                      formatter={(value) =>
                                        `$ ${value}`.replace(
                                          /\B(?=(\d{3})+(?!\d))/g,
                                          ','
                                        )
                                      }
                                      parser={(value) =>
                                        value.replace(/\$\s?|(,*)/g, '')
                                      }
                                    />
                                  </Form.Item>
                                </div>
                              </Col>
                              {isPerweekVisible &&
                                per_week_data &&
                                rentChildren && (
                                  <Col xs={24} sm={24} md={24} lg={8} xl={8} className='hidden-label'>
                                    <div>
                                      <Form.Item
                                        label={ 'Per Week'
                                          // per_week_data &&
                                          // per_week_data.att_name 
                                        }
                                        name={
                                          per_week_data &&
                                          per_week_data.att_name
                                        }
                                        // rules={[required('')]}
                                        className='w-100'
                                      >
                                        <Select
                                          placeholder={
                                            per_week_data &&
                                            per_week_data.att_name
                                          }
                                          allowClear
                                        >
                                          {rentChildren &&
                                            rentChildren.map((el, i) => {
                                              return (
                                                <Option key={i} value={el.id}>
                                                  {el.name}
                                                </Option>
                                              );
                                            })}
                                        </Select>
                                      </Form.Item>
                                    </div>
                                  </Col>
                                )}
                              {isNegotiable && negotiable_data && (
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={8}
                                  xl={8}
                                  className='price-negotiable-box'
                                >
                                  {renderField(
                                    negotiable_data,
                                    negotiable_data.attr_type_name,
                                    negotiable_data.value
                                  )}
                                </Col>
                              )}
                            </Row>
                          )}
                          {isSaleVisible && (
                            <Form.Item
                              name={'is_sale_via_expression'}
                              valuePropName='checked'
                            >
                              <Checkbox
                                onChange={(e) =>
                                  this.setState({
                                    sale_via_exp: e.target.checked
                                      ? true
                                      : false,
                                  })
                                }
                              >
                                Sale via expression of interest
                              </Checkbox>
                            </Form.Item>
                          )}
                           {(job || realStateVendor) && <Divider className='custom-hr-line' />}
                          <Row gutter={12}>{this.renderItem()}</Row>
                          <Divider className='custom-hr-line' />
                          {!job && (
                            <Form.Item
                              label='Add Pictures'
                              name='image'
                              className='label-large'
                            // rules={[required('')]}
                            >
                              <Row>
                                <Col md={16}>
                                  <ul className='pl-0 notofication'>
                                    <li>
                                    Add up to 3 images or upgrade to include more.Hold and drag to reorder photos. Maximum file size 4MB.
                                    </li>
                                    
                                  </ul>
                                </Col>
                                <Col md={8} className='text-right'>
                            <label
                              for={'product-image'}
                              style={{ cursor: 'pointer' }}
                            >
                              <Button
                                className='btn-red-border-and-text add-pics'
                                type='button'
                              >
                                <label
                                  for={'product-image'}
                                  style={{
                                    cursor: 'pointer',
                                    verticalAlign: 'sub',
                                  }}
                                >
                                  Add Pictures
                                </label>
                              </Button>
                            </label>
                          </Col>
                              </Row>
                              <ImgCrop>
                                <Upload
                                  name='avatar'
                                  listType='picture-card'
                                  className='avatar-uploader post-ad-upload-pics'
                                  // showUploadList={false}
                                  showUploadList={true}
                                  fileList={fileList}
                                  id={'product-image'}
                                  customRequest={this.dummyRequest}
                                  onChange={this.handleProductImageChange}
                                  multiple={true}
                                  onRemove={(el)=> {
                                    if(el.isPrevious){
                                      this.props.deleteClassifiedImages({id: el.uid}, res => {
                                        if(res.status === 200){
                                          this.getPostAdDetails();
                                        }
                                      })
                                    }
                                  }}
                                >
                                  { fileList.length >= 3 ? null : uploadButton}
                                </Upload>
                              </ImgCrop>
                              {/* <DragSortingUpload callNext={(list) => this.setState({fileList: list})} images={fileList}/> */}
                              {/* <Row gutter={24} className='thumb-block'>
                                <Col span={24}>
                                  <Row>
                                    {fileList && fileList.map((el,i) => {
                                      return (
                                        <Col className='thumb' xs={24} sm={24} md={24} lg={4} xl={4}>
                                          <img
                                            src={el.isPrevious ? el.url : el.originFileObj && window.URL.createObjectURL(el.originFileObj)}
                                            alt='avatar'
                                          />
                                          <div onClick={() => {
                                            if(el.isPrevious){
                                              this.props.deleteClassifiedImages({id: el.uid}, res => {
                                                if(res.status === 200){
                                                  this.getPostAdDetails();
                                                }
                                              })
                                            }else {
                                              const index = fileList.filter(c => c.uid != el.uid);
                                              console.log(fileList,'index',index)
                                              this.setState({fileList:index})
                                            }
                                          }}>delete</div>
                                        </Col>
                                      )
                                    })}
                                  </Row>
                                </Col>
                            </Row> */}
                            </Form.Item>
                          )}
                          {realStateVendor && <Divider className='custom-hr-line' />}
                          {realStateVendor && (
                            <Form.Item
                              label='Add Floor Plan'
                              name='image'
                              className='label-large'
                            >
                              <Row>
                                <Col md={16}>
                                  <ul className='pl-0 notofication'>
                                    <li>
                                      Add upto 4 images or upgrade to include
                                      more
                                    </li>
                                    <li>Maximum File size 4MB</li>
                                  </ul>
                                </Col>
                                <Col md={8} className='text-right'>
                                  &nbsp;
                                </Col>
                              </Row>

                              <ImgCrop>
                                <Upload
                                  name='avatar'
                                  listType='picture-card'
                                  className='avatar-uploader post-ad-upload-pics'
                                  showUploadList={true}
                                  fileList={floorPlan ? floorPlan : []}
                                  customRequest={this.dummyRequest}
                                  onChange={this.onFloorPlanChange}
                                >
                                  {floorPlan && floorPlan.length >= 1
                                    ? null
                                    : uploadButton2}
                                </Upload>
                              </ImgCrop>
                            </Form.Item>
                          )}

                          {job && (
                            <Form.Item
                              label={'Add Company Logo'}
                              name='image'
                              className='label-large'
                            >
                              <ImgCrop>
                                <Upload
                                  name='avatar'
                                  listType='picture-card'
                                  className='avatar-uploader post-ad-upload-pics'
                                  showUploadList={true}
                                  fileList={companyLogo}
                                  customRequest={this.dummyRequest}
                                  onChange={this.uploadCompanyLogo}
                                  id='fileButton'
                                >
                                  {companyLogo.length >= 1
                                    ? null
                                    : uploadButton}
                                </Upload>
                              </ImgCrop>
                            </Form.Item>
                          )}
                          {job && (
                            <Row>
                              <Col md={16}>
                                <ul className='pl-0 notofication'>
                                  <li>
                                    Image size 500x500 pixles Maximum file size
                                    4MB
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          )}
                          {job && (
                            <Button danger>
                              <label
                                for='fileButton'
                                style={{ cursor: 'pointer' }}
                              >
                                Upload File
                              </label>
                            </Button>
                          )}
                          <Divider className='custom-hr-line' />
                          {!job && (
                            <Form.Item
                              label='Add Videos'
                              name='video'
                              className='label-large mb-0'
                            >
                              <Row>
                                <Col md={16}>
                                  <ul className='pl-0 notofication'>
                                    {/* <li>
                                      Add upto 1 videos or upgrade to include
                                      more
                                    </li> */}
                                    <li>
                                      Image size 500x500 pixles Maximum file
                                      size 4MB
                                    </li>
                                  </ul>
                                </Col>
                                <Col md={8} className='text-right'>
                                  &nbsp;
                                </Col>
                              </Row>

                              <Upload
                                name='avatar'
                                listType='picture-card'
                                className='avatar-uploader post-ad-upload-pics'
                                showUploadList={true}
                                fileList={videoList}
                                customRequest={this.dummyRequest}
                                onChange={this.onVideoUploadChange}
                                onRemove={(e) => {
                                  if(e.isPrevious){
                                    deleted_video.push(e.name)
                                    this.setState({deleted_video: deleted_video})
                                  }
                                }}
                              >
                                {videoList.length >= 1 ? null : uploadButton}
                              </Upload>
                            </Form.Item>
                          )}
                          {have_questions === 1 ? this.renderQuestionBar() : ''}
                          {(realStateVendor || have_questions === 1) && <Divider className='custom-hr-line' />}
                          {realStateVendor && (
                            <div>
                              <Form.Item
                                label='Inspection Type'
                                name='inspection_type'
                                className='label-large'
                                rules={[required('')]}
                              >
                                <Select
                                  placeholder='Select Subcategory'
                                  onChange={(e) => {
                                    if (e == 'By Appointment') {
                                      this.setState({
                                        byAppointment: true,
                                        weekly: false,
                                        singleDate: false,
                                      });
                                    } else if (e === 'Weekly Time') {
                                      this.setState({
                                        byAppointment: false,
                                        weekly: true,
                                        singleDate: false,
                                      });
                                    } else if (e === 'Single Date') {
                                      this.setState({
                                        byAppointment: false,
                                        weekly: false,
                                        singleDate: true,
                                      });
                                    }
                                  }}
                                  allowClear
                                  size={'large'}
                                  className='w-100'
                                // disabled
                                >
                                  <Option value={'By Appointment'}>
                                    {'By Appointment'}
                                  </Option>
                                  <Option value={'Weekly Time'}>
                                    {'Set Weekly Time'}
                                  </Option>
                                  <Option value={'Single Date'}>
                                    {'Single Date'}
                                  </Option>
                                </Select>
                              </Form.Item>
                            </div>
                          )}
                          {realStateVendor && this.renderInspectionTimeInput()}
                        </TabPane>
                      </Tabs>
                      {otherAttribute && otherAttribute.length !== 0 && (
                        <div className='card-container signup-tab mt-25'>
                          <Collapse>
                            <Panel header='Add more details (Optional)' key='1'>
                              <div>{this.renderOtherItem()}</div>
                            </Panel>
                          </Collapse>
                        </div>
                      )}
                      <div className='card-container signup-tab mt-25'>
                        
                          <div header='Contact Details' key='1'>
                            <div className='ad-contact-detail'>
                              <Row gutter={12}>
                                <Col span={12}>
                                  <Form.Item
                                    label='First Name'
                                    name='fname'
                                    className='label-large'
                                    rules={[required('First name')]}
                                  >
                                    <Input value={'hdgfhjdghj'} size='large' />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    label='Last Name'
                                    name='lname'
                                    className='label-large'
                                    rules={[required('Last name')]}
                                  >
                                    <Input size='large' />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row gutter={12}>
                                <Col span={24}>
                                  <Form.Item
                                    label='Contact Number'
                                    name='contact_mobile'
                                    className='label-large'
                                    onChange={this.handleMobileNumber}
                                    rules={[{ validator: validMobile }]}
                                  >
                                    <Input type={'text'} size='large' />
                                  </Form.Item>
                                  {/* {isNumberVarify && this.renderCheckBox()} */}
                                  {this.renderCheckBox()}
                                </Col>
                              </Row>
                              <Row gutter={28}>
                                <Col span={24}>
                                  <Form.Item
                                    label='Pick Up Address '
                                    name='address'
                                    className='label-large'
                                  // rules={(address === '' || address === undefined || address === 'N/A' || address === null) && [required('Address')]}
                                  >
                                    <PlacesAutocomplete
                                      name='address'
                                      handleAddress={this.handleAddress}
                                      addressValue={this.state.address}
                                    />
                                  </Form.Item>
                                  <div
                                    className='fs-14 text-blue use-current-location-text use-current-location-custom'
                                    onClick={this.getCurrentLocation}
                                    style={{ cursor: 'pointer' }}
                                  >
                                    <Icon icon='location' size='13' />
                                    Use my current location
                                  </div>
                                  <div className='fs-12 pl-2'>
                                    Location is used in search results and
                                    appears on your ad.
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        
                      </div>
                    </div>
                    <div className='steps-action flex align-center mb-32'>
                    <a href="/my-ads"
                        
                        type='primary'
                        size='middle'
                        className='ant-btn blue-noborder ant-btn-default mr-10 '
                      >
                        Cancel
                      </a>
                      <Button
                        htmlType='submit'
                        type='primary'
                        size='middle'
                        className='btn-blue'
                      >
                        {filter === langs.key.classified ? 'Repost' : 'Update'}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Layout>
          </Layout>
        )}
        {visible && (
          <Preview
            visible={visible}
            onCancel={() =>
              this.setState({ visible: false }, () =>
                this.props.history.push('/my-ads')
              )
            }
            hide_mob_number={hide_mob_number}
            address={address}
            adPostDetail={adPostDetail}
            specification={specification}
            inspectionPreview={inspectionPreview}
            classifiedDetail={classifiedDetail}
            getDetails={this.getClassifiedDetails}
          />
        )}
        {jobModal && (
          <JobPreview
            visible={jobModal}
            onCancel={() =>
              this.setState({ jobModal: false }, () =>
                this.props.history.push('/my-ads')
              )
            }
            classifiedDetail={classifiedDetail && classifiedDetail.data}
            allData={classifiedDetail && classifiedDetail}
            getDetails={this.getClassifiedDetails}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd, common } = store;
  const { step1 } = postAd;
  const { location } = common;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    step1,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
    lat: location ? location.lat : '',
    long: location ? location.long : '',
  };
};
export default connect(mapStateToProps, {
  bussinessUserPostAnAd,
  deleteInspectionAPI,
  getClassfiedCategoryDetail,
  updatePostAdAPI,
  getPostAdDetail,
  getChildInput,
  getClassifiedDynamicInput,
  setAdPostData,
  enableLoading,
  disableLoading,
  deleteClassifiedImages
})(UpdateClassifiedAds);
