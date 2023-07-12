import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { connect } from 'react-redux';
import { changeAddress } from '../../actions/index'
import { highlightChars } from "highlight-matches-utils";

class LocationSearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: [], selectedAddress: [], filterText: '' };
    }

    /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let addressInitial = this.props.addressValue
        let addressNext = nextprops.addressValue
        if (addressInitial !== addressNext) {
            this.setState({ address: addressNext })
            // console.log('nextProps.addressValue: ', catIdNext);
        }
    }

    componentDidMount() {
        this.setState({ address: this.props.addressValue })
        // if(["events", "handyman", "trader", "restaurant"].includes(this.props.user_type)){
            this.handleSelect(this.props.addressValue);
        // }
    }

    /** 
     * @method handleChange
     * @description handle Onchange Event of Address 
     */
    handleChange = address => {
        console.log('address',address)
        this.setState({ address,filterText: address });
        if (
            !address 
            // && this.props.clearAddress !== undefined
        ) {
            this.props.clearAddress()
        }
    };

    /** 
   * @method onTabChange
   * @description handle ontabchange 
   */
    handleSelect = address => {
        console.log('address: CHAAANGESDDD', address);
        this.setState({ address, selectedAddress: [...this.state.selectedAddress, address] })
        let results;
        geocodeByAddress(address)
            .then(res => {
                results = res
                return getLatLng(res[0])
            })
            .then(latLng => {
                this.props.handleAddress(results[0], address, latLng)
                this.props.getAddress(address)
            })
            .catch(error => console.error('Error', error));
    };

    /**
     * @method render
     * @description render component
     */
    render() {
        const { filterText } = this.state
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
                        <span className="location-input-image">
                            <input
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
                                        <span>
                                            {/* {string.includes(suggestion.description)} */}
                                            {/* {suggestion.description} */}
                                            {highlightChars(suggestion.description, filterText, s => (
                                                <strong>{s}</strong>
                                            ))}
                                        </span>
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