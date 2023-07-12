import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button, Upload, Radio, message, Avatar, form, Row, Typography, Divider, Checkbox, Table } from 'antd';
import { LoadingOutlined, MinusCircleOutlined, LockOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Form, Input, Col, Select } from 'antd';
import SizeGuideModal from './SizeGuideModal'
import { STATUS_CODES } from '../../../../config/StatusCode';
import { MESSAGES } from '../../../../config/Message';
import { langs } from '../../../../config/localization';
import { getUserProfile, getTraderProfile, getEventTypes, getClassfiedCategoryListing, getBookingSubcategory, saveTraderProfile, deleteSizeGuide ,enableLoading,disableLoading} from '../../../../actions'
import { required, validNumber } from '../../../../config/FormValidation'
import BraftEditor from 'braft-editor';
import csc from 'country-state-city'
import UpdateSizeGuide from './UpdateSizeGuide';
const { Title, Text } = Typography;
const { Option } = Select;
const DOMESTIC_FLAG = 'Domestic'
const INTERNATIONAL_FLAG = 'international'
const DOMESTIC_DELIVERY_FLAG = 'Domestic Delivery'
const INTERNATIONAL_DELIVERY_FLAG = "international Delivery"
const SHIPPING_TYPE1 = "Integrated Logistic API"
const SHIPPING_TYPE2 = "Standard Shipping Rates"


