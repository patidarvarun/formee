import React,{ Fragment } from "react";
import {    
    Typography,
    Collapse,
    Checkbox,  
    Button,
    Slider,
    Form
} from "antd";
import { capitalizeFirstLetter } from '../../../common'
import "../../../common/bannerCard/bannerCard.less";
import "../tourism.less";
const { Title, Text } = Typography;
const { Panel } = Collapse;

class CarMoreFilter extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            priceFilter: props.maxAmount
        };
    }
    componentWillReceiveProps(nextprops, prevProps) {
        if(prevProps.maxAmount !== nextprops.maxAmount){
            this.setState({
                priceFilter: nextprops.maxAmount
            })
        }
    }
    /**
     * @method onFinish
     * @description get all filters values
     */
    onFinish = (values) => {
    console.log("🚀 ~ file: CarMoreFilter.js ~ line 31 ~ CarMoreFilter ~ values", values)
        let reqData = {
            supplier: values.supplier && values.supplier.length ? values.supplier : '',
            // rating: values.rating && values.rating.length ? values.rating : '',
            specification: values.specification && values.specification.length ? values.specification : '',
            mileage: values.mileage && values.mileage.length ? values.mileage : '',
            price: values.price ? values.price : '',
            transmission: values.transmission && values.transmission.length ? values.transmission : '',
            passangers: values.passangers  && values.passangers.length ? values.passangers : '' 
        }
        console.log("🚀 ~ file: CarMoreFilter.js ~ line 41 ~ CarMoreFilter ~ reqData", reqData)
        this.props.handleFilter(reqData)
    }

    /**
     * @method resetSearch
     * @description Use to reset Search bar
     */
    resetSearch = () => {
        this.setState({
           
        });
        this.formRef.current && this.formRef.current.resetFields();
        this.props.resetCarFilter()
    };

     /**
     * @method render
     * @description render component
     */
    render() {
        const { carSearchRecords, maxAmount } = this.props
        const { priceFilter } = this.state
        let supplier =  carSearchRecords && Array.isArray(carSearchRecords.companies) && carSearchRecords.companies.length ? carSearchRecords.companies : []
        let unique_supplier = [...new Map(supplier.map(item =>[item['companyName'], item])).values()];
        return (
            <Fragment>
                <div className="act-filter-top">
                    <Title level={4}>Filters</Title>
                    <Text onClick={() => this.resetSearch()} className="reset-filter">Reset filter</Text>
                </div>
                <Form 
                    onFinish={this.onFinish}
                    ref={this.formRef}
                >
                <div className="filter-input-box">
                    <Collapse> 
                        <Panel header="Price" key="1" className="range-slider-box">
                            <div className="range-slider-inner-box">
                                <label>{`AUD$ ${priceFilter}`}</label>
                                <Form.Item name={'price'}>
                                <Slider 
                                    //range={{ draggableTrack: true }} 
                                    defaultValue={maxAmount} 
                                    tooltipVisible={false}
                                    min={1}
                                    max={maxAmount}
                                    onChange={(value) => {
                                        this.setState({
                                            priceFilter: value
                                        })
                                    }}
                                />
                                </Form.Item>
                            </div>
                        </Panel>
                        <Panel header="Supplier" key="2">
                            <Form.Item name={'supplier'}>
                                <Checkbox.Group >
                                    {unique_supplier && unique_supplier.map((el) => {
                                        return (
                                            <Checkbox value={el.companyName}>{capitalizeFirstLetter(el.companyName)}</Checkbox>
                                        );
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        {/* <Panel header="Supplier Rating" key="2">
                            <Form.Item name={'rating'}>
                                <Checkbox.Group>
                                    <Checkbox value={5}>Superb: 5</Checkbox>
                                    <Checkbox value={4}>Excellent: 4</Checkbox>
                                    <Checkbox value={3}>Very good: 3</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel> */}
                        <Panel header="Passangers" key="3">
                            <Form.Item name={'passangers'}>
                                <Checkbox.Group>
                                    <Checkbox value={1}>1-4</Checkbox>
                                    <Checkbox value={2}>5-6</Checkbox>
                                    <Checkbox value={3}>7+</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        {/* <Panel header="Supplier Location " key="3">
                            <Form.Item name={'location'}>
                                <Checkbox.Group>
                                    <Checkbox value="in-terminal">In Terminal</Checkbox>
                                    <Checkbox value="shuttle-bus">shuttle-bus</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel> */}
                        <Panel header="Car Specifications" key="4">
                            <Form.Item name={'specification'}>
                                <Checkbox.Group>
                                    <Checkbox value="ac">With Air-conditoning</Checkbox>
                                    <Checkbox value="automatic">Automatic Transmission</Checkbox>
                                    <Checkbox value="manual">Manual Gearbox</Checkbox>
                                    <Checkbox value="4">4+DoorS</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        <Panel header="Transmission " key="5">
                            <Form.Item name={'transmission'}>
                                <Checkbox.Group>
                                    <Checkbox value="Auto drive">Automatic</Checkbox>
                                    <Checkbox value="Manual drive">Manual</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        {/* <Panel header="Deposit at Pickup" key="5">
                            <Checkbox.Group>
                                <Checkbox value="under-aud-450">Under AUD450</Checkbox>
                                <Checkbox value="under-aud-950">Under AUD950</Checkbox>
                                <Checkbox value="under-aud-450">Under AUD1450</Checkbox>
                                <Checkbox value="under-aud-1850">Under Aud 1850</Checkbox>
                            </Checkbox.Group>
                        </Panel>  */}
                        <Panel header="Mileage/Kilometre " key="6">
                            <Form.Item name={'mileage'}>
                                <Checkbox.Group>
                                    <Checkbox value="amountQualifier">Limited</Checkbox>
                                    <Checkbox value="Unlimited mileage">Unlimited</Checkbox>
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
export default CarMoreFilter;