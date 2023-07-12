import React from 'react';
import { connect } from 'react-redux';
import { papularSearch } from '../../../actions'
import { langs } from '../../../config/localization'
import { capitalizeFirstLetter } from '../../common'

class BookingPopularSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popularSearches: []
        };
    }

    /**
   * @method componentWillMount
   * @description called before mounting the component
   */
    componentWillMount() {
        let cat_id = this.props.parameter.categoryId
        let sub_cat_id = this.props.parameter.subCategoryId
        // let id = sub_cat_id ? sub_cat_id : cat_id
        let id = cat_id
        this.getPopularSearchData(id)
    }

    /**
    * @method componentWillReceiveProps
    * @description receive props
    */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.parameter.categoryId
        let catIdNext = nextprops.parameter.categoryId
        let subcatIdInitial = this.props.parameter.subCategoryId
        let subcatIdNext = nextprops.parameter.subCategoryId
        if (catIdInitial !== catIdNext || subcatIdInitial !== subcatIdNext) {
            // let id = subcatIdNext ? subcatIdNext : catIdNext
            let id = catIdNext
            this.getPopularSearchData(id)
        }
    }

    /**
   * @method getPopularSearchData
   * @description get all popular search data
   */
    getPopularSearchData = (cat_id) => {
        this.props.papularSearch({ module_type: langs.key.booking, category_id: cat_id }, res => {
            if (res.status === 200) {
                let data = res.data && res.data.data && res.data.data.data;
                let popularSearch = data && Array.isArray(data) && data.length ? data : []
                this.setState({ popularSearches: popularSearch })
            }
            
        })
    }

    /**
    * @method renderPapularSearch
    * @description render papular search list
    */
    renderPapularSearch = (data) => {
        if (data.length) {
            return data.map((el, i) => {
                return (
                    <li key={i}>
                        {capitalizeFirstLetter(el.keyword)}
                    </li>
                )
            })
        }
    }



    /**
     * @method render
     * @description render component
     */
    render() {
        const { popularSearches } = this.state
        let popularSearchesData = popularSearches && popularSearches.length > 10 ? popularSearches.slice(0, 10) : popularSearches
        return (
            <div className={'search-tags mt-0'}>
                <div className={'search-tags-left'}>
                    <span className={'search-tags-first'}>Popular Destination:</span>
                </div>
                <div className={'search-tags-right'}>
                    <ul>
                        {popularSearchesData && this.renderPapularSearch(popularSearchesData)}
                    </ul>
                </div>
            </div>
        );
    }
}

//  Connect with redux through connect methode
const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
};

export default connect(mapStateToProps, { papularSearch })(BookingPopularSearch);