class EventProfile extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            isInternational: false,
            isDomestic: false,
            domesticDeliveryBy: 0,
            internationalDelivery: false,
            allCountries: csc.getAllCountries(),
            selectedStates: [],
            domesticState: csc.getStatesOfCountry('AU'),
            is_paypal_accepted: false,
            is_mastercard: false,
            is_visa: false,
            is_applepay: false,
            is_afterpay: false,
            gpay: false,
            openSizeGuideModal: false,
            openUpdateSizeGuideModal: false,
            selectedNodes: [],
            guideList: null,
            editableGuide: null,
            fileList: '',
            selectedCat: [],
            editorState1: BraftEditor.createEditorState("<p><p>"),
        };
    }
    formRef = React.createRef();

    /**
    * @method componentWillMount
    * @description called after render the component
    */
    componentWillMount() {
        const { userDetails, loggedInUser } = this.props;
        const { postages, deliveries, size_guide_images } = userDetails.user
        console.log('size_guide_images: ', size_guide_images);
        const { accepted_payment_methods } = userDetails
        let domesticIndex = postages.findIndex((el) => el.postage_type === DOMESTIC_FLAG)
        let internationalIndex = postages.findIndex((el) => el.postage_type === INTERNATIONAL_FLAG)
        let standardIndex = deliveries.findIndex((el) => el.shipping_type === SHIPPING_TYPE2)
        let logisticIndexDomestic = deliveries.findIndex((el) => el.shipping_type === SHIPPING_TYPE1 && el.delivery_type === INTERNATIONAL_DELIVERY_FLAG)
        let logisticIndexInternational = deliveries.findIndex((el) => el.shipping_type === SHIPPING_TYPE1 && el.delivery_type === DOMESTIC_DELIVERY_FLAG)

        let states = []
        postages.map((el) => {
            if (el.postage_type === INTERNATIONAL_FLAG) {
                let selectedStates = csc.getStatesOfCountry(el.country_code)
                states = [...states, selectedStates]
            }
        })

        // console.log('isDomestic: **', isDomestic);
        this.setState({
            isDomestic: domesticIndex >= 0 ? true : false,
            isInternational: internationalIndex >= 0 ? true : false,
            domesticDeliveryBy: standardIndex >= 0 ? 0 : logisticIndexDomestic >= 0 ? 1 : 0,
            internationalDelivery: logisticIndexInternational >= 0 ? true : false,
            selectedStates: states,
            is_paypal_accepted: accepted_payment_methods.paypal === 1 ? true : false,
            is_mastercard: accepted_payment_methods.is_mastercard === 1 ? true : false,
            is_visa: accepted_payment_methods.is_visa === 1 ? true : false,
            is_applepay: accepted_payment_methods.is_applepay === 1 ? true : false,
            is_afterpay: accepted_payment_methods.is_afterpay === 1 ? true : false,
            gpay: accepted_payment_methods.is_gpay === 1 ? true : false,
            selectedCat: size_guide_images
        })
    }


    /** 
     * @method onClear All Event Cleares all screen
     * @description clear all fields  
     */
    onClearAll = () => {
        this.formRef.current.setFieldsValue({
            name: '',
            email: '',
            mobile_no: '',
            address: '',
            bussiness_name: '',
            fname: '',
            lname: '',
            pincode: ''
        });
    }

    /** 
     * @method beforeUpload
     * @description handle image Loading 
     */
    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG , JPEG  & PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    /** 
     * @method handleChange
     * @description handle Image change 
     */
    handleChange = info => {

        const { id } = this.props.loggedInUser;
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        const isCorrectFormat = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
        const isCorrectSize = info.file.size / 1024 / 1024 < 2;


        if (isCorrectSize && isCorrectFormat) {

            const formData = new FormData()
            formData.append('image', info.file.originFileObj);
            formData.append('user_id', id)
            this.props.changeProfileImage(formData, (res) => {
                if (res.status === 1) {
                    toastr.success(langs.success, langs.messages.profile_image_update_success)
                    this.getUserDetails()
                    this.setState({
                        imageUrl: res.data.image,
                        loading: false,
                    })

                }
            })
        }
    };


    /**
     * @method handleEditorChange
     * @description handle editor text value change
     */
    handleEditorChange = (editorState, i) => {
        if (i === 1) {
            this.setState({ editorState1: editorState })

        } else if (i === 2) {
            this.setState({ editorState2: editorState })

        }
    };

    /**
    * @method on finish
    * @description varify number
    */
    onFinish = (value) => {
        const { isDomestic, isInternational, domesticDeliveryBy, internationalDelivery, is_paypal_accepted,
            is_mastercard,
            is_visa,
            is_applepay,
            gpay,
            is_afterpay, allCountries, selectedNodes, guideList, fileList } = this.state;
        console.log('value: ', value);
        let postages = []
        let deliveries = new Array();
        let domesticObj = {};
        if (isDomestic) {
            domesticObj.postage_type = "Domestic"
            domesticObj.country = "Australia"
            domesticObj.excludes_states = value.domesticState
        }
        postages.push(domesticObj)
        // if (isInternational && domesticDeliveryBy) {
        value.international.map((el) => {
            let cont = allCountries.filter((c) => c.name === el.country)
            console.log('cont: ', cont);
            let obj = {
                postage_type: "international",
                country: cont[0] !== undefined ? cont[0].name : '',
                country_code: cont[0] !== undefined ? cont[0].isoCode : '',
                // country: JSON.parse(el.country).name,
                excludes_states: el.excludes_states
                // excludes_states: JSON.parse(el.excludes_states).name
            }
            postages.push(obj)
        })

        if (domesticDeliveryBy) {
            deliveries.push({
                delivery_type: "Domestic Delivery",
                shipping_type: "Integrated Logistic API",
            })
        } else {
            value.domestic.map((el) => {
                let obj = {
                    delivery_type: "Domestic Delivery",
                    shipping_type: "Standard Shipping Rates",
                    name: el.name,
                    price: el.price,
                    time: el.time,
                    delivery_in_days: el.time
                }
                deliveries.push(obj)
            })
        }

        (isInternational && internationalDelivery) && deliveries.push({
            delivery_type: "international Delivery",
            shipping_type: "Integrated Logistic API",
        })

        let reqData = {
            postages: JSON.stringify(postages),
            deliveries: JSON.stringify(deliveries),
            is_paypal_accepted: is_paypal_accepted ? 1 : 0,
            is_mastercard: is_mastercard ? 1 : 0,
            is_visa: is_visa ? 1 : 0,
            is_applepay: is_applepay ? 1 : 0,
            is_afterpay: is_afterpay ? 1 : 0,
            is_gpay: gpay ? 1 : 0,
            return_policy: value.return_policy.toHTML(),
            size_guide_categories: JSON.stringify(selectedNodes),
            size_guide_image: guideList ? guideList.originFileObj : '',
            return_policy_file: fileList ? fileList.originFileObj : ''

        }
        console.log(postages, 'reqData: ', deliveries);
        this.props.nextStep(reqData)
    }

    dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok');
        }, 0);
    };

    /**
       * @method handleImageUpload
       * @description handle image upload
       */
    handleImageUpload = ({ file, fileList }) => {
        console.log('fileList: ', fileList);
        console.log('file: ', file);

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isJpgOrPng) {
            message.error('You can only upload JPG , JPEG  & PNG file!');
            return false
        } else if (!isLt2M) {
            message.error('Image must smaller than 4MB!');
            return false
        } else {

            this.setState({ fileList: fileList[0] });
        }
    }

    handleAddress = (selectedAddress) => {
        this.setState({ selectedAddress: [...selectedAddress] })
    }

    /**
  * @method handleSizeGuideUpload
  * @description handle image upload
  */
    handleSizeGuideUpload = ({ file, fileList }) => {
        console.log('fileList: ', fileList);
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isJpgOrPng) {
            message.error('You can only upload JPG , JPEG  & PNG file!');
            return false
        } else if (!isLt2M) {
            message.error('Image must smaller than 4MB!');
            return false
        } else {
            this.setState({ guideList: fileList[0] });
        }
    }

    /**
     * @method onChange
     * @description change in tree select
     */
    onChange = (currentNode, selectedNodes) => {
        let temp = selectedNodes.map((el) => {
            return {
                category_id: el.value,
                pid: el.pid
            }
        })
        console.log('temp: ', temp);
        this.setState({ selectedNodes: temp })

    }
    /**
     * @method getTraderProfile
     * @description get Trader profile
     */
    getTraderProfile = (cat) => {
        console.log('Hello >>');
        const { id } = this.props.loggedInUser;
        this.props.enableLoading()
        this.props.getTraderProfile({ user_id: id }, (res) => {
            this.props.disableLoading()
            if (res.status === STATUS_CODES.OK) {
                this.setState({ selectedCat: res.data.user.size_guide_images })
            }
        })
    }

    /**
     * @method renderInternationalFormList
     * @description form list for International 
     */
    renderInternationalFormList = () => {
        const { allCountries, selectedStates } = this.state
        return <Form.List name="international">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(field => (
                        // <Space key={field.key} align="baseline">
                        <Row gutter={44} key={field.key}>
                            <Col span={12}>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                    }
                                >
                                    {() => (
                                        <Form.Item
                                            {...field}
                                            label="Posting to"
                                            name={[field.name, 'country']}
                                            fieldKey={[field.fieldKey, 'country']}
                                            rules={[{ required: true, message: 'country is required' }]}
                                        >
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
                                                placeholder="Select Country"
                                                optionFilterProp="children"
                                                onChange={(value) => {
                                                    // let parsedObj = JSON.parse(value)
                                                    // let selectedStates = csc.getStatesOfCountry(parsedObj.isoCode)
                                                    // console.log('parsedObj.isoCode: ', parsedObj.isoCode);
                                                    // this.setState({ selectedStates: selectedStates })
                                                    let currentField = this.formRef.current.getFieldsValue()
                                                    let cont = allCountries.filter((c) => c.name === value)
                                                    let selectedStates = []
                                                    if (cont.length) {
                                                        selectedStates = csc.getStatesOfCountry(cont[0].isoCode)
                                                    }
                                                    if (currentField.international[field.fieldKey] !== undefined) {

                                                        //Remove states
                                                        currentField.international[field.fieldKey].excludes_states = ''
                                                        // currentField.international.splice(field.fieldKey, 1);
                                                        // this.formRef.current.setFieldsValue(...currentField);

                                                        //get new state & push into array
                                                        let state = this.state.selectedStates
                                                        state[field.fieldKey] = selectedStates
                                                        this.setState({ selectedStates: state })
                                                        console.log(field.fieldKey, 'currentField: ', currentField.international[field.fieldKey]);
                                                        // currentField.international[field.fieldKey]                                                      
                                                    } else {
                                                        // myRef.current.setFieldsValue({ currentField })

                                                        console.log(this.state.selectedStates, 'selectedStates: ', selectedStates);
                                                        this.setState({ selectedStates: [...this.state.selectedStates, selectedStates] })
                                                    }


                                                }}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {allCountries.map((el) => {
                                                    // return <Option value={JSON.stringify(el)}>{el.name}</Option>
                                                    return <Option value={el.name}>{el.name}</Option>

                                                })}
                                            </Select>
                                        </Form.Item>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...field}
                                    label="Excludes"
                                    name={[field.name, 'excludes_states']}
                                    fieldKey={[field.fieldKey, 'excludes_states']}
                                    rules={[{ required: true, message: 'excludes_states is Required' }]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: 200 }}
                                        placeholder="Select state"
                                        optionFilterProp="children"
                                        onChange={(value) => {
                                            console.log('value: ', value);
                                            // let parsedObj = JSON.parse(value)
                                            // let selectedStates = csc.getStatesOfCountry(parsedObj.isoCode)
                                            // this.setState({ selectedStates: selectedStates })
                                        }}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {console.log(selectedStates, 'field.fieldKey: ', selectedStates[field.fieldKey])}
                                        {/* {(Array.isArray(selectedStates) && selectedStates.length) && selectedStates[field.fieldKey].map((el) => { */}
                                        {selectedStates[field.fieldKey] !== undefined && selectedStates[field.fieldKey].map((el) => {

                                            return <Option value={el.name}>{el.name}</Option>
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Col>
                        </Row>
                        // </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add more countries
              </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    }

    /**
     * @method renderDomesticDeliveryFormList
     * @description form list for domestic delivery 
     */
    renderDomesticDeliveryFormList = () => {
        return <Form.List name="domestic">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(field => (
                        // <Space key={field.key} align="baseline">
                        <Row gutter={48} key={field.key}>
                            <Col span={12}>
                                <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                        prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                    }
                                >
                                    {() => (
                                        <Form.Item
                                            {...field}
                                            label="Name"
                                            name={[field.name, 'name']}
                                            fieldKey={[field.fieldKey, 'name']}
                                            rules={[{ required: true, message: 'name is required' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...field}
                                    label="Price"
                                    name={[field.name, 'price']}
                                    fieldKey={[field.fieldKey, 'price']}
                                    rules={[{ required: true, message: 'price is Required' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...field}
                                    label="Estimated Delivery Time"
                                    name={[field.name, 'time']}
                                    fieldKey={[field.fieldKey, 'time']}
                                    rules={[{ required: true, message: 'time is Required' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'delivery_in_days']}
                                    fieldKey={[field.fieldKey, 'delivery_in_days']}
                                    rules={[{ required: true, message: 'days is Required' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Col>
                        </Row>
                        // </Space>
                    ))}
                    <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add more countries
              </Button>
                    </Form.Item>
                </>
            )}
        </Form.List>
    }

    /**
    * @method getInitialValue
    * @description returns Initial Value to set on its Fields
    */
    getInitialValue = () => {
        const { userDetails } = this.props;
        const { postages, deliveries, trader_profile } = userDetails.user;
        const { accepted_payment_methods } = userDetails
        let domesticIndex = postages.findIndex((el) => el.postage_type === DOMESTIC_FLAG)
        let internationalIndex = postages.findIndex((el) => el.postage_type === INTERNATIONAL_FLAG)
        let standardIndex = deliveries.findIndex((el) => el.shipping_type === SHIPPING_TYPE2)

        let intN = []
        let states = []
        postages.map((el) => {
            if (el.postage_type === INTERNATIONAL_FLAG) {
                console.log('el: ***', el);
                let selectedStates = csc.getStatesOfCountry(el.country_code)
                states = [...states, selectedStates]
                intN.push({ excludes_states: el.excludes_states, country: el.country, country_code: el.country_code })
            }
        })
        let domDelivery = []
        if (standardIndex >= 0) {
            deliveries.map((el) => {
                if (el.delivery_type === DOMESTIC_DELIVERY_FLAG && el.shipping_type === SHIPPING_TYPE2) {
                    domDelivery.push({
                        delivery_in_days: el.delivery_in_days,
                        delivery_type: el.delivery_type,
                        name: el.name,
                        price: el.price,
                        time: el.time,
                        shipping_type: "Standard Shipping Rates",
                    })
                }
            })
        } else {
            domDelivery.push({
                id: 'initail_content'
            })
        }
        let temp = {
            domesticState: domesticIndex >= 0 ? postages[domesticIndex].excludes_states : '',
            name: 'postage',
            // international: [{ id: 1 }],
            international: intN,
            domestic: domDelivery,
            return_policy: trader_profile && BraftEditor.createEditorState(trader_profile.return_policy),
        }
        return temp;
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { userDetails } = this.props;
        const { trader_profile } = userDetails.user;
        const { isInternational, isDomestic, domesticDeliveryBy, internationalDelivery, allCountries, is_paypal_accepted,
            guideList, selectedNodes, is_mastercard, is_visa, is_applepay, is_afterpay, gpay, openSizeGuideModal,
            fileList, selectedCat, openUpdateSizeGuideModal, editableGuide
        } = this.state;
        console.log('selectedCat: ', selectedCat);
        const controls = ['bold', 'italic', 'underline', 'separator']
        const fileProps = {
            name: 'file',
            customRequest: this.dummyRequest,
            onChange: this.handleImageUpload,
            multiple: false
        };
        let tableData = selectedCat.map((el) => {
            return {
                id: el.id,
                imageName: el.name,
                applicableTo: el.size_guide_categories
            }
        })
        // let tableData = [{
        //     imageName: trader_profile && trader_profile.size_guide_image,
        //     // applicableTo: selectedCat.map((el) => el.category.name)
        //     applicableTo: []

        // }]

        const columns = [
            {
                title: 'Name',
                render: text => {
                    return <p>{text.imageName}</p>

                }
            },
            {
                title: 'Applicatle To',
                render: text => {
                    let catName = []
                    text.applicableTo.map((el) => {
                        catName.push(el.category.name)
                    })
                    return <p>{catName.toString()}</p>
                }
            },
            {
                title: '',
                render: text => {
                    console.log('text: $$ss ', text);
                    return <Row>
                        <Col><a onClick={() => {
                            this.setState({ openUpdateSizeGuideModal: true, editableGuide: text })
                        }}>edit</a></Col>
                        <Col><p style={{ cursor: 'pointer' }} onClick={() => {
                            this.props.deleteSizeGuide({ size_guide_image_id: text.id }, (res) => {
                                if (res.status === 200) {
                                    toastr.success(langs.success, MESSAGES.DELETE_SIZE_GUIDE);
                                    this.getTraderProfile()
                                }
                            })
                        }}>delete</p></Col>
                    </Row>

                },
            }
        ]
        return (
            <Fragment >
                <div className="vender-detail-first">
                    <Form
                        ref={this.formRef}
                        // id='form1'
                        name='editProfile'
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        scrollToFirstError
                        initialValues={this.getInitialValue()}
                        layout={'vertical'}
                    >      <div className="form-block">
                            <h2>Postage</h2>
                            <Row gutter={44}>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                    <Form.Item
                                        name='domestic'
                                    >
                                        <Checkbox onChange={(e) => {
                                            this.setState({ isDomestic: e.target.checked })
                                        }} checked={isDomestic}><Title level={4} className=''>Domestic</Title></Checkbox>
                                    </Form.Item>
                                </Col>
                                {isDomestic && <Col span={12}>
                                    <Form.Item
                                        name='domesticCountry'
                                        defaultValue='Australia'
                                        label='Excludes'
                                        className="label-none"
                                    >
                                        <Input defaultValue='Australia' disabled />
                                    </Form.Item>
                                </Col>}
                                {isDomestic && <Col span={12}>
                                    <Form.Item
                                        label='Excludes'
                                        name='domesticState'
                                        rules={[required('Exclude')]}
                                    >
                                        <Select
                                            showSearch

                                            placeholder="Select state"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {this.state.domesticState.map((el) => {
                                                return <Option value={el.name}>{el.name}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>}
                            </Row>
                            {/* </div>
                        </div> */}
                        </div>
                        <Divider className="ml-minus42 mr-minus42" />

                        <Row gutter={28}>
                            <Col span={12}>
                                <Form.Item
                                    name='international'
                                >
                                    <Checkbox checked={isInternational} onChange={(e) => {
                                        this.setState({ isInternational: e.target.checked })
                                    }}><Title level={4} className=''>International</Title></Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                        {isInternational && this.renderInternationalFormList()}
                        {isDomestic && <Row gutter={28}>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Title level={4} className=''>Domestic Delivery</Title>
                            </Col>
                            <Col span={12}>
                                <Radio.Group
                                    onChange={(e) => this.setState({ domesticDeliveryBy: e.target.value })} value={domesticDeliveryBy}
                                >
                                    <Row gutter={28}>
                                        <Col >
                                            <Radio value={0}>Standard Shipping Rates</Radio>
                                            {!domesticDeliveryBy && this.renderDomesticDeliveryFormList()}
                                        </Col>
                                    </Row>
                                    <Row gutter={28}>
                                        <Col span={12}>
                                            <Radio value={1}>Integrated Logistic API</Radio>
                                        </Col>
                                    </Row>

                                </Radio.Group>
                            </Col>

                        </Row>}
                        {isInternational && <Row gutter={28}>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Title level={4} >International Delivery</Title>
                            </Col>
                            <Col span={12}>
                                <Row gutter={28}>
                                    <Col span={12}>
                                        <Checkbox checked={internationalDelivery} onChange={(e) => {
                                            this.setState({ internationalDelivery: e.target.checked })
                                        }}>Integrated Logistic API</Checkbox>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>}
                        <Divider className="mb-30" />
                        <Row gutter={44}>
                            <Col xs={24} sm={24} md={10}>
                                <Title level={4} >Return Policy</Title>
                            </Col>
                            <Col md={11}>
                                <Upload {...fileProps} multiple={false} showUploadList={false}>
                                    <Button icon={<UploadOutlined />}>{fileList ? fileList.name : 'Upload File'}</Button>
                                </Upload>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Form.Item
                                    name={`return_policy`}
                                    label=''
                                // rules={[required('Business Information')]}
                                >
                                    <BraftEditor
                                        // value={editorState1}
                                        controls={controls}
                                        onChange={(e) => this.handleEditorChange(e, 1)}
                                        contentStyle={{ height: 150 }}
                                        className={'input-editor braft-editor'}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider className="mb-30" />
                        <Row gutter={28}>
                            <Col xs={24} sm={24} md={24} lg={24}>
                                <Title level={4} >Accepted Payment Methods</Title>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Checkbox checked={is_paypal_accepted} onChange={(e) => {
                                    this.setState({ is_paypal_accepted: e.target.checked })
                                }}>Paypal</Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Checkbox checked={is_mastercard} onChange={(e) => {
                                    this.setState({ is_mastercard: e.target.checked })
                                }}>Mastercard</Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Checkbox checked={is_visa} onChange={(e) => {
                                    this.setState({ is_visa: e.target.checked })
                                }}>Visa</Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Checkbox checked={is_applepay} onChange={(e) => {
                                    this.setState({ is_applepay: e.target.checked })
                                }}>ApplePay</Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Checkbox checked={gpay} onChange={(e) => {
                                    this.setState({ gpay: e.target.checked })
                                }}>GPay</Checkbox>
                            </Col>
                        </Row>
                        <Row gutter={28}>
                            <Col span={12}>
                                <Checkbox checked={is_afterpay} onChange={(e) => {
                                    this.setState({ is_afterpay: e.target.checked })
                                }}>AfterPay</Checkbox>
                            </Col>
                        </Row>

                        <Button type='primary' size='middle' className='btn-blue'
                            onClick={() => this.setState({ openSizeGuideModal: true })}
                        >Size guide
                            </Button>
                        <Row gutter={28} >
                            <Col span={12} >
                                <Table columns={columns} dataSource={tableData} />
                            </Col>
                        </Row>
                        <div className="button-grp button-grp-pupl">
                            <Button htmlType='submit' type='primary' size='middle' className='btn-blue'
                            >NEXT
                            </Button>
                        </div>

                    </Form>
                    {/* <Divider /> */}
                </div>
                {/* <div className='steps-action align-center mt-50 pt-20 mb-32'>

                    {key === 1 && <Button htmlType='submit' type='primary' form='personal-form' size='middle' className='btn-blue'
                    //  onClick={() => this.props.nextStep()}
                     >
                        NEXT
        </Button>}
                    {key === 2 && <Button disabled htmlType='submit' type='primary' form='bussiness-form' size='middle' className='btn-blue' onClick={() => this.props.nextStep()}>
                        NEXT
        </Button>}
                </div> */}
                {openSizeGuideModal &&
                    <SizeGuideModal
                        visible={openSizeGuideModal}
                        handleImageUpload={this.handleSizeGuideUpload}
                        onSelectChange={this.onChange}
                        fileList={guideList}
                        selectedNodes={selectedNodes}
                        selectedCat={selectedCat}                     
                        onCancel={() => this.setState({ openSizeGuideModal: false })}
                        recallTrader={()=>this.getTraderProfile()}
                    />}

                {openUpdateSizeGuideModal &&
                    <UpdateSizeGuide
                        visible={openUpdateSizeGuideModal}
                        selectedCat={selectedCat}
                        editableGuide={editableGuide}
                        onCancel={() => this.setState({ openUpdateSizeGuideModal: false })}
                        recallTrader={()=>this.getTraderProfile()}
                    />}
            </Fragment >
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, profile, common } = store;
    const { savedCategories, categoryData } = common;

    let bookingList = [];
    // bookingList =
    //     categoryData && Array.isArray(categoryData.classified)
    //         ? categoryData.classified
    //         : [];
    bookingList = categoryData && Array.isArray(categoryData.booking.data) ? categoryData.booking.data : []

    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        bookingList,
        userDetails: profile.traderProfile !== null ? profile.traderProfile : {}
    };
};

export default connect(
    mapStateToProps,
    { getUserProfile, getTraderProfile, getEventTypes, getClassfiedCategoryListing, getBookingSubcategory, saveTraderProfile, deleteSizeGuide,enableLoading,disableLoading }
)(EventProfile);