import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import {bookingAutocompleteNew, getBookingSearchAutocomplete,getSportsSearchAutocomplete} from '../../../../actions';
import { Input, AutoComplete } from 'antd';
import { withRouter } from 'react-router'
import { capitalizeFirstLetter } from '../../../common'
const Option = AutoComplete.Option;
class Complete extends React.Component {
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
            let parameter = this.props.match.params
            const { searchLatLng } = this.state
            const { allBookingId } = this.props
            let categoryId = parameter.categoryId;
            let categoryName = value ? value : parameter.categoryName
            let cat_id = allBookingId ? allBookingId : parameter.subCategoryId !== undefined ? parameter.subCategoryId : parameter.categoryId !== undefined ? parameter.categoryId : ''
            const requestData = {
                name: categoryName,
                cat_id: cat_id,
                // lat: searchLatLng ? searchLatLng.lat: '27.249439',
                // lng: searchLatLng ? searchLatLng.lng : '152.997995'
            }
            this.props.getBookingSearchAutocomplete(requestData, res=> {
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
     * @method handleSportsSearch
     * @descriptionhandle handle sports search
     */
    handleSportsSearch = value => {
        if(value) {
            let parameter = this.props.match.params
            const { searchLatLng } = this.state
            let categoryId = parameter.categoryId;
            let categoryName = value ? value : parameter.categoryName
            const requestData = {
                name: categoryName,
                cat_id: parameter.subCategoryId !== undefined ? parameter.subCategoryId : parameter.categoryId !== undefined ? parameter.categoryId : '',
                lat: searchLatLng ? searchLatLng.lat: '27.249439',
                lng: searchLatLng ? searchLatLng.lng : '152.997995'
            }
            this.props.getSportsSearchAutocomplete(res=> {
                
                if(res.status === 200){
                    let data = res.data && res.data.all && res.data.all.data.item && Array.isArray(res.data.all.data.item) ? res.data.all.data.item : []
                    
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
     * @method handleSearch
     * @descriptionhandle handle search
     */
    handlebookingSearch = value => {
        if(value) {
            const requestData = {
                name: value,
            }
            this.props.bookingAutocompleteNew(requestData, res=> {
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
                <Option key={i} value={el.title}>
                    <div onClick={() => this.onSelect(el)}>
                        <strong style={{ display: 'block', fontWeight:"normal"  }}>{capitalizeFirstLetter(el.title)}</strong>
                    </div>
                </Option>
            )
        })
    }

     /**
     * @method renderOptions
     * @descriptionhandle render options
     */
    renderSportsOption = () => {
        return this.state.result.map((el, i) => {
            return (
                <Option key={i} value={el.caption}>
                    <div onClick={() => this.onSelect(el)}>
                        <strong style={{ display: 'block' }}>{capitalizeFirstLetter(el.caption)}</strong>
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
        const { placeHolder } = this.props
        const inputProps = {
            value: this.state.address,
            onChange: this.handleSearch,
        }
        
        const { isSports,isLandingpage } = this.props

        return (
            <AutoComplete
                defaultActiveFirstOption={false}
                style={{ minWidth: 200 }}
                className="dark-bdr-right"
                onSearch={isLandingpage ? this.handlebookingSearch : isSports ? this.handleSportsSearch : this.handleSearch}
                placeholder={placeHolder ? placeHolder : "Enter Keyword Search"}
                optionLabelProp='title'
                defaultValue={this.props.defaultOption}
                onChange={this.handleInputChange}
            >
                {
                   isSports ? this.renderSportsOption() : this.renderOptions()
                }
            </AutoComplete>
        )
    }
}
export default Complete = connect(
    null,
    {bookingAutocompleteNew, getBookingSearchAutocomplete,getSportsSearchAutocomplete }
)(withRouter(Complete));

