import React, { Component } from 'react';
import AppSidebar from '../sidebar/HomeSideBarbar';
import { Layout, Breadcrumb, Typography, Tabs, Row, Col, Table, Input, Upload, message, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import history from '../../common/History';
import { DEFAULT_IMAGE_CARD } from '../../config/Config';
import { connect } from 'react-redux';
import { enableLoading, disableLoading, } from '../../actions/index'
import { addProduct } from '../../actions/food-scanner/FoodScanner'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization';
import Back from '../common/Back';
const { Title } = Typography;
const { TabPane } = Tabs;
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      nutritionTableData: [],
      productDetails: {},
      loading: false,
      productName: '',
      productNumber: ''
    }
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload(file) {
    console.log('file: type ', file.type);
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
      message.error('Image must smaller than 4MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = (info, id) => {
    console.log('info: ', info);
    if (info.file.status === 'uploading') {
      this.setState({ [`loading${id}`]: true });
      return;
    }
    if (info.file.status === 'done') {
      console.log('info.file.originFileObj: ', info.file.originFileObj);
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          [`imageUrl${id}`]: imageUrl,
          [`imageObject${id}`]: info.file.originFileObj,
          [`loading${id}`]: false,
        }),
      );
    }
  }

  handleAddProduct = () => {
    if (!this.state.productName) {
      toastr.warning('Warning', 'Please enter the product name');
    } else if (!this.state.productNumber) {
      toastr.warning('Warning', 'Please enter the barcode number');
    }
    else if (!this.state.imageObject1 && !this.state.imageObject2 && !this.state.imageObject4 && !this.state.imageObject3) {
      toastr.warning('Warning', 'All images are compulsory');
    } else {
      const requestData = {
        product_name: this.state.productName,
        barcode: this.state.productNumber,
        product_image: this.state.imageObject1,
        ingredients_image: this.state.imageObject2,
        nutrition_image: this.state.imageObject4,
        barcode_image: this.state.imageObject3
      }
      let formData = new FormData();
      Object.keys(requestData).forEach((key) => {
        formData.append(key, requestData[key])
      });
      this.props.addProduct(formData, res => {
        console.log('res: ', res);
        if (res.status === true) {
          toastr.success('Success', 'Product has been created successfully.');
          this.props.history.push('/food-scanner')
        }
      })
    }
  }

  dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  render() {


    return (
      <div className='App foodscanner-green-main-wrap'>
        <Layout className="foodscanner-add-product">
          <Layout>
            {/* <AppSidebar history={history} /> */}
            <Layout>
              <div className='bg-linear pb-76'>
              <div className="back-link food-scanner-back"><Back {...this.props} /></div>
                <div className="post-ad-box">
                  <Title level={2} className='text-blue mt-20 mb-10'>Add Product</Title>
                  {/* <Breadcrumb separator='|' className='' >
                    <Breadcrumb.Item>
                      <Link to='/'>Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      <Link to='/food-scanner'>Food Scanner</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                      Add Product
                                </Breadcrumb.Item>
                  </Breadcrumb> */}

                  <Tabs
                    type='card'
                    className={'tab-style2'}
                  >
                    <TabPane tab='Add Product' key='1'>
                    <Row gutter={20}>
                    <Col span={12}>
                    <label>Product Name</label>
                      <Input name='product-name' onChange={(e) => { this.setState({ productName: e.target.value }) }} />
                    </Col>
                    <Col span={12}>
                    <label>Barcode Number</label>
                      <Input type='number' name='product-name' onChange={(e) => { this.setState({ productNumber: e.target.value }) }} />
                    </Col>
                    </Row>
                      
                     

                      <h2>Please add image to follow:</h2>
                      <p>Maximum file size 4 mb</p>
                      <div className="product-detail-content">
                        <Row className="upload-cover-photo">
                          <Col span={6}>
                          <Checkbox onChange={onChange}>Product Name</Checkbox>
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                              customRequest={this.dummyRequest}
                              beforeUpload={this.beforeUpload}
                              onChange={(e) => this.handleChange(e, 1)}
                            >
                              <img src={require('../../assets/images/icons/upload.svg')} alt='upload' />
                              {this.state.imageUrl1 ? <img src={this.state.imageUrl1} alt="avatar" style={{ width: '100%' }} /> :
                                <div>
                                  {this.state.loading1 ? <LoadingOutlined /> : <PlusOutlined />}

                                </div>
                              }
                            </Upload>
                          </Col>
                          <Col span={6}>
                            <Checkbox onChange={onChange}>Ingredients</Checkbox>
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                              customRequest={this.dummyRequest}
                              beforeUpload={this.beforeUpload}
                              onChange={(e) => this.handleChange(e, 2)}
                            >
                              <img src={require('../../assets/images/icons/upload.svg')} alt='upload' />
                              {this.state.imageUrl2 ? <img src={this.state.imageUrl2} alt="avatar" style={{ width: '100%' }} /> :
                                <div>
                                  {this.state.loading2 ? <LoadingOutlined /> : <PlusOutlined />}

                                </div>
                              }
                            </Upload>
                          </Col>
                          <Col span={6}>
                            <Checkbox onChange={onChange}>Barcode Name</Checkbox>
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                              customRequest={this.dummyRequest}
                              beforeUpload={this.beforeUpload}
                              onChange={(e) => this.handleChange(e, 3)}
                            >
                              <img src={require('../../assets/images/icons/upload.svg')} alt='upload' />
                              {this.state.imageUrl3 ? <img src={this.state.imageUrl3} alt="avatar" style={{ width: '100%' }} /> :
                                <div>
                                  {this.state.loading3 ? <LoadingOutlined /> : <PlusOutlined />}

                                </div>}
                            </Upload>
                          </Col>
                          <Col span={6}>
                            <Checkbox onChange={onChange}>Nutrition</Checkbox>
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                              customRequest={this.dummyRequest}
                              beforeUpload={this.beforeUpload}
                              onChange={(e) => this.handleChange(e, 4)}
                            >
                              <img src={require('../../assets/images/icons/upload.svg')} alt='upload' />
                              {this.state.imageUrl4 ? <img src={this.state.imageUrl4} alt="avatar" style={{ width: '100%' }} /> :
                                <div>
                                  {this.state.loading4 ? <LoadingOutlined /> : <PlusOutlined />}

                                </div>}
                            </Upload>
                          </Col>
                          <Col xs={24} sm={24} md={24} lg={24}>
                            <p>{this.props.match.params.barcode ? this.props.match.params.barcode : ''}</p>
                          </Col>
                        </Row>
                        <Button type='button' onClick={() => this.handleAddProduct()}>Add Pictures</Button>
                      </div>
                    </TabPane>
                  </Tabs>
                  <div className="bottom-detail">
                    <p>By adding this product millions of people will benefit from it.</p>
                    <Button type='button' onClick={() => this.handleAddProduct()}>Send</Button>
                  </div>

                </div>
              </div>
            </Layout>
          </Layout>
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
}

export default connect(
  mapStateToProps, { enableLoading, disableLoading, addProduct }
)(withRouter(AddProduct));
