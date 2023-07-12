import React from "react";
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import ReactToPdf from "react-to-pdf";
import { Col, Row, Typography } from "antd";
import Icon from "../../../../components/customIcons/customIcons";
import { displayDateTimeFormate } from "../../../common";
import { convertHTMLToText } from "../../../common";

const ref = React.createRef();
const { Title, Text, Paragraph } = Typography;

const Resume = (props) => {
  const { basicInfo, experience, education, skills, addFiles } = props;


  /**
   * @method renderUploadedFiles
   * @description Used to render uploaded files
  */
  const renderUploadedFiles = () => {
    const { resumeDetails } = props;
    let uploadedfiles = resumeDetails && resumeDetails.documents && resumeDetails.documents.length !== 0 ? resumeDetails.documents : []
    

    if (uploadedfiles.length) {
      return uploadedfiles.map((el, i) => {
        return (
          <div className='padding resume-preview'>
            <div className='files-item'>
              <span>{el.original_name}</span>
            </div>
          </div>
        );
      });
    }
  };
  /**
   * @method renderFiles
   * @description Used to render selected files
   */
  const renderFiles = () => {
    let today = Date.now();
    
    return (
      addFiles &&
      addFiles.length &&
      addFiles.map((el) => (
        <div className="files-item">
          <span>{el.name}</span>
          {` ( ${Math.round(
            el.size / 1024
          )} KB - Added about ${displayDateTimeFormate(today)} )`}
          {/* (707 KB - Added about 1 day ago) */}
        </div>
      ))
    );
  };

  /**
  * @method blankCheck
  * @description Blanck check of undefined & not null
  */
  const blankCheck = (value, withDash = false) => {
    if (value !== undefined && value !== null && value !== 'Invalid date' && value !== '') {
      
      return withDash ? `- ${value}` : value
    } else {
      return ''
    }
  }

  /**
   * @method renderExperience
   * @description Used to render experience
   */
  const renderExperience = () => {
    return experience.map((el) => {
      

      return (

        <Row>
          <Col span={19}>
            <p className="strong mb-5">{el.job_title !== undefined ? el.job_title : ''}</p>
            <p>
              {el.company ? el.company : ''} <br />
            </p>
            <p>{el.description ? convertHTMLToText(el.description) : ''}</p>
          </Col>
          <Col span={5} className="align-right">
            <Text className="strong">{`${blankCheck(el.start_month)} ${blankCheck(el.start_year)}  - ${el.currently_working ? 'Present' : ''} ${blankCheck(el.complete_month)}  ${blankCheck(el.complete_year)} `}</Text>
          </Col>
        </Row>
      )
    });
  };

  /**
   * @method renderEducation
   * @description Used to render education
   */
  const renderEducation = () => {
    return education.map((el) => (
      <Row>
        <Col span={19}>
          <p className="strong mb-5">{el.institution}</p>
          <p>{el.level_of_qualification}</p>
          <p>{el.course}</p>
        </Col>
        <Col span={5} className="align-right">
          <Text className="strong">{`${blankCheck(el.finished_from_month)} ${blankCheck(el.finished_from_year)} - ${blankCheck(el.finished_to_month)} ${blankCheck(el.finished_to_year)}`}</Text>
        </Col>
      </Row>
    ));
  };

  return (
    <div>
      <div ref={ref} >
        <div >
          <div >
            <div className="padding resume-preview">
              <Title
                level={2}
              >{`${basicInfo.first_name} ${basicInfo.last_name}`}</Title>
              <p className="fs-18">{basicInfo.headline}</p>
              <p>
                Address: {basicInfo.home_location}
                <br />
                Mobile: {basicInfo.phone_number}
                <br />
                Email: {basicInfo.email}
              </p>
              <div className="printResume ">
                <Title level={4} className="sub-heading">
                  {"Work Experience"}
                </Title>
                {renderExperience()}
                <Title level={4} className="sub-heading">
                  {"Education"}
                </Title>
                {renderEducation()}
                <Title level={4} className="sub-heading">
                  {"Skills"}
                </Title>
                <Row>
                  <Col span={19}>{skills && convertHTMLToText(skills)}</Col>
                </Row>
                <Title level={4} className="sub-heading">
                  {"Reference files"}
                </Title>
                <Row>
                  <Col span={18}>{renderUploadedFiles()}</Col>
                  <Col span={18}>{renderFiles()}</Col>
                </Row>

                <Row className="mt-30" align="bottom" justify="end">
                  <Col span={12} className="align-right">
                    <ReactToPdf targetRef={ref} filename="Resume.pdf" className="align-right" >
                      {({ toPdf }) => (
                        // <button onClick={toPdf}>Generate pdf</button>
                        <Link onClick={toPdf} className="download-link">
                          <Icon icon="save" size="20" />{" "}
                          <span>Download Resume</span>
                        </Link>

                      )}
                    </ReactToPdf>
                  </Col>
                  {/* <Col span={12} className="align-right">
                    <Link to="/" className="download-link">
                      <Icon icon="save" size="20" />{" "}
                      <span>Download Resume</span>
                    </Link>
                  </Col> */}
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

// export default Resume;

const mapStateToProps = (store) => {
  const { auth, profile, classifieds } = store;
  return {
    resumeDetails: classifieds.resumeDetails !== null ? classifieds.resumeDetails : ''
  };
};
export default connect(
  mapStateToProps, null
)(Resume);