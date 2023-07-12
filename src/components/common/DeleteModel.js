import React from "react";
import { connect } from "react-redux";
import { Modal, Button } from "antd";

class DeleteModel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * @method handleDelete
   * @description handle delete
   */
  handleDelete = () => {
    this.props.callDeleteAction()
    this.props.onCancel()
  }

  /**
   * @method render
   * @description render component
   */
  render() {
    const { visible, label } = this.props;
    return (
      <Modal
        visible={visible}
        className={"custom-modal style1 delete-model-style1"}
        footer={false}
        onCancel={this.props.onCancel}
      >
        <div className="delete-modal-body">
          <div className="delete-icon">
            <img
              src={require("../../assets/images/icons/delete-icon-popup.svg")}
              alt="edit"
            />
          </div>
          <h1>{`Are you sure you want to delete this ${label}?`}</h1>
        </div>
        <div className="delete-modal-footer">
          <Button type="default" className="no-cancel-btn" onClick={() => this.props.onCancel()}>
            No, Cancel
          </Button>
          <Button type="default" className="yes-ok-btn" onClick={this.handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    );
  }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(DeleteModel);
