
import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import { Form, Input, Select, Button, Row, Col, Space, AutoComplete } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Icon from "../customIcons/customIcons";
import { barcodeSearch } from '../../actions/food-scanner/FoodScanner';
import {
    classifiedGeneralSearch,
    addCallForPopularSearch,
    enableLoading,
    disableLoading,
} from "../../actions/index";
import { getIpfromLocalStorage } from "../../common/Methods";
import { capitalizeFirstLetter } from '../common'

const Option = AutoComplete.Option;
let ipAddress = getIpfromLocalStorage();

class BarcodeSearch extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: {},
            result: []
        };
    }

    /**
     * @method resetSearch
     * @description Use to reset Search bar
     */
    resetSearch = () => {
        this.formRef.current.resetFields();
    };

    /**
     * @method handleAutocomplete
     * @description Call Action for Classified Search
     */
    handleAutocomplete = (value) => {
        this.setState({ seachKeyword: value })
        if (value) {
            this.props.barcodeSearch(value, res => {
                if (res.results && res.results.length) {
                    this.setState({ result: res.results })
                } else {
                    this.setState({ result: [] })
                }
            })
        } else {
            this.setState({ result: [] })
        }
    };

    handleSearch = () => {
        const { selectedOption, result, seachKeyword } = this.state;
        let isEmpty = Object.keys(selectedOption).length === 0;

        if (!result.length) {
            this.props.history.push(`/add-product/${seachKeyword}`)
        } else if (isEmpty) {
            toastr.warning(langs.warning, langs.messages.mandate_filter);
        } else {
            this.props.history.push(`/food-product-detail/${selectedOption.id}`)
        }
    }

    /**
    * @method renderOptions
    * @descriptionhandle render options
    */
    renderOptions = () => {
        return this.state.result.map((el, i) => {
            return (
                <Option key={i} value={el.name} >
                    <div onClick={() => {  }}>
                        <strong style={{ display: 'block' }}>{capitalizeFirstLetter(el.name)}</strong>
                    </div>
                </Option>
            )
        })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        return (
            <div className="location-search-wrap real-state">
                <Form
                    ref={this.formRef}
                    name="location-form"
                    className="location-search"
                    layout={"inline"}
                >
                    <Form.Item style={{ width: "calc(100% - 150px)" }}>
                        <Input.Group compact>
                            <Form.Item noStyle name="name">
                                <AutoComplete
                                    defaultActiveFirstOption={false}
                                    // style={{ minWidth: 200 }}
                                    onSearch={this.handleAutocomplete}
                                    placeholder="Enter the Barcode No."
                                    optionLabelProp='title'
                                // defaultValue={this.props.defaultOption}
                                >
                                    {this.renderOptions()}
                                </AutoComplete>
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button
                                onClick={this.handleSearch}
                                type="primary"
                                shape={"circle"}
                            >
                                <Icon icon="search" size="20" />
                            </Button>
                            {/* <Button
                                onClick={this.resetSearch}
                                type="danger"
                                shape={"circle"}
                                title={"Reset Search"}
                            >
                                <SyncOutlined className="fs-22" />
                            </Button> */}
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
    };
};

export default BarcodeSearch = connect(mapStateToProps, {
    barcodeSearch,
    addCallForPopularSearch,
    enableLoading,
    disableLoading,
})(withRouter(BarcodeSearch));
