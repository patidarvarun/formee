import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { Icon } from 'antd'
import { connect } from 'react-redux';
import { changeAddress } from '../../actions/index'

class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: '', selectedAddress: [] };
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextProps) {
        this.setState({ address: nextProps.addressValue })
    }

    /** 
     * @method handleChange
     * @description handle Onchange Event of Address 
     */
    handleChange = address => {
        this.setState({ address });
        if (!address && this.props.clearAddress !== undefined) {
            this.props.clearAddress()
        }
    };

    /** 
   * @method onTabChange
   * @description handle ontabchange 
   */
    handleSelect = address => {
        let results;
        geocodeByAddress(address)
            .then(res => {
                results = res
                return getLatLng(res[0])
            })
            .then(latLng => {
                this.setState({ address: '', selectedAddress: [...this.state.selectedAddress, address] })
                // this.props.handleAddress(results[0], address, latLng)
                this.props.handleAddress(this.state.selectedAddress)                
                this.props.getAddress(address)

            })
            .catch(error => console.error('Error', error));
    };

    /**
     * @method render
     * @description render component
     */
    render() {
        const { address, selectedAddress } = this.state;
        const inputProps = {
            // value: this.state.address,
            onChange: this.handleChange,
        }
        const { myPlaceholder = 'Location' } = this.props
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                searchOptions={{ type: ['(street_address)'] }}
                highlightFirstSuggestion={true}
                inputProps={inputProps}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className='location-search-box'>
                        {/* {console.log('suggestions: ', suggestions)} */}
                        <span>{this.state.selectedAddress.map((el) => {
                            return <div>
                                {el}
                                <Icon icon={'close'} size='50' />

                            </div>
                        })}</span>
                        <span className="location-input-image">  <input
                            {...getInputProps({
                                placeholder: myPlaceholder,
                                className: 'location-search-input',
                            })}
                        />
                        </span>
                        <div className='autocomplete-dropdown-container'>
                          
                            {suggestions.map(suggestion => {
                                console.log('suggestion: ', suggestion);
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}


const mapStateToProps = (store) => {
    const { auth, profile } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : {}
    };
};
export default connect(
    mapStateToProps,
    { changeAddress }
)(LocationSearchInput);