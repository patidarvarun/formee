import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Typography, Row, Col, Button, Table } from "antd";
import { convertMinToHours } from "../../../../common";

const { Title } = Typography;

class Step2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      retailSelected: false,
      classifiedSelected: false,
      category: "",
      subCategory: [],
    };
  }

  /**
   * @method onClickNext
   * @description onClickNext
   */
  onClickNext = () => {
    const { selectedSpaService } = this.props;
    let reqData = {
      serviceName: selectedSpaService.name,
      duration: selectedSpaService.duration,
      price: selectedSpaService.price,
      amount: selectedSpaService.price,
    };
    this.props.nextStep(reqData, 2);
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { selectedSpaService, mergedStepsData } = this.props;

    const { step1Data } = mergedStepsData;
    const fixedColumns = [
      {
        title: "Service",
        key: "name",
        dataIndex: "name",
      },
      {
        title: "",
        key: "duration",
        dataIndex: "duration",
      },
      {
        title: "Price",
        key: "price",
        dataIndex: "price",
        render: (price, record) => <span>${price.toFixed(2)}</span>,
      },
      {
        title: "Amount",
        key: "amount",
        dataIndex: "amount",
        render: (amount, record) => <span>${amount.toFixed(2)}</span>,
      },
    ];
    const { discountAmount, appliedPromoCode } = step1Data;
    const dataSource = [
      {
        key: "1",
        name: selectedSpaService.name,
        duration: convertMinToHours(selectedSpaService.duration),
        price: selectedSpaService.price,
        amount: selectedSpaService.price,
      },
    ];
    return (
      <Fragment className="">
        <div className="wrap fm-step-form bokng-user-wlbeing-spa-step-two">
          {/* <Title> Please select quantity</Title> */}
          <Row>
            <Col span={24}>
              <Table
                pagination={false}
                className="price-table"
                dataSource={dataSource}
                columns={fixedColumns}
                summary={(pageData) => {
                  let totalPrice = 0;
                  pageData.forEach(({ price }) => {
                    totalPrice += price;
                  });
                  let total =
                    parseFloat(totalPrice) - parseFloat(discountAmount);
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell>Subtotal</Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell>
                          ${totalPrice.toFixed(2)}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      {appliedPromoCode && appliedPromoCode != null && (
                        <Table.Summary.Row>
                          <Table.Summary.Cell>
                            Code Promo {appliedPromoCode}
                          </Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell></Table.Summary.Cell>
                          <Table.Summary.Cell>
                            - ${discountAmount.toFixed(2)}
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      )}
                      <Table.Summary.Row>
                        <Table.Summary.Cell>Total</Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell></Table.Summary.Cell>
                        <Table.Summary.Cell>
                          ${total.toFixed(2)}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Col>
          </Row>

          <div className="steps-action ">
            <Button
              htmlType="submit"
              type="primary"
              size="middle"
              className="btn-blue fm-btn"
              onClick={() => this.onClickNext()}
            >
              NEXT
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    isLoggedIn: auth.isLoggedIn,
    loggedInDetail: auth.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(Step2);
