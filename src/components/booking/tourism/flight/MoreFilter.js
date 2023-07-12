import React from "react";
import {
    Layout,
    Typography,
    Select,
    Collapse,
    Checkbox,
    Slider,
    Button,
    Form
} from "antd";
import "../../../common/bannerCard/bannerCard.less";
import "../tourism.less";
import "./flight.less";
import { Fragment } from "react";
const { Option } = Select;
const { Content } = Layout;
const { Title, Text } = Typography;
const { Panel } = Collapse;


class MoreFilter extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            outBoundMin: '00.00',
            returnMin: '00.00',
            outBoundMax: '23.59',
            returnMax: '23.59',
            min_duration:'',
            max_duration: ''
        };
    }

    /**
     * @method onFinish
     * @description get all filters values
     */
    onFinish = (values) => {
        const { outBoundMin, outBoundMax, returnMin, returnMax, min_duration, max_duration } = this.state
        let reqData = {
            stops:values.stops,
            airport: values.airlines,
            out_bound_time: {
                min:outBoundMin !== '00.00' ? outBoundMin : '',
                max:outBoundMax !=='23.59' ? outBoundMax : ''
            },
            // out_bound_time: `${outBoundMin}-${outBoundMax}`,
            return_time: {
                min:returnMin !=='00.00' ? returnMin : '',
                max:returnMax !=='23.59' ? returnMax : ''
            },
            duration:{
                min: min_duration ? min_duration : 0,
                //max:max_duration ? max_duration : 0
            }
        }
        this.props.handleFilter(reqData)
    }

    /**
     * @method calculateMinutes
     * @description get departure time 
     */
    calculateMinutes = (value) => {
        let min = value.length ? value[0] : 0
        let max = value.length ? value[1] : 0
        const duration = Math.floor((360 * min) / 100);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const output = `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}`;
        const duration_output = `${String(minutes).padStart(1, 0)}.${String(seconds).padStart(2, 0)}`;
        const duration2 = Math.floor((360 * max) / 100);
        const minutes2 = Math.floor(duration2 / 60);
        const seconds2 = duration2 % 60;
        const output2 = `${String(minutes2).padStart(2, 0)}:${String(seconds2).padStart(2, 0)}`;
        const duration_output2 = `${String(minutes2).padStart(1, 0)}.${String(seconds2).padStart(2, 0)}`;
        return {
            min:output,
            max:output2,
            min_hours:duration_output,
            max_hours: duration_output2 
        }
    }

    calculateDuration = (value) => {
        const duration = Math.floor((360 * value) / 100);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const duration_output = `${String(minutes).padStart(1, 0)}`;
        return {
            min_hours:duration_output,
        }
    }

     /**
     * @method resetSearch
     * @description Use to reset Search bar
     */
    resetSearch = () => {
        this.setState({
            outBoundMin: '00.00',
            returnMin: '00.00',
            outBoundMax: '23.59',
            returnMax: '23.59',
            min_duration:'',
            max_duration: ''
        });
        this.formRef.current && this.formRef.current.resetFields();
        this.props.resetFlightSearch()
    };

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    render() {
        const { airLineFilter, maxDuration } = this.props
        const { outBoundMin, outBoundMax, returnMin, returnMax, min_duration, max_duration } = this.state
        return (
            <Fragment>
                <Form 
                    onFinish={this.onFinish}
                    ref={this.formRef}
                >
                <div className="act-filter-top">
                    <Title level={4}>Filters</Title>
                    <Text onClick={() => this.resetSearch()} className="reset-filter">Reset filter</Text>
                </div>
                <div className="filter-input-box">
                    <Collapse>
                        <Panel header="Stops" key="1">
                        <Form.Item name={'stops'}>
                            <Checkbox.Group style={{ width: '100%' }}>
                                <Checkbox value={0}>Direct</Checkbox>
                                <Checkbox value={1}>1 Stop</Checkbox>
                                <Checkbox value={2}>2+ Stops</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>
                        </Panel>
                        <Panel header="Departure Times" key="2" className="range-slider-box">
                            <div className="range-slider-inner-box">
                                <h4>Outbond</h4>
                                <label>{`${outBoundMin}-${outBoundMax}`}</label>
                                <Form.Item name={'out_bound_time'}>
                                <Slider 
                                    range={{ draggableTrack: true }} 
                                    defaultValue={[0, 400]} 
                                    tooltipVisible={false}
                                    min={0}
                                    max={400}
                                    onChange={(value) => {
                                        let output = this.calculateMinutes(value)
                                        this.setState({
                                            outBoundMin: output ? output.min : 0,
                                            outBoundMax: output ? output.max : 0
                                        })
                                    }}
                                />
                                </Form.Item>
                            </div>
                            <div className="range-slider-inner-box">
                                <h4>Return</h4>
                                <label>{`${returnMin}-${returnMax}`}</label>
                                <Form.Item name={'return_time'}>
                                <Slider 
                                    range={{ draggableTrack: true }} 
                                    defaultValue={[0, 400]}
                                    tooltipVisible={false} 
                                    min={0}
                                    max={400}
                                    onChange={(value) =>{
                                        let output = this.calculateMinutes(value)
                                        this.setState({
                                            returnMin: output ? output.min : 0,
                                            returnMax: output ? output.max : 0
                                        })
                                    }}
                                />
                                </Form.Item>
                            </div>
                        </Panel>
                        <Panel header="Journey Duration" key="3" className="range-slider-box">
                            <div className="range-slider-inner-box">
                                {/* <label>{`${min_duration ? `${min_duration} hours` : '0h'}  - ${max_duration ? `${max_duration} hours` : '0h'}`}</label> */}
                                <label>{`${min_duration ? `${min_duration} hours` : `${maxDuration} hours`}`}</label>
                                <Form.Item name={'duration'}>
                                <Slider 
                                    //range={{ draggableTrack: true }} 
                                    defaultValue={((maxDuration * 60) * 100) / 360 } 
                                    tooltipVisible={false}
                                    min={1}
                                    max={((maxDuration * 60) * 100) / 360 }
                                    onChange={(value) => {
                                        let output = this.calculateDuration(value)
                                        console.log('output',output)
                                        this.setState({
                                            min_duration: output ? output.min_hours : 0,
                                            // max_duration: output ? output.max_hours : 0
                                        })
                                    }}
                                />
                                </Form.Item>
                            </div>
                        </Panel>
                        <Panel header="Airlines" key="4" className="airlines-collapse-box">
                            <Form.Item name={'airlines'}>
                                <Checkbox.Group style={{ width: '100%' }}>
                                    {airLineFilter && airLineFilter.map((el) => {
                                        return (
                                            <Checkbox value={el.label}>{el.name ? el.name : el.label}</Checkbox>
                                        );
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                    <Button htmlType={'submit'}>Search</Button>
                </div>
                </Form>
            </Fragment>
        )
    }
}
export default MoreFilter;