import React, { Fragment } from 'react';
import { Button, Typography } from 'antd';
const { Title } = Typography;

class StepFirst extends React.Component {

  /**
   * @method moveToBussiness
   * @description move to bussiness signup 
   */
  moveToBussiness = () => {
    const { nextStep, callNext } = this.props;
    nextStep()
    callNext(true)
  }

  /**
   * @method moveToPersonal
   * @description move to personal signup 
   */
  moveToPersonal = () => {
    this.props.nextStep()
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    return (
      <Fragment>
        <Title level={2} className='align-center text-gray mt-50 pb-40'>Welcome to Formee, let’s create your account!</Title>
        <div className='pt-20 align-center'>
          <Button type='primary' size='large' danger className='large' onClick={() => this.moveToBussiness()}>
            BUSINESS
          </Button>
        </div>
        <div className='pt-30 pb-40 align-center'>
          <Button type='primary' size='large' className='btn-blue large' onClick={() => this.moveToPersonal()}>
            PERSONAL
        </Button>
        </div>
      </Fragment>
    );
  }
}

export default StepFirst;
