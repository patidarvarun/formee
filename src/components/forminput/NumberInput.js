import React from 'react';
import { InputNumber, Slider, Form, Input, Select, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { required, email, validNumber, validSalary } from '../../config/FormValidation'
const { Option } = Select;
let attr_id = undefined;
let flag = false


class NumberInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitFromOutside: false,
            current: 0,
            subCategory: [],
            isVisible: false,
            inputValue: 0
        };
    }

    componentDidMount() {
        const { data } = this.props;
        let min, max
        if (data.value) {
            let range = data.value && Array.isArray(data.value) && data.value.length ? data.value[0] : ''
            min = range ? range.min : 10
            max = range ? range.max : 10000
        }
        // this.setState({inputValue: Number(min)})
    }

    onChange = value => {
        this.setState({
            inputValue: value,
        });
    };


    /**
     * @method render
     * @description render component
     */
    render() {
        const { data, attr_AllValues, noValidate,isLabelShow } = this.props;
        const { isVisible, subCategory, data2, inputValue } = this.state
        let validation = !noValidate && data.validation === 1 && data.att_name === "Salary Range" ? [{ validator: validSalary }] : [{ validator: validNumber }]
        
        let min = 10, max = 10000
        if (data.value) {
            let range = data.value && Array.isArray(data.value) && data.value.length ? data.value[0] : ''
            min = range ? Number(range.min) : 10
            max = range ? Number(range.max) : 10000
        }
        return (
            <div className="step-form-post-ad">
                {(data.numberrange === 0  || data.range === 0)&&

                    <Form.Item
                        label={isLabelShow && data.att_name}
                        name={data.att_name}
                        rules={!noValidate && data.validation === 1 && [{ validator: validNumber }]}
                    // rules={validation}
                    >
                        {data.att_name === "Price" || data.att_name === 'Salary' ?
                            <InputNumber
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            /> :
                            <Input />}
                        {/* <Input onChange={onChange} /> */}
                    </Form.Item>}

                { (data.numberrange === 1 || data.range === 1) &&
                    <Form.Item label={data.att_name} name={data.att_name}>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name={isLabelShow && data.att_name}
                                    rules={!noValidate && data.validation === 1 && [{ validator: validNumber }]}
                                >
                                    <Slider
                                        min={min}
                                        max={max}
                                        onChange={this.onChange}
                                        value={typeof inputValue === 'number' ? inputValue : 0}
                                    />
                                </Form.Item>
                            </Col>
                            {(data.att_name === "Price" || data.att_name === "Price Range" || data.att_name === 'Salary' || data.att_name === 'Salary Range') &&<Col span={4}>
                                <Form.Item
                                    name={isLabelShow && data.att_name}
                                // rules={!noValidate && data.validation === 1 && [required('')]}
                                >
                                    <InputNumber
                                        min={min}
                                        max={max}
                                        style={{ margin: '0 16px' }}
                                        value={inputValue}
                                        disabled
                                        onChange={this.onChange}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </Col>}
                        </Row>
                    </Form.Item>}
            </div>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
    };
};
export default connect(
    mapStateToProps, null
)(NumberInput);