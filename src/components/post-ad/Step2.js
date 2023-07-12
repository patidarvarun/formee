import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { getClassfiedCategoryListing, getChildCategory } from '../../actions/index';
import { setAdPostData } from '../../actions/classifieds/PostAd';
import { required } from '../../config/FormValidation';
import { BACKEND_URL } from '../../config/Config';
import { langs } from '../../config/localization';
import { checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading } from '../../actions/index';
import { Row, Col, Typography, Button, Form, Select, Input } from 'antd';
const { Title, Paragraph } = Typography;
const { Option } = Select;

class Step1 extends React.Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      subCategory: [],
      subCategoryType: '',
      categoryType: '',
      categoryData: '',
      templateName: '',
      category: [],
      bussinesSubCategory: [],
      isBussiness: false
    };
  }

  /**
   * @method componentDidMount
   * @description called after mount the component
   */
  componentDidMount() {
    if (this.props.reqData) {
      const { reqData } = this.props;
      
      this.formRef.current && this.formRef.current.setFieldsValue({
        parent_categoryid: reqData.categoryData.name,
        category_id: reqData.subCategoryData.name
      });
      this.props.getChildCategory({ pid: reqData.categoryData.id }, res => {
        
        if (res.status === 200) {
          const data = Array.isArray(res.data.newinsertcategories) && res.data.newinsertcategories;
          this.setState({
            subCategory: data,
            categoryType: reqData.parent_categoryid,
            subCategoryType: reqData.category_id,
            categoryData: reqData.categoryData,
            templateName: reqData.templateName,
            subCategoryData: reqData.subCategoryData
          })
        }
      })
    }
    this.handlePostAnAd()
  }

  /**
   * @method handlePostAnAd
   * @description handle post an ad for business user
   */
  handlePostAnAd = () => {
    const { loggedInDetail } = this.props;
    this.props.enableLoading()
    this.props.checkPermissionForPostAd({ user_id: loggedInDetail.id }, res => {
      this.props.disableLoading()
      if (res.status === 200) {
        let data = res.data;
        if (data.seller_type === langs.key.business) {
          this.setState({ isBussiness: true, category: data.category })
        }
      }
    })
  }

  /**
   * @method onCategoryChange
   * @description handle category change
   */
  onCategoryChange = (value) => {
    
    let templateName = '';
    let obj = JSON.parse(value);
    let reqData = {
      id: obj.id,
      page: 1,
      page_size: 10,
    };
    this.formRef.current && this.formRef.current.setFieldsValue({
      category_id: null
    });
    this.setState({ categoryData: obj,categoryType: obj.id,templateName:obj.template_slug })
    this.props.getChildCategory({ pid: obj.id }, res => {
      if (res.status === 200) {
        const data = Array.isArray(res.data.newinsertcategories) && res.data.newinsertcategories;
        this.setState({ subCategory: data })
      }
    })
    this.props.getClassfiedCategoryListing(reqData, (res) => {
      if (res.status === 200) {
        if (Array.isArray(res.data.data) && res.data.data.length) {
          templateName = res.data.data[0].template_slug;
          this.setState({ templateName: templateName });
          this.setState({
            categoryType: obj.id,
            categoryData: obj,
          });
        }
      }
    });
  };

  /**
   * @method onSubCategoryChange
   * @description handle sub category change
   */
  onSubCategoryChange = (value) => {
    let obj = JSON.parse(value);
    this.setState({ subCategoryType: obj.id, subCategoryData: obj });
  };

  /**
   * @method parentCategory
   * @description render booking category list
   */
  parentCategory = (category) => {
    
    return (
      category.length !== 0 &&
      category.map((keyName, i) => {
        return (
          <Option key={i} value={JSON.stringify(keyName)}>
            {keyName.name}
          </Option>
        );
      })
    );
  };

  /**
   * @method defaultParentCategory
   * @description render booking category list
   */
  defaultParentCategory = (category) => {
    return (
      Object.keys(category).map((keyName, i) => {
        return (
          <Option key={i} value={JSON.stringify(category[keyName])}>
            {category[keyName].name}
          </Option>
        );
      })
    );
  };

  /**
   * @method childCategory
   * @description render booking category list
   */
  childCategory = (childCategory) => {
    return (
      childCategory.length !== 0 &&
      childCategory.map((keyName, i) => {
        return (
          <Option key={i} value={JSON.stringify(keyName)}>
            {keyName.name}
          </Option>
        );
      })
    );
  };

  /**
   * @method onFinish
   * @description called to submit form
   */
  onFinish = (value) => {
    const {
      subCategoryType,
      categoryType,
      categoryData,
      templateName,
      subCategoryData
    } = this.state;
    const requestData = {
      parent_categoryid: categoryType,
      category_id: subCategoryType,
      categoryData: categoryData,
      templateName: templateName,
      subCategoryData: subCategoryData
    };
    
    this.props.setAdPostData(requestData, 1);

    this.props.nextStep(requestData);
  };

  /** 
   * @method getInitialValue
   * @description returns Initial Value to set on its Fields 
   */
  // getInitialValue = () => {
  //   if (this.props.reqData) {
  //     
  //     this.formRef.current && this.formRef.current.setFieldsValue({
  //       parent_categoryid: this.state.categoryData.name,
  //       category_id: this.state.subCategoryData.name
  //     });
  //     this.props.getChildCategory({ pid: this.props.reqData.categoryData.id }, res => {
  //       if (res.status === 200) {
  //         const data = Array.isArray(res.data.newinsertcategories) && res.data.newinsertcategories;
  //         this.setState({ subCategory: data })
  //       }
  //     })
  //   }

  // }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { classifiedList, categoyType } = this.props;
    const { subCategory, isBussiness, category, bussinesSubCategory } = this.state;
    return (
      <Fragment>
        <div className='wrap'>
          <div className='align-center mt-40 pb-32' style={{ position: 'relative' }}>
            <Title level={2} className='text-blue'>Post an Ad</Title>
            <Paragraph className='text-gray'>Select Ad category</Paragraph>
          </div>
          <Form
            layout='vertical'
            onFinish={this.onFinish}
            ref={this.formRef}
          // initialValues={this.getInitialValue()}
          >
            <Row gutter={28}>
              <Col span={16} offset={4}>
                <Form.Item className='mb-0'>
                  <Input.Group compact className='custom-compact'>
                    <Form.Item
                      name='parent_categoryid'
                      //noStyle
                      rules={[required('Category')]}
                      style={{ width: '50%' }}
                    >
                      {isBussiness ? <Select
                        placeholder='Select Category'
                        allowClear
                        onChange={this.onCategoryChange}
                        size={'large'}
                        className='w-100'
                      >
                        {}
                        {category.length !== 0 && this.defaultParentCategory(category)}
                      </Select> :
                        <Select
                          placeholder='Select Category'
                          onChange={this.onCategoryChange}
                          allowClear
                          size={'large'}
                          className='w-100'
                        // defaultValue={this.props.reqData ? this.props.reqData.categoryData.name : ''}
                        >
                          {classifiedList && this.parentCategory(classifiedList)}
                        </Select>}
                    </Form.Item>
                    <Form.Item
                      name='category_id'
                      //noStyle
                      rules={[required('Subcategory')]}
                      style={{ width: '50%' }}
                    >
                      <Select
                        placeholder='Select Subcategory'
                        onChange={this.onSubCategoryChange}
                        allowClear
                        size={'large'}
                        className='w-100'
                      // defaultValue={this.props.reqData ? this.props.reqData.subCategoryData.name : ''}
                      >
                        {subCategory && this.childCategory(subCategory)}
                      </Select>
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
            </Row>
            <div className='align-center mb-32'>
              <Paragraph className='text-gray mt-20 pb-18 fs-16-or'>OR</Paragraph>
              <Paragraph className='text-gray mb-37'>Already have an ad ?</Paragraph>
              {/* <a href="javascript:void(0)"
                // href={BACKEND_URL} target='blank'
              > */}
                <Button type='default' danger className='text-black'>Manage my Ad</Button>
              {/* </a> */}
            </div>
            <div className='steps-action flex align- pt-55 mb-50'>
              <Button
                htmlType='submit' type='primary' size='middle' className='btn-blue'
              >
                NEXT
            </Button>
            </div>
          </Form>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (store) => {
  const { common, auth } = store;
  const { savedCategories, categoryData } = common;
  let classifiedList = [];
  // let isEmpty =
  //   savedCategories.success.booking.length === 0 &&
  //   savedCategories.success.retail.length === 0 &&
  //   savedCategories.success.classified.length === 0 &&
  //   (savedCategories.success.foodScanner === '' ||
  //     (Array.isArray(savedCategories.success.foodScanner) &&
  //       savedCategories.success.foodScanner.length === 0));
  // if (auth.isLoggedIn) {
  //   if (!isEmpty) {
  //     isEmpty = false;
  //     classifiedList = savedCategories.success.classified && savedCategories.success.classified.filter(el => el.pid === 0);
  //   } else {
  //     isEmpty = true;
  //     classifiedList =
  //       categoryData &&
  //         Array.isArray(categoryData.classified)
  //         ? categoryData.classified
  //         : [];
  //   }
  // } else {
  //   isEmpty = true;
  //   classifiedList =
  //     categoryData && Array.isArray(categoryData.classified)
  //       ? categoryData.classified
  //       : [];
  // }
  classifiedList =
    categoryData && Array.isArray(categoryData.classified)
      ? categoryData.classified
      : [];

  return {
    loggedInDetail: auth.loggedInUser,
    classifiedList,
  };
};
export default connect(mapStateToProps, {
  setAdPostData,
  getClassfiedCategoryListing, getChildCategory, checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading
})(Step1);
