import React from 'react';
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { getRetailCategoryAutocomplete } from '../../actions';
import { Input, AutoComplete } from 'antd';
import { withRouter } from 'react-router'
import { capitalizeFirstLetter } from '../common'
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
        console.log('e.target.value', item)
        this.props.handleValueChange(item)
    }

    /**
     * @method handleSearch
     * @descriptionhandle handle search
     */
    handleSearch = value => {
        let parameter = this.props.match.params;
        const { cat_id, categoryId } = this.props.match.params;
        let catId = parameter.subCategoryId !== undefined ? parameter.subCategoryId : parameter.categoryId !== undefined ? parameter.categoryId : ''
        if (value) {
            let reqData = {
                name: value,
                cat_id: parameter.subCategoryId === undefined ? catId : parameter.subCategoryId
            }
            this.props.getRetailCategoryAutocomplete(reqData, (res) => {
                
                if(res.status === 200){
                    if (res.data && Array.isArray(res.data.data) && res.data.data.length) {
                        this.setState({ result: !value ? [] : [...res.data.data] })
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
                        <strong style={{ display: 'block' }}>{capitalizeFirstLetter(el.title)}</strong>
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
export default Complete = connect(
    null,
    { getRetailCategoryAutocomplete }
)(withRouter(Complete));

