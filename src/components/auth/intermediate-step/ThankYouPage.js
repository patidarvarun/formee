import React, { Fragment } from 'react';
import { Typography } from 'antd';
const { Title, Paragraph } = Typography;

//Intermediate step final page
const ThankyouPage = () => {
  return (
    <Fragment>
      <div className='align-center mt-60 pb-50'>
        <Title level={2} className='text-gray pb-20'>Please wait one moment, we’re customising your shopping experience!</Title>
        <Paragraph className='text-gray'>To see your saved categories, please vist Your Menu. You can add and delete categories at any time </Paragraph>
        <div className='pt-40 pb-30'>
          <img src={require('../../../assets/images/icons/loading-signup.gif')} alt='' width='70' />
        </div>
      </div>
    </Fragment>
  );
}

export default ThankyouPage;
