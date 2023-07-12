import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AppSidebar from "../../../../sidebar";
import "./CarFilter.less";
import {
  Layout,
  Row,
  Col,
  Radio,
  Typography,
  Card,
  Tabs,
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Breadcrumb,
  Space,
} from "antd";
const { Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
class CarFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "tab1",
      noTitleKey: "app",
      value: 1,
      classifiedList: [],
    };
  }
  onChange = (e) => {
    
    this.setState({
      value: e.target.value,
    });
  };
  render() {
    const { classifiedList, topImages } = this.state;
    const { isLoggedIn } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px",
    };
    const { value } = this.state;
    return (
      <Layout className="car-filter-block">
        <Layout>
          <AppSidebar />
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
                      {classifiedList.length && (
                        <Breadcrumb.Item>
                          {classifiedList[0].catname}
                        </Breadcrumb.Item>
                      )}
                    </Breadcrumb>
                  </Col>
                </Row>
                <Title level={3} className="text-lightorange mb-0">
                  {"Refines"}
                </Title>
                <div className="filter-page">
                  <Tabs type="card" className={"tab-style2"}>
                    <TabPane tab="Car Hire" key="1">
                      <div className="filter-page-content hh">
                        <Row gutter={[58, 0]}>
                          <Col md={16}>
                            <Form>
                              <Form.Item>
                                <div className="section-title bordered">
                                  <Text>Car Type</Text>
                                </div>
                                <Row>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        Small Cars
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        SUVs
                                      </Radio>
                                      <Radio style={radioStyle} value={3}>
                                        Premium Cars
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        Medium Cars
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        MPVs
                                      </Radio>
                                      <Radio style={radioStyle} value={3}>
                                        Passenger Van
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                </Row>
                              </Form.Item>
                              <Form.Item>
                                <div className="section-title bordered">
                                  <Text>Supplier</Text>
                                </div>
                                <Row>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        All
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        Atlas
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        Alamo
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        Avis
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                </Row>
                              </Form.Item>
                              <Form.Item>
                                <div className="section-title bordered">
                                  <Text>Seats</Text>
                                </div>
                                <Row>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        All
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        6 - 7 Seats
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        Other
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        4 - 5 Seats
                                      </Radio>
                                      <Radio style={radioStyle} value={2}>
                                        8 - 9 Seats
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                </Row>
                              </Form.Item>
                              <Form.Item>
                                <div className="section-title bordered">
                                  <Text>Fuel Policy</Text>
                                </div>
                                <Row>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        Full to Full
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                </Row>
                              </Form.Item>
                              <Form.Item>
                                <div className="section-title bordered">
                                  <Text>Mileage Allowance</Text>
                                </div>
                                <Row>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        Unlimited Mileage
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                  <Col md={12}>
                                    <Radio.Group onChange={this.onChange}>
                                      <Radio style={radioStyle} value={1}>
                                        Limited Mileage
                                      </Radio>
                                    </Radio.Group>
                                  </Col>
                                </Row>
                              </Form.Item>
                              <Form.Item className="align-center marg-top-custom">
                                <Button type="default">{"Search"}</Button>
                              </Form.Item>
                            </Form>
                          </Col>
                          <Col md={8}>&nbsp;</Col>
                        </Row>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
export default CarFilter;
