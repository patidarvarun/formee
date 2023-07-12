import React, { Fragment } from 'react';
import { Link } from 'react-router-dom'
import { Typography, Card, Button, Modal } from 'antd';
const { Title } = Typography;

const Success = (props) => {
    return (
        <Fragment>
            <Modal
                visible={props.visible}
                className={'custom-modal style1 modal-hide-cross'}
                footer={false}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
            <div className='align-center mt-60 pb-50'>
                <Title level={2} className='text-gray pb-20'>Your post has been sent successfully</Title>
                <Link to='/classifieds'><Button className='align-center'>Back to Search</Button></Link>
            </div>
        </Modal>
        </Fragment>
    );
}

export default Success;
