import React,{ Fragment } from "react";
import {    
    Typography,
    Collapse,
    Checkbox,  
    Button,
    Form,
    Slider
} from "antd";
import { capitalizeFirstLetter } from '../../../common'
import "../../../common/bannerCard/bannerCard.less";
import "../tourism.less";
const { Title, Text } = Typography;
const { Panel } = Collapse;

class HotelMoreFilters extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            priceFilter: Math.ceil(props.max),
        };
    }

    /**
     * @method onFinish
     * @description get all filters values
     */
    onFinish = (values) => {
        let filterData = {
            accomodation: values.accomodation,
            amenities: values.amenities, // ["Parking"]
            budget: values.budget, //[3000]
            distance: values.distance, //[7]
            meal: values.meal, //["free"]
            rating: values.rating, //[5]
        }
        this.props.filterData(filterData)
        // let reqData = {
        //     supplier: values.supplier && values.supplier.length ? values.supplier : '',
        //     rating: values.rating && values.rating.length ? values.rating : '',
        //     specification: values.specification && values.specification.length ? values.specification : '',
        //     mileage: values.mileage && values.mileage.length ? values.mileage : ''
        // }
        // this.props.handleFilter(reqData)
    }

    /**
     * @method resetSearch
     * @description Use to reset Search bar
     */
    resetSearch = () => {
        this.setState({
            priceFilter: Math.ceil(this.props.max),
        });
        this.formRef.current && this.formRef.current.resetFields();
        this.props.resetCarFilter()
    };

     /**
     * @method render
     * @description render component
     */
    render() {
        const { carSearchRecords, hotelRecords, min, max } = this.props
        const { priceFilter } = this.state;
        if(hotelRecords && !hotelRecords.filters){
            hotelRecords.filters = {}
        }
        const {hotelAmenities, hotelTypes, maxPriceRange, mealPlans} = hotelRecords.filters
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
                        <Panel header="Your Budget (per night)" key="1">
                            <div className="range-slider-inner-box">
                                <label>{`AUD$ ${priceFilter}`}</label>
                                <Form.Item name={'budget'}>
                                 {/* <Checkbox.Group multiple={false}>
                                    <Checkbox value={1000}>AUD 0 - 1000</Checkbox>
                                    <Checkbox value={3000}>AUD 1000 - 3000</Checkbox>
                                    <Checkbox value={5000}>AUD 3000 - 5000</Checkbox>
                                    <Checkbox value={10000}>AUD 5000 - 10000</Checkbox>
                                    <Checkbox value={"10000+"}>AUD 10000+</Checkbox>
                                </Checkbox.Group> */}
                                <Slider
                                    //range={{ draggableTrack: true }}
                                    defaultValue={priceFilter}
                                    tooltipVisible={false}
                                    min={Math.floor(min)}
                                    max={Math.ceil(max)}
                                    onChange={(value) => {
                                        this.setState({
                                            priceFilter: value
                                        })
                                    }}
                                />
                            </Form.Item>
                            </div>
                        </Panel>
                        <Panel header="Star Rating" key="2">
                            <Form.Item name={'rating'}>
                                <Checkbox.Group>
                                    <Checkbox value={2}>2 Stars</Checkbox>
                                    <Checkbox value={3}>3 Stars</Checkbox>
                                    <Checkbox value={4}>4 Stars</Checkbox>
                                    <Checkbox value={5}>5 Stars</Checkbox>
                                    <Checkbox value={0}>Unrated</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        <Panel header="Distace to Centre" key="3">
                            <Form.Item name={'distance'}>
                                <Checkbox.Group>
                                    <Checkbox value={2}>2 Km</Checkbox>
                                    <Checkbox value={5}>5 Km</Checkbox>
                                    <Checkbox value={7}>7 Km</Checkbox>
                                    <Checkbox value={10}>10 Km</Checkbox>
                                    <Checkbox value={"10+"}>10+ Km</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        {/* <Panel header="Meal Plan" key="4">
                            <Form.Item name={'meal'}>
                                <Checkbox.Group>
                                    {Array.isArray(mealPlans) && mealPlans.length && mealPlans.map((meal) => {
                                      return (<Checkbox value={meal.name}>{meal.name}</Checkbox>) 
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel> */}
                        {/* <Panel header="Amenities" key="5">
                            <Form.Item name={'amenities'}>
                                <Checkbox.Group>
                                    {Array.isArray(hotelAmenities) && hotelAmenities.length && hotelAmenities.map((amenities) => {
                                      return (<Checkbox value={amenities.name}>{amenities.name}</Checkbox>) 
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel> */}
                        <Panel header="Accomodation Type" key="6">
                            <Form.Item name={'accomodation'}>
                                <Checkbox.Group>
                                    {Array.isArray(hotelTypes) && hotelTypes.length && hotelTypes.map((hoteltype) => {
                                      return (<Checkbox value={hoteltype.name}>{hoteltype.name}</Checkbox>) 
                                    })}
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        {/* <Panel header="Reservation Policy " key="6">
                            <Form.Item name={'location'}>
                                <Checkbox.Group>
                                    <Checkbox value="payment">No payment</Checkbox>
                                    <Checkbox value="free">Free Cancellation</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel>
                        <Panel header="Room Facilities" key="7">
                            <Checkbox.Group>
                                <Checkbox value="kitchen">Kitchen/Kitchenette</Checkbox>
                                <Checkbox value="flat">Flat screen tv</Checkbox>
                                <Checkbox value="balcony">Balcony</Checkbox>
                                <Checkbox value="washing machine">Washing machine</Checkbox>
                                <Checkbox value="coffie">Coffie/tea maker</Checkbox>
                                <Checkbox value="ac">Air Conditioning</Checkbox>
                            </Checkbox.Group>
                        </Panel> 
                        <Panel header="Review Score" key="8">
                            <Form.Item name={'mileage'}>
                                <Checkbox.Group>
                                    <Checkbox value="5">Superb: 5</Checkbox>
                                    <Checkbox value="4">Very Good : 4</Checkbox>
                                </Checkbox.Group>
                            </Form.Item>
                        </Panel> */}
                    </Collapse>
                    <Button htmlType={'submit'}>Search</Button>
                </div>
                </Form>
            </Fragment>
        )
    }
}
export default HotelMoreFilters;