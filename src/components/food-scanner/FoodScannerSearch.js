import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { langs } from "../../config/localization";
import {
    Form,
    Input,
    Select,
    Button,
    Row,
    Col,
    Space,
    AutoComplete,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Icon from "../customIcons/customIcons";
import {
    getProductAutocompleteList,
    barcodeSearch,
} from "../../actions/food-scanner/FoodScanner";
import {
    addCallForPopularSearch,
    searchInFoodScanner,
    enableLoading,
    disableLoading,
} from "../../actions/index";
import { getIpfromLocalStorage } from "../../common/Methods";
import { capitalizeFirstLetter } from "../common";
import { reactLocalStorage } from "reactjs-localstorage";

const Option = AutoComplete.Option;
let ipAddress = getIpfromLocalStorage();

class FoodScannerSearch extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: {},
            result: [],
            searchKeyword: '',
            searchKeywordBarcode: '',
            result1: [],
            showAddOption: false,
            barCode: ''
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
        this.setState({ searchKeyword: value });
        if (value) {
            this.props.getProductAutocompleteList(value, (res) => {
                if (res.results && res.results.length) {
                    this.setState({ result: res.results });
                } else {
                    this.setState({ result: [] });
                }
            });
        } else {
            this.setState({ result: [] });
        }
    };

    /**
     * @method handleBarcodeAutocomplete
     * @description Call Action for Classified Search
     */
    handleBarcodeAutocomplete = (value) => {
        this.setState({ serachKeywordBarcode: value });
        if (value) {
            this.props.barcodeSearch(value, (res) => {
                if (res.results && res.results.length) {
                    this.setState({ result1: res.results });
                } else {
                    this.setState({ result1: [] });
                }
            });
        } else {
            this.setState({ result1: [] });
        }
    };

    handleSearch = () => {
        const { loggedInDetail, isLoggedIn } = this.props;
        const { selectedOption,  barCode } = this.state;
        // let isEmpty = Object.keys(selectedOption).length === 0;
        if (!selectedOption && !barCode) {
            toastr.warning(langs.warning, langs.messages.mandate_filter);
        } else {
            let reqData = {
                product_name: selectedOption,
                bar_code: barCode,
                user_id: isLoggedIn ? loggedInDetail.id : ''
            };
            this.props.enableLoading()
            this.props.searchInFoodScanner(reqData, (res) => {
                this.props.disableLoading()
                console.log(res.data, "res: ", res.status);
                if (res.status === 1) {
                    this.setState({ searchResults: res.data.data });
                    this.props.setSearchResults(res.data.data);
                } else {
                    this.props.setSearchResults([]);
                    this.setState({ showAddOption: true });
                    toastr.warning(langs.warning, langs.messages.no_item_found);
                }
            });
            //     this.props.history.push(`/food-product-detail/${selectedOption.id}`)
        }
    };

    /**
     * @method renderOptions
     * @descriptionhandle render options
     */
    renderOptions = () => {
        return this.state.result.map((el, i) => {
            return (
                <Option key={i} value={el.name}>
                    <div
                        // onClick={() => {
                        //     console.log("el: ", el);
                        //     this.setState({ selectedOption: el });
                        //     reactLocalStorage.setObject("productDetails", el);
                        // }}
                    >
                        <strong style={{ display: "block" }}>
                            {capitalizeFirstLetter(el.name)}
                        </strong>
                    </div>
                </Option>
            );
        });
    };



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
                    <Form.Item
                        style={{
                            width: "calc(100% - 100px)",
                            maxWidth: "725px",
                            marginLeft: 0,
                        }}
                        className="keyword-search"
                    >
                        <Form.Item className="custom-width ml-0 left-input">
                            <Input.Group compact>
                                <Form.Item noStyle name="name">
                                    <AutoComplete
                                        defaultActiveFirstOption={false}
                                        onSearch={this.handleAutocomplete}
                                        placeholder="Product Name"
                                        optionLabelProp="title"
                                        onChange={(e)=>{
                                            console.log('e: XXXX ', e);
                                            this.setState({ selectedOption: e });
                                        }}
                                    // defaultValue={this.props.defaultOption}
                                    >
                                        {this.renderOptions()}
                                    </AutoComplete>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                        <Form.Item className="custom-width ml-0 right-input" >
                            <Input.Group compact>
                                <Form.Item noStyle name="barcode">
                                    {/* <AutoComplete
                                    defaultActiveFirstOption={false}
                                    style={{ minWidth: 200 }}
                                    onSearch={this.handleBarcodeAutocomplete}
                                    placeholder="Barcode Number"
                                    optionLabelProp='title'
                                // defaultValue={this.props.defaultOption}
                                >
                                    {this.renderBarcodeOptions()}
                                </AutoComplete> */}
                                    <Input onChange={(e) => {
                                        this.setState({ barCode: e.target.value })
                                    }} type='number' placeholder="Barcode Number" />
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
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

export default FoodScannerSearch = connect(mapStateToProps, {
    getProductAutocompleteList,
    addCallForPopularSearch,
    barcodeSearch,
    searchInFoodScanner,
    enableLoading,
    disableLoading,
})(withRouter(FoodScannerSearch));
