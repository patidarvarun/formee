import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import {restaurantAutocompleteNew, getRestaurantAutocompleteList } from '../../../../actions';
import { Input, AutoComplete } from 'antd';
import { withRouter } from 'react-router'
import { capitalizeFirstLetter } from '../../../common'
const Option = AutoComplete.Option;
class restaurantAutocomplete extends React.Component {
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
        this.props.handleValueChange(item)
    }

    /**
     * @method handleSearch
     * @descriptionhandle handle search
     */
    handleSearch = value => {
        if(value) {    
            // this.props.getRestaurantAutocompleteList(value, res=> {
            this.props.restaurantAutocompleteNew(value, res => {
                if(res.status === 200){
                    let data = res.data && res.data.data && Array.isArray(res.data.data) ? res.data.data : []
                    if(data && data.length) {
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
        const { result } = this.state;
        const inputProps = {
            value: this.state.address,
            onChange: this.handleSearch,
        }
        return (
            <AutoComplete
                defaultActiveFirstOption={false}
                style={{ minWidth: 200 }}
                onSearch={this.handleSearch}
                placeholder="Enter Keyword Search"
                optionLabelProp='title'
                defaultValue={this.props.defaultOption}
                onChange={this.handleInputChange}
            >
                {
                    this.renderOptions()
                }
            </AutoComplete>
        )
    }
}
export default restaurantAutocomplete = connect(
    null,
    {restaurantAutocompleteNew, getRestaurantAutocompleteList }
)(withRouter(restaurantAutocomplete));

