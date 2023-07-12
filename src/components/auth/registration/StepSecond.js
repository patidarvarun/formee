import React, { Fragment } from 'react';
import { Tabs, Typography, Button } from 'antd';
import './style.less';
import PersonalRegistration from './PersonalRegistration';
import BussinessRegistration from './BussinessRegistration';
const { Title } = Typography;
const { TabPane } = Tabs;

class StepSecond extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitFromOutside: false,
      submitBussinessForm: false,
      key: (this.props.bussiness ? 2 : 1)
    };
  }

  /**
   * @method onTabChange
   * @description handle ontabchange 
   */
  onTabChange = () => {
    const { key } = this.state;
    if (key === 1) {
      this.setState({ key: 2 })
    } else if (key === 2) {
      this.setState({ key: 1 })
    }
  }

  /**
   * @method submitCustomForm
   * @description handle custum form  
   */
  submitCustomForm = () => {
    this.setState({
      submitFromOutside: true,
      submitBussinessForm: true
    });
  };

  /**
   * @method render
   * @description render component  
   */
  render() {
    const { key } = this.state;
    const { bussiness } = this.props;
    return (
      <Fragment>
        <Title level={2} className='align-center text-gray mt-35 mb-40'>Welcome to Formee, let’s create your account!</Title>
        <div className='card-container signup-tab'>
          <Tabs type='card' onChange={this.onTabChange} defaultActiveKey={bussiness ? '2' : '1'}>
            <TabPane tab='PERSONAL' key='1' className='bg-blue' style={{ background: 'blue' }}>
              <PersonalRegistration next={() => this.props.next()} submitFromOutside={this.state.submitFromOutside} />
            </TabPane>
            <TabPane tab='BUSINESS' key='2' className='bg-red business-tab'>
              <BussinessRegistration next={() => this.props.next()} submitBussinessForm={this.state.submitBussinessForm} />
            </TabPane>
          </Tabs>
        </div>
        <div className='steps-action align-center mb-32'>
          {key === 1 && <Button htmlType='submit' type='primary' form='personal-form' size='middle' className='btn-blue' onClick={this.submitCustomForm}>
            SUBMIT
          </Button>}
          {key === 2 && <Button htmlType='submit' type='primary' form='bussiness-form' size='middle' className='btn-blue' onClick={this.submitCustomForm}>
            SUBMIT
          </Button>}
        </div>
      </Fragment>
    );
  }
}

export default StepSecond;
