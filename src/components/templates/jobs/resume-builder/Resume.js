import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Icon from '../../../../components/customIcons/customIcons';
import { Typography, Row, Col, Form, Input, Button, Modal, Space } from 'antd';
import Resume from './ResumeContent';
// import Pdf from 'react-to-pdf';

// import { Document, Page, pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ref = React.createRef();
const { Title, Text, Paragraph } = Typography;

class ResumeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isForgotPassword: false,
            isRedirect: false,
            redirectToDashBoard: false,
            defaultRedirect: false
        };
    }



    /**
     * @method render
     * @description render component
     */
    render() {
        const { experience, education, basicInfo, skills, addFiles } = this.props;
        
        // 

        return (
            <Modal
                visible={this.props.visible}
                footer={false}
                onCancel={this.props.onCancel}
                title='Resume'
                className='custom-modal style1 custom-modal padding resume-print-preview'
            >
                <Resume basicInfo={basicInfo} education={education} experience={experience} skills={skills} addFiles={addFiles} />
            </Modal>
        )
    }
}

//  Connect with redux through connect methode
export default ResumeContainer = connect(null, null)(ResumeContainer)

