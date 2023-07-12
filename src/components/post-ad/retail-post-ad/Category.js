import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { getClassfiedCategoryListing, getChildCategory } from '../../../actions/index';
import { setAdPostData } from '../../../actions/classifieds/PostAd';
import { required } from '../../../config/FormValidation';
import { BACKEND_URL } from '../../../config/Config';
import { langs } from '../../../config/localization';
import { checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading } from '../../../actions/index';
import {Cascader , Row, Col, Typography, Button, Form, Select, Input } from 'antd';
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
      isBussiness: false,
      subChildId:'',
      subChildData: ''
    };
  }

  /**
   * @method componentDidMount
   * @description called after mount the component
   */
  componentDidMount() {
    if (this.props.reqData) {
      const { reqData,retailList } = this.props;
      
      this.formRef.current && this.formRef.current.setFieldsValue({
        parent_categoryid: reqData.categoryData.text ? reqData.categoryData.text : reqData.categoryData.name,
        category_id: reqData.subCategoryData.text
      });
      this.setState({
        categoryType: reqData.parent_categoryid,
        subCategoryType: reqData.category_id,
        categoryData: reqData.categoryData,
        templateName: reqData.templateName,
        subCategoryData: reqData.subCategoryData
      } , () => {
        this.getSubCategoryData(reqData.parent_categoryid)
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
    let obj = JSON.parse(value);
    this.setState({categoryType: obj.id,categoryData: obj});
    this.formRef.current && this.formRef.current.setFieldsValue({
      category_id: null
    });
    this.getSubCategoryData(obj.id)
  };

  /**
   * @method getSubCategoryData
   * @description get subcategory data
   */
  getSubCategoryData = (id) => {
    const { retailList } = this.props
    let subcategories = retailList && retailList.filter(el => el.id == id)
    
    if(subcategories && Array.isArray(subcategories) && subcategories.length){
        let subCategory = subcategories[0].category_childs
        let temp = []
        subCategory && subCategory.length !== 0 && subCategory.map((el, i) => {
          let item = el.category_childs && Array.isArray(el.category_childs) && el.category_childs.length ? el.category_childs : []
          let temp2=[]
          item.length !== 0 && item.map((el2, i) => {
              temp2.push({value: JSON.stringify(el2), label: el2.text})
          })
          temp.push({value: JSON.stringify(el), label: el.text, children:temp2 })
        })
        
        // this.setState({subCategory: subcategories[0].category_childs})
        this.setState({subCategory:temp })
    }
  }

  /**
   * @method onSubCategoryChange
   * @description handle sub category change
   */
  onSubCategoryChange = (value) => {
    
    if(value && value.length){
      let obj1 = '', obj2 = ''
      value.map((el, i) => {
        if(i==0){obj1 = JSON.parse(el)}
        if(i==1){obj2 = JSON.parse(el)}
      })
      
      this.setState({ subCategoryType: obj1.id, subCategoryData: obj1, subChildId:obj2.id, subChildData:obj2 });
    }
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
            {keyName.text}
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
    if(childCategory.length !== 0){
      return (
        childCategory.map((keyName, i) => {
          return (
            <Option key={i} value={JSON.stringify(keyName)}>
              {keyName.text}
            </Option>
          );
        })
      );
    }
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
      subCategoryData, subChildId,subChildData
    } = this.state;
    const requestData = {
      parent_categoryid: categoryType,
      category_id: subCategoryType,
      categoryData: categoryData,
      templateName: templateName,
      subCategoryData: subCategoryData,
      child_category_id:subChildId,
      subChildData:subChildData
    };
    
    this.props.setAdPostData(requestData, 1);
    this.props.nextStep(requestData);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { retailList, categoyType} = this.props;
    const { subCategory,isBussiness, category } = this.state;
    return (
      <Fragment>
        <div className='wrap'>
          <div className='align-center mt-40 pb-30' style={{ position: 'relative' }}>
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
                      <Select
                        placeholder='Select Category'
                        onChange={this.onCategoryChange}
                        allowClear
                        size={'large'}
                        className='w-100'
                      >
                        {retailList && this.parentCategory(retailList)}
                      </Select>
                       {/* {isBussiness ? <Select
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
                          {retailList && this.parentCategory(retailList)}
                        </Select>} */}
                    </Form.Item>
                    <Form.Item
                      name='category_id'
                      //noStyle
                      rules={[required('Subcategory')]}
                      style={{ width: '50%' }}
                    >
                      {/* <Select
                        placeholder='Select Subcategory'
                        onChange={this.onSubCategoryChange}
                        allowClear
                        size={'large'}
                        className='w-100'
                      >
                        {subCategory && this.childCategory(subCategory)}
                      </Select> */}
                       <Cascader 
                        placeholder='Select Subcategory'
                        onChange={this.onSubCategoryChange}
                        allowClear
                        size={'large'}
                        className='w-100'
                        options={subCategory}
                        changeOnSelect 
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </Col>
            </Row>
            <div className='align-center mb-32'>
              <Paragraph className='text-gray mt-20 pb-15'>Or</Paragraph>
              <Paragraph className='text-gray mb-40'>Already have an ad ?</Paragraph>
              <a href={BACKEND_URL} target='blank'>
                <Button type='default' danger className='text-black'>Manage my Ad</Button>
              </a>
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
  const {categoryData } = common;
  let retailList = categoryData && Array.isArray(categoryData.retail.data) ? categoryData.retail.data : []
  return {
    loggedInDetail: auth.loggedInUser,
    retailList,
  };
};
export default connect(mapStateToProps, {
  setAdPostData,
  getClassfiedCategoryListing, getChildCategory, checkPermissionForPostAd, openLoginModel, enableLoading, disableLoading
})(Step1);
