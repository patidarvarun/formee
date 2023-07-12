import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  Modal,
} from 'antd';
import OfferDetails from '../../automative/Details';
import JobDetails from '../../jobs/Detail';
import InspectionDetails from '../../real-state/Details';
import "../../userdetail.less";
// /home/cis/work/Formee/formee-react/src/components/classified-templates/real-state/Details.js
export class ViewListingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        value: 0,
        };
    }

    render() {
        const { visible, type, classified_id, categoryId, onCancel } = this.props;
        return (
            <Modal
                visible={visible}
                style={{ maxWidth: "80%" }}
                className={'custom-modal style1 make-offer-style view-listing-popup'}
                footer={false}
                onCancel={onCancel}
            >
              {type == 'offer' && (
                <OfferDetails 
                  parameters={{
                    classified_id: classified_id,
                    categoryId: categoryId
                  }}
                />
              )}
              {type == 'job' && (
                <JobDetails 
                  parameters={{
                    classified_id: classified_id,
                    categoryId: categoryId
                  }}
                />
              )}
              {type == 'inspection' && (
                <InspectionDetails 
                  parameters={{
                    classified_id: classified_id,
                    categoryId: categoryId
                  }}
                />
              )}
            </Modal>
        )
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth, profile } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    userDetails: profile.userProfile !== null ? profile.userProfile : {},
  };
};

export default connect(mapStateToProps, {})(ViewListingModal);
