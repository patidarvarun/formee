import React from 'react';
import { connect } from 'react-redux';
import { classifiedGeneralSearchOptions } from '../../../../actions';
import { AutoComplete } from 'antd';
import { withRouter } from 'react-router'
import { TEMPLATE } from '../../../../config/Config'
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
     * @method handleSearch
     * @descriptionhandle handle search
     */
    handleSearch = value => {
        const { fitnessPlan, searchBy, foodTypes } = this.props;
        let list = searchBy === TEMPLATE.WELLBEING ? fitnessPlan : searchBy === TEMPLATE.RESTAURANT ? foodTypes : searchBy
        
        let matches = list !== undefined && list.filter(v => v.name.toLowerCase().includes(value));
        this.setState({ result: !value ? [] : [...matches] })
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
                        <strong style={{ display: 'block', fontWeight:"normal" }}>{capitalizeFirstLetter(el.name)}</strong>
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
        const { placeholder } = this.props
        const inputProps = {
            value: this.state.address,
            onChange: this.handleSearch,
        }
        return (
            <AutoComplete
                defaultActiveFirstOption={false}
                style={{ minWidth: 200 }}
                className="dark-bdr-right"
                onSearch={this.handleSearch}
                placeholder={placeholder ? placeholder : "Enter Keyword Search"}
                onSelect={(val, option) => {
                    
                    

                }}
                optionLabelProp='title'
            >
                {
                    this.renderOptions()
                }
            </AutoComplete>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, classifieds, bookings } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
        selectedClassifiedList: classifieds.classifiedsList,
        fitnessPlan: Array.isArray(bookings.fitnessPlan) ? bookings.fitnessPlan : [],
        foodTypes: Array.isArray(bookings.foodTypes) ? bookings.foodTypes : [],
    };
}

export default Complete = connect(
    mapStateToProps,
    { classifiedGeneralSearchOptions }
)(withRouter(Complete));

