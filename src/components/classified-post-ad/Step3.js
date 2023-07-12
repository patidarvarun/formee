import React, { Fragment } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import {
  Switch,
  InputNumber,
  Typography,
  Divider,
  Select,
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
} from 'antd';
import Icon from '../../components/customIcons/customIcons';
import '../auth/registration/style.less';
import { renderField } from '../forminput';
import { validNumber, required } from '../../config/FormValidation';
import { enableLoading, disableLoading } from '../../actions';
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  getAttributeValues,
  getChildInput,
  getClassifiedDynamicInput,
  setAdPostData,
} from '../../actions/classifieds/PostAd';
import { NavBar } from './CommanMethod';
import { QUESTION_TYPES } from '../../config/Config';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Text, Title } = Typography;

class Step3 extends React.Component {
  formRef = React.createRef();
  myDivToFocus = React.createRef();
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
      byAppointment: false,
      weekly: false,
      singleDate: false,
      videoList: [],
      min_salary: '',
      floorPlan: [],
      companyLogo: [],
      editorState: BraftEditor.createEditorState(''),
      formmeTemplate: [],
      isOpen: false,
      isShow: true,
      negotiable_data: '',
      is_ad_free: false,
      sale_via_exp: false,
      rentChildren: '',
      isNegotiable: true,
      per_week_data: '',
      isPerweekVisible: false,
    };
  }

  /**
   * @method componentWillMount
   * @description mount before render the component
   */
  componentWillMount() {
    if (this.props.reqData) {
      const { reqData } = this.props;

      reqData.map((el) => {
        if (el.value == 'Weekly Time') {
          this.setState(
            { weekly: true, singleDate: false, byAppointment: false },
            () => {
              this.setInspectionTime(el);
            }
          );
        } else if (el.value == 'Single Date') {
          this.setState(
            { weekly: false, singleDate: true, byAppointment: false },
            () => {
              this.setInspectionTime(el);
            }
          );
        }
      });
    }
  }

  /**
   * @method setInspectionTime
   * @description set inspection time
   */
  setInspectionTime = (el) => {
    if (el.type === 'inspection_time') {
      let inspectionTime = el.value,
        tempArray = [];
      if (inspectionTime) {
        inspectionTime &&
          Array.isArray(inspectionTime) &&
          inspectionTime.length &&
          inspectionTime.map((el, i) => {
            tempArray.push({
              inspection_date: moment(el.inspection_date),
              inspection_start_time: moment(el.inspection_start_time),
              inspection_end_time: moment(el.inspection_end_time),
            });
          });
        this.setState({ inspectiontime: tempArray, initial: true });
        this.formRef.current &&
          this.formRef.current.setFieldsValue({
            [el.inspection_time]: tempArray,
            inspection_type: el.inspection_type,
          });
      }
    }
  };

  /**
   * @method componentDidMount
   * @description called after render the component
   */
  componentDidMount() {
    this.props.enableLoading();
    const { step1 } = this.props;
    // let catId = step1.parent_categoryid
    let catId = step1.category_id;
    this.props.getClassifiedDynamicInput({ categoryid: catId }, (res) => {
      this.props.disableLoading();
      if (res.status === 200) {
        const atr = Array.isArray(res.data.attributes)
          ? res.data.attributes
          : [];
        const mandate = atr.filter((el) => el.validation === 1);
        const optinal = atr.filter((el) => el.validation === 0);
        let negotiable = atr.filter((el) => el.slug === 'is_price_negotiable?');
        let negotiable_data =
          negotiable && Array.isArray(negotiable) && negotiable.length
            ? negotiable[0]
            : '';
        let rent = atr.filter((el) => el.slug === 'rent');
        let rent_data =
          rent && Array.isArray(rent) && rent.length ? rent[0] : '';
        let per_week = atr.filter((el) => el.slug === 'per_week');
        let per_week_data =
          per_week && Array.isArray(per_week) && per_week.length
            ? per_week[0]
            : '';

        let job_functions = atr.filter((el) => el.is_functional_area === 1);
        let job_functions_data =
          job_functions && Array.isArray(job_functions) && job_functions.length
            ? job_functions[0]
            : '';

        let formmeTemplate = atr.filter(
          (el) =>
            el.slug === 'about_you:' ||
            el.slug === 'key_responsibilities:' ||
            el.slug === 'How_to_apply'
        );
        this.getInitialValues(per_week_data);
        this.setState({
          attribute: mandate,
          otherAttribute: optinal,
          formmeTemplate: formmeTemplate,
          negotiable_data: negotiable_data,
          rent_data: rent_data,
          per_week_data: per_week_data,
          job_functions_data: job_functions_data,
        });
      }
    });
  }

  getInitialValues = (per_week_data) => {
    if (this.props.reqData) {
      const { reqData } = this.props;
      reqData.map((el) => {
        if (
          el.key === 'How to Apply :' ||
          el.key === 'About You:' ||
          el.key === 'Key Responsibilities:'
        ) {
          this.setState({ isOpen: true });
        }
        if (el.type === 'calendar' || el.type === 'Date') {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: moment(el.value),
            });
        } else if (el.type === 'questions') {
          this.setState({ textInputs: el.value });
        } else if (el.type === 'image') {
          this.setState({ fileList: el.value });
        } else if (
          el.key === 'is_ad_free' ||
          el.key === 'is_sale_via_expression'
        ) {
          this.setState({ is_ad_free: el.value, sale_via_exp: el.value });
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        } else if (el.key === 'Lease' || el.key === 'Rent') {
          if (el.value === 'Rent' || el.value === 'Lease') {
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
          if (el.value === 'Sold' || el.value === 'Lease') {
            this.setState({ isSaleVisible: true });
          }
          if (el.value === 'Lease') {
            this.setState({ isNegotiable: false });
          }
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        } else if (el.type === 'video') {
          this.setState({ videoList: el.value });
        } else if (el.key === 'floor_plan') {
          this.setState({ floorPlan: el.value });
        } else if (el.key === 'company_logo') {
          this.setState({ companyLogo: el.value });
        } else if (el.key === 'Minimum Salary') {
          this.setState({ min_salary: el.value });
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        } else if (el.key === 'description' || el.type === 'textarea') {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: BraftEditor.createEditorState(el.value),
            });
        } else {
          this.formRef.current &&
            this.formRef.current.setFieldsValue({
              [el.key]: el.value,
            });
        }
      });
    }
  };
  /*
   * @method renderMinSalary
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
          {/* <Input onChange={(e) => {this.setState({flag: true})}} type={'number'}/> */}
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
   * @method renderMaxSalary
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
    const { step1, isShow } = this.props;
    const realState =
      step1 && step1.templateName === 'realestate' ? true : false;
    return (
      <Form.Item
        label={categoryName !== 'Automotive' && data.att_name}
        name={data.att_name}
        rules={
          categoryName !== 'Automotive' &&
          data.validation === 1 && [required('')]
        }
        className='features-box'
      >
        <Checkbox.Group style={{ width: '100%' }}>
          <Row>
            {data &&
              data.value &&
              data.value.map((el, i) => {
                return (
                  <Col
                    className='name-features-box pb-15'
                    md={realState ? 8 : 12}
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
    const { isShow } = this.state;
    const { step1 } = this.props;
    let categoryName = step1 && step1.categoryData.name;
    return categoryName === 'Automotive' ? (
      <Collapse
        defaultActiveKey={['1']}
        onChange={() => this.setState({ isShow: !isShow })}
        className='feature-panel'
        showArrow='false'
      >
        <Panel
          header='Features'
          key='1'
          showArrow='false'
          extra={
            isShow ? (
              <MinusCircleOutlined
                title={isShow ? 'Hide Features' : 'Show Features'}
              />
            ) : (
              <PlusCircleOutlined
                title={isShow ? 'Hide Features' : 'Show Features'}
              />
            )
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
    let selectedObj = allValues && allValues.filter((el) => el.id === value);
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
          label={'       '}
          name={data.att_name}
          // rules={data.validation === 1 && [required('')]}
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
    const { attribute } = this.state;
    const { step1 } = this.props;
    const realState =
      step1 && step1.templateName === 'realestate' ? true : false;
    if (attribute && attribute.length) {
      return attribute.map((data, i) => {
        let min_salary = data.slug === 'minimum_salary';
        let max_salary = data.slug === 'maximum_salary';
        let rent = data.slug === 'rent';
        let column =
          data.slug === 'property_type' ||
          data.slug === 'available_from' ||
          data.slug === 'Property Address'
            ? 24
            : 12;
        let specialAtt =
          data.is_functional_area !== 1 &&
          data.slug !== 'rent' &&
          data.slug !== 'per_week' &&
          data.slug !== 'is_price_negotiable?' &&
          data.slug !== 'about_you:' &&
          data.slug !== 'key_responsibilities:' &&
          data.slug !== 'How_to_apply';
        if (
          data.attr_type_name === 'Multi-Select' &&
          data.slug === 'features'
        ) {
          return (
            <div style={{ width: '100%' }} key={i}>
              <Divider className='custom-hr-line' />
              {this.renderMultiSelect(data)}
              {realState && <Divider className='custom-hr-line' />}
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
                <Col
                  xs={column}
                  sm={column}
                  md={column}
                  lg={column}
                  xl={column}
                >
                  <div key={i}>
                    {min_salary
                      ? this.renderMinSalary(data)
                      : max_salary
                      ? this.renderMaxSalary(data)
                      : renderField(data, data.attr_type_name, data.value)}
                  </div>
                </Col>
              ) : (
                <Col
                  xs={column}
                  sm={column}
                  md={column}
                  lg={column}
                  xl={column}
                >
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

  /**
   * @method getAttributes
   * @description formate attributes value
   */
  getAttributes = (value) => {
    const {
      per_week_data,
      sale_via_exp,
      is_ad_free,
      companyLogo,
      floorPlan,
      attribute,
      otherAttribute,
      fileList,
      textInputs,
      videoList,
    } = this.state;
    const { step1 } = this.props;
    let temp = {},
      specification = [],
      price = '';
    let temp2 = [];
    let allDynamicAttribute = [...otherAttribute, ...attribute];
    let answers = [],
      isReturn = false;
    const me = this.props;
    const job = step1 && step1.templateName === 'job' ? true : false;
    const realState =
      step1 && step1.templateName === 'realestate' ? true : false;
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
        if (this.myDivToFocus.current) {
          window.scrollTo(0, this.myDivToFocus.current.offsetTop);
        }
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
                            data.attr_type_name === 'Drop-Down'
                              ? dropDropwnValue.id
                              : value[key],
                          parent_value_id: dropDropwnValue.attribute_value_id
                            ? dropDropwnValue.attribute_value_id
                            : 0,
                          parent_attribute_id:
                            data.attr_type_name === 'Drop-Down'
                              ? dropDropwnValue.attribute_parent_id
                              : 0,
                          attr_type_name: data.attr_type_name,
                        };
                        specification.push({
                          key: data.att_name,
                          value: dropDropwnValue.name,
                        });
                      }
                    });
                  }
                });
              }
            }

            temp[att.att_id] = {
              measure_unit_value: value[`${el.att_name}_measure_unit`]
                ? value[`${el.att_name}_measure_unit`]
                : '',
              attr_type_id: att.attr_type,
              attr_value:
                att.attr_type_name === 'Drop-Down'
                  ? dropDropwnValue.id
                  : att.attr_type_name === 'calendar'
                  ? moment(value[key]).format('YYYY')
                  : att.attr_type_name === 'Date'
                  ? moment(value[key]).format('DD/MM/YYYY')
                  : att.attr_type_name === 'Radio-button'
                  ? checkedValue.id
                  : att.attr_type_name === 'textarea'
                  ? value[key].toHTML()
                  : value[key],
              parent_value_id: 0,
              parent_attribute_id:
                att.attr_type_name === 'Drop-Down' ? att.att_id : 0,
              attr_type_name: att.attr_type_name,
            };

            specification.push({
              key: att.att_name,
              slug: att.slug,
              position: att.position,
              value:
                att.attr_type_name === 'Drop-Down'
                  ? dropDropwnValue.name
                  : att.attr_type_name === 'calendar'
                  ? moment(value[key]).format('YYYY')
                  : att.attr_type_name === 'Date'
                  ? moment(value[key]).format('DD/MM/YYYY')
                  : att.attr_type_name === 'Radio-button'
                  ? checkedValue.name
                  : att.attr_type_name === 'textarea'
                  ? value[key].toHTML()
                  : value[key],
            });
            temp2.push({
              key: att.att_name,
              type: att.attr_type_name,
              value:
                att.attr_type_name === 'Drop-Down'
                  ? dropDropwnValue.name
                  : att.attr_type_name === 'calendar'
                  ? value[key]
                  : att.attr_type_name === 'Date'
                  ? value[key]
                  : att.attr_type_name === 'textarea'
                  ? value[key].toHTML()
                  : value[key],
            });
          }
        });
      }
    });
    let secondArray = [
      { key: 'title', value: value.title, type: 'text' },
      { key: 'inspection_type', value: value.inspection_type, type: 'text' },
      { key: 'description', value: value.description, type: 'text' },
      { key: 'price', value: value.price, perWeek: per_week_data },
      { key: 'is_ad_free', value: is_ad_free },
      {
        key: 'fileList',
        value: fileList && fileList.length ? fileList : [],
        type: 'image',
      },
      {
        key: 'videoList',
        value: videoList && videoList.length ? videoList : [],
        type: 'video',
      },
      {
        key: 'floor_plan',
        value: floorPlan && floorPlan.length ? floorPlan : [],
      },
      {
        key: 'company_logo',
        value: companyLogo && companyLogo.length ? companyLogo : [],
      },
      { key: 'questions', value: textInputs, type: 'questions' },
      {
        key: 'inspection_time',
        value: value.inspection_time,
        type: 'inspection_time',
      },
      { key: 'Per week', value: value['Per week'] },
      { key: 'is_sale_via_expression', value: value.is_sale_via_expression },
    ];
    let finalArray = temp2.concat(secondArray);
    const requestData = {
      attributevalue: temp,
      //description: value.description,
      description: value.description.toHTML(),
      // price: price ? price : '',
      price: value.price ? value.price : '',
      title: value.title,
      inspection_type: value.inspection_type,
      specification: specification,
      questions: textInputs,
      answers,
      inspection_time: tempArray,
      inspectionPreview: value.inspection_time,
      videoList: videoList && videoList.length ? videoList : [],
      floorPlan: floorPlan && floorPlan.length ? floorPlan : [],
      company_logo: companyLogo && companyLogo.length ? companyLogo : [],
      is_ad_free: is_ad_free ? 1 : 0,
      cat_name: step1.categoryData.name,
      // sale_via_exp: sale_via_exp ? 1 : 0
      is_sale_via_expression: value.is_sale_via_expression ? 1 : 0,
      price_taken_type: value['Per week'] ? value['Per week'] : '',
    };
    this.props.setAdPostData(requestData, 2);
    this.props.setAdPostData(
      { fileList: fileList && fileList.length ? fileList : [] },
      'fillist'
    );
    // this.props.nextStep(finalArray)
    !isReturn && this.props.nextStep(finalArray);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  onChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false;
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      return false;
    } else {
      this.setState({ fileList });
    }
  };

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

  onFloorPlanChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG , JPEG  & PNG file!');
      return false;
    } else if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
      return false;
    } else {
      this.setState({ floorPlan: fileList });
    }
  };

  onVideoUploadChange = ({ file, fileList }) => {
    const isJpgOrPng = file.type === 'video/mp4' || file.type === 'video/webm';
    const isLt2M = file.size / 1024 / 1024 < 100;
    if (!isJpgOrPng) {
      message.error('You can only upload mp4 ,webm file!');
      return false;
    } else if (!isLt2M) {
      message.error('Video must smaller than 100MB!');
      return false;
    } else {
      this.setState({ videoList: fileList });
    }
  };

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  appendInput() {
    // var newInput = `input-${this.state.textInputs.length}`;
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
      // textInputs[questionNo].ans.push(optionNo)
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
   * @method deleteQuestion
   * @description handle delete questions
   */
  deleteQuestion = (index) => {
    const { textInputs } = this.state;
    const values = [...textInputs];
    values.splice(index, 1);
    this.setState({ textInputs: values });
  };

  /**
   * @method renderQuestionbar
   * @description render component
   */
  renderQuestionBar = () => {
    const { textInputs } = this.state;
    return (
      <div id='dynamicInput'>
        <Title level={2}>Ask a Question</Title>
        {textInputs.map((input, i) => (
          <span>
            <Form.Item>
              <Row className='que-heading'>
                <Col md={12}>
                  <Title level={4}>{`Question ${i + 1}`}</Title>
                </Col>
                <Col md={12} className='text-right'>
                  <img
                    src={require('../../assets/images/icons/delete-grey-v.png')}
                    alt='delete'
                    onClick={() => this.deleteQuestion(i)}
                  />
                </Col>
              </Row>
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
          className='ant-btn btn-blue ant-btn-primary'
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
    const { weekly } = this.state;
    function disabledDate(current) {
      var dateObj = new Date(); // subtract one day from current time
      dateObj.setDate(dateObj.getDate() - 1);
      return current && current.valueOf() < dateObj;
    }
    return (
      <Form.List name='inspection_time'>
        {(fields, { add, remove }) => {
          return (
            <div ref={this.myDivToFocus}>
              {fields.map((field, index) => (
                <Row
                  gutter={(10, 10)}
                  className='inspection-type-box'
                  key={field.key}
                >
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
                        className='inspect-date-picker-box'
                        onChange={(date, dateString) => {
                          let currentField =
                            this.formRef.current &&
                            this.formRef.current.getFieldsValue();

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
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col md={12}>
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
                      <Col md={12}>
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
                  <Col md={1}>
                    {field.key !== 0 && (
                      <Col flex='none'>
                        <MinusCircleOutlined
                          className='dynamic-delete-button'
                          title={'Add More'}
                          onClick={() => remove(field.name)}
                        />
                      </Col>
                    )}
                  </Col>
                </Row>
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
          );
        }}
      </Form.List>
    );
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
    const {
      job_functions_data,
      isPerweekVisible,
      per_week_data,
      isNegotiable,
      isSaleVisible,
      rentChildren,
      rent_data,
      sale_via_exp,
      is_ad_free,
      negotiable_data,
      isOpen,
      companyLogo,
      floorPlan,
      videoList,
      initial,
      inspectiontime,
      otherAttribute,
      fileList,
      textInputs,
      weekly,
      singleDate,
      attribute,
    } = this.state;
    const { step1, have_questions } = this.props;
    const realState =
      step1 && step1.templateName === 'realestate' ? true : false;
    let categoryName = step1 && step1.categoryData.name;
    const job = step1 && step1.templateName === 'job' ? true : false;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className='ant-upload-text'>Upload</div>
        <img
          src={require('../../assets/images/icons/upload-small.svg')}
          alt='upload'
        />
      </div>
    );

    const uploadButton2 = (
      <Col md={8}>
        <Button danger>
          <label style={{ cursor: 'pointer' }}>Add Pictures</label>
        </Button>
      </Col>
    );
    const controls = ['bold', 'italic', 'underline', 'separator'];
    return (
      <Fragment>
        <div className='wrap'>
          <div className='post-ad-box'>
            {NavBar(step1)}
            <Form
              layout='vertical'
              onFinish={this.onFinish}
              ref={this.formRef}
              autoComplete='off'
              initialValues={{
                name: 'inspection_time',
                inspection_time: initial
                  ? inspectiontime
                  : [{ inspection_date: '', start_time: '', end_time: '' }],
              }}
            >
              <div className='card-container signup-tab step-3'>
                <Tabs type='card'>
                  <TabPane tab='Post Details' key='1'>
                    <Row justify='end' align='middle'>
                      <Col>
                        <span className='clr-link' onClick={this.resetForm}>
                          {/* Clear All <Icon icon='delete' size='16'/> */}
                          Clear All{' '}
                          <img
                            src={require('../../assets/images/icons/delete-blue.svg')}
                            alt='delete'
                            style={{ top: '-1px' }}
                          />
                        </span>
                      </Col>
                    </Row>
                    <Row gutter={0}>
                      <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div>
                          {realState ? (
                            <Form.Item
                              label={'Select a Category'}
                              className='pa-category-field-block'
                            >
                              <Input
                                disabled={true}
                                defaultValue={
                                  step1 &&
                                  step1.subCategoryData &&
                                  step1.subCategoryData.name
                                }
                                className='category-field-block'
                                size='large'
                              />
                            </Form.Item>
                          ) : (
                            <Form.Item label={'Category'}>
                              <Input
                                disabled={true}
                                defaultValue={
                                  step1 &&
                                  step1.categoryData &&
                                  step1.categoryData.name
                                }
                                className='category-field-block category-field-block-disabled'
                                size='large'
                              />
                            </Form.Item>
                          )}
                        </div>
                      </Col>
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
                            // renderField(
                            //   job_functions_data,
                            //   job_functions_data.attr_type_name,
                            //   job_functions_data.value
                            // )}
                            this.renderSelect(job_functions_data)}
                        </Col>
                      )}
                      {realState && (
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
                      {job_functions_data === '' && !realState && (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={12}
                          xl={12}
                          className='subcategory-field-block'
                        >
                          <div>
                            <Form.Item label={'Sub Category'}>
                              <Input
                                disabled={true}
                                defaultValue={
                                  step1 &&
                                  step1.subCategoryData &&
                                  step1.subCategoryData.name
                                }
                              />
                            </Form.Item>
                          </div>
                        </Col>
                      )}
                    </Row>
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
                    {isOpen && job && (
                      <Title level={4} className='heading-ant-typography'>
                        Job Description
                      </Title>
                    )}
                    <div>
                      <Form.Item
                        label={
                          isOpen ? 'About the opportunity:' : 'Description'
                        }
                        name='description'
                        className='label-large'
                        rules={[required('')]}
                      >
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
                      <div className='desc-link'>
                        <span
                          onClick={() => this.setState({ isOpen: !isOpen })}
                        >
                          {isOpen
                            ? 'Write a customised description'
                            : 'Use Formee template to write description'}
                        </span>
                      </div>
                    )}
                    {!job && categoryName !== 'Automotive' && !realState && (
                      <div>
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
                    <br />
                    {!is_ad_free && !job && !sale_via_exp && (
                      <Row gutter={12}>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={negotiable_data ? 16 : 24}
                          xl={negotiable_data ? 16 : 24}
                        >
                          <div>
                            <Form.Item
                              label={'Price'}
                              name={'price'}
                              rules={[required('')]}
                              className='price-input-num'
                            >
                              {/* <Input type={'number'}/> */}
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

                        {isPerweekVisible && per_week_data && rentChildren && (
                          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                            <div>
                              <Form.Item
                                // label={per_week_data && per_week_data.att_name}
                                label={'   '}
                                name={per_week_data && per_week_data.att_name}
                                // rules={[required('')]}
                                className='w-100 pt-3'
                              >
                                <Select
                                  placeholder={
                                    per_week_data && per_week_data.att_name
                                  }
                                  allowClear
                                >
                                  {rentChildren &&
                                    rentChildren.map((el, i) => {
                                      return (
                                        <Option key={i} value={el.name}>
                                          {el.name}
                                        </Option>
                                      );
                                    })}
                                </Select>
                              </Form.Item>
                            </div>
                          </Col>
                        )}
                        {isNegotiable && (
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
                    {isSaleVisible && realState && (
                      <Form.Item
                        name={'is_sale_via_expression'}
                        valuePropName='checked'
                      >
                        <Checkbox
                          onChange={(e) =>
                            this.setState({
                              sale_via_exp: e.target.checked ? true : false,
                            })
                          }
                        >
                          Sale via expression of interest
                        </Checkbox>
                      </Form.Item>
                    )}
                    {(job || realState) && (
                      <Divider className='custom-hr-line' />
                    )}
                    <Row gutter={12}>{this.renderItem()}</Row>
                    <Divider className='custom-hr-line' />
                    {!job && (
                      <Form.Item
                        label={'Add Pictures'}
                        name='image'
                        className='label- pt-30'
                      >
                        <Row>
                          <Col md={16}>
                            <ul className='pl-0'>
                              <li>
                                Add upto 8 images or upgrade to include more
                              </li>
                              <li>
                                Hold and drag to reorder photos. Maximum file
                                size 4MB.
                              </li>
                            </ul>
                          </Col>
                          <Col md={8} className='text-right'>
                            <label
                              for='picture_id'
                              style={{ cursor: 'pointer' }}
                            >
                              <Button
                                className='btn-red-border-and-text add-pics'
                                type='button'
                              >
                                <label
                                  for='picture_id'
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
                            showUploadList={true}
                            fileList={fileList}
                            customRequest={this.dummyRequest}
                            onChange={this.onChange}
                            id='picture_id'
                            multiple={true}
                          >
                            {fileList.length >= 8 ? null : uploadButton}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    )}
                    {job && (
                      <Form.Item
                        label={job ? 'Add Company Logo' : 'Add Pictures'}
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
                            {companyLogo.length >= 1 ? null : uploadButton}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    )}
                    {job && (
                      <ul className='pl-0'>
                        <li>Image size 500x500 pixles Maximum file size 4MB</li>
                      </ul>
                    )}
                    {job && (
                      <Button danger>
                        <label for='fileButton' style={{ cursor: 'pointer' }}>
                          Upload File
                        </label>
                      </Button>
                    )}
                    {realState && <Divider className='custom-hr-line' />}
                    {realState && (
                      <Form.Item
                        label='Add Floor Plan'
                        name='image'
                        className='label-large floor-pic-add-btn'
                      >
                        <Row>
                          <Col md={16}>
                            <ul className='pl-0'>
                              <li>
                                Add upto 4 images or upgrade to include more
                              </li>
                              <li>Maximum File size 4MB</li>
                            </ul>
                          </Col>
                        </Row>
                        <ImgCrop>
                          <Upload
                            name='avatar'
                            showUploadList={true}
                            fileList={floorPlan}
                            customRequest={this.dummyRequest}
                            onChange={this.onFloorPlanChange}
                          >
                            {floorPlan.length >= 1 ? null : uploadButton2}
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                    )}
                    <Divider className='custom-hr-line' />
                    <Form.Item
                      label='Add Videos'
                      name='video'
                      className='label-large'
                    >
                      <ul className='pl-0'>
                        {/* <li>Add upto 4 videos or upgrade to include more</li> */}
                        <li>Maximum File size 100MB</li>
                      </ul>
                      <Upload
                        name='avatar'
                        listType='picture-card'
                        className='avatar-uploader post-ad-upload-pics'
                        showUploadList={true}
                        fileList={videoList}
                        customRequest={this.dummyRequest}
                        onChange={this.onVideoUploadChange}
                      >
                        {videoList.length >= 1 ? null : uploadButton}
                      </Upload>
                    </Form.Item>
                    {(realState || have_questions === 1) && (
                      <Divider className='custom-hr-line' />
                    )}
                    {have_questions === 1 ? this.renderQuestionBar() : ''}
                    {realState && (
                      <div>
                        <Form.Item
                          label='Inspection Type'
                          name='inspection_type'
                          className='label-large'
                          rules={[required('')]}
                        >
                          <Select
                            placeholder='Select Subcategory'
                            className='inspection-type-selctor'
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
                    {realState &&
                      (weekly || singleDate) &&
                      this.renderInspectionTimeInput()}
                  </TabPane>
                </Tabs>
                {otherAttribute && otherAttribute.length !== 0 && (
                  <div className='card-container signup-tab mt-25 step-3'>
                    <Collapse>
                      <Panel header='Add more details (Optional)' key='1'>
                        <div>{this.renderOtherItem()}</div>
                      </Panel>
                    </Collapse>
                  </div>
                )}
              </div>
              <div className='steps-action flex align-center mb-32'>
                <Button
                  htmlType='submit'
                  type='primary'
                  size='middle'
                  className='btn-blue'
                >
                  NEXT
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth, profile, postAd } = store;
  const { step1 } = postAd;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInUser: auth.loggedInUser,
    step1,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};
export default connect(mapStateToProps, {
  getAttributeValues,
  getChildInput,
  getClassifiedDynamicInput,
  setAdPostData,
  enableLoading,
  disableLoading,
})(Step3);
