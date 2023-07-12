import React from 'react';
import { connect } from 'react-redux';
import { getFlightAutocompleteList } from '../../../../actions';
import { AutoComplete } from 'antd';
import { withRouter } from 'react-router'
import { capitalizeFirstLetter } from '../../../common'
const Option = AutoComplete.Option;

class FlightAutoComplete extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            value: '',
            result: []
        }
    }

    /**
     * @method onSelect
     * @descriptionhandle handle selection
     */
    onSelect = (item) => {
        this.props.handleSearchSelect(item)
    };

    /**
     * @method handleInputChange
     * @descriptionhandle handle input change
     */
    handleInputChange = (item) => {
        console.log('item', item)
        this.props.handleValueChange(item)
    }

    /**
     * @method handleSearch
     * @descriptionhandle handle search
     */
    handleSearch = value => {
        if (value) {
            this.props.getFlightAutocompleteList(value, res => {
                if (res.status === 200) {
                    console.log('res', res.data)
                    let data = res.data && res.data.data && res.data.data.body && Array.isArray(res.data.data.body) ? res.data.data.body : []
                    if (data && data.length) {
                        this.setState({ result: !value ? [] : [...data] })
                    } else {
                        this.setState({ result: [] })
                    }
                }
            })
        } else {
            this.props.handleSearchSelect({})
        }

    };

    /**
     * @method renderOptions
     * @descriptionhandle render options
     */
    renderOptions = () => {
        const { type } = this.props
        if(type === 'hotel'){
           let filterRecord =  [...new Map(this.state.result.map(item =>[item['city_name'], item])).values()];
            return filterRecord.map((el, i) => {
                console.log('el:>> ', el);
                let cityName = el.city_name ? el.city_name : ''
                let countryName = el.country_name ? el.country_name : ''
                let location = `${cityName}, ${countryName}`
                return (
                   <Option key={i} value={location}>
                        <div onClick={() => this.onSelect(el)}>
                            <strong style={{ display: 'block', fontWeight: "normal" }}>{location}</strong>
                        </div>
                    </Option>
                )
            })
        }else {
            return this.state.result.map((el, i) => {
                console.log('el:>> ', el);
                let cityName = el.city_name ? el.city_name : ''
                let name = el.name ? el.name : ''
                let countryName = el.country_name ? el.country_name : ''
                let countryCode = el.country_code ? el.country_code : ''
                let airport = `${capitalizeFirstLetter(cityName)}, ${capitalizeFirstLetter(name)}, ${countryCode}`
                return (
                    <Option key={i} value={airport}>
                        <div onClick={() => this.onSelect(el)}>
                            <strong style={{ display: 'block', fontWeight: "normal" }}>{airport}</strong>
                            <p>{countryName}</p>
                        </div>
                    </Option>
                )
            })
        }
        
    }

    /**
    * @method renderOptions
    * @descriptionhandle render options
    */
    renderSportsOption = () => {
        return this.state.result.map((el, i) => {
            return (
                <Option key={i} value={el.name}>
                    <div onClick={() => this.onSelect(el)}>
                        <strong style={{ display: 'block' }}>{capitalizeFirstLetter(el.name)}</strong>
                    </div>
                </Option>
            )
        })
    }

    /**
     * @method render
     * @descriptionhandle render component
     */
    render() {
        const { placeHolder, listPage } = this.props
        //   console.log('defaultOption',this.props.defaultValue)
        return (
            <>
          <AutoComplete
                allowClear
                defaultActiveFirstOption={false}
                style={{ minWidth: 200 }}
                className="dark-bdr-right"
                onSearch={this.handleSearch}
                placeholder={placeHolder ? placeHolder : "Enter Keyword Search"}
                optionLabelProp='title'
                defaultValue={this.props.defaultValue}
                //value={this.props.defaultValue}
                onChange={this.handleInputChange}
            >
                {
                    this.renderOptions()
                }
            </AutoComplete>
            </>
        )
    }
}

export default FlightAutoComplete = connect(
    null,
    { getFlightAutocompleteList }
)(withRouter(FlightAutoComplete));

