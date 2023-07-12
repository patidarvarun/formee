import React, { Fragment } from 'react';
import { Typography,Modal } from 'antd';
const { Title } = Typography;

const ViewSizeGuide = (props) => {
    return (
        <Fragment>
            <Modal
                visible={props.visible}
                className={'custom-modal style1'}
                footer={false}
                onCancel={props.onCancel}
            >
            <div className='align-center mt-60 pb-50'>
            <img
                src={props.size_guide_image ? props.size_guide_image : require("../../../../assets/images/size-guide.jpg")}
                alt="size guide"
            />
            </div>
        </Modal>
        </Fragment>
    );
}

export default ViewSizeGuide;
