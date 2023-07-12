import React from 'react';
import { connect } from 'react-redux';
import {getBannerById, enableLoading, disableLoading } from "../../../actions";
import { CarouselSlider } from "../../common/CarouselSlider";
import { langs } from "../../../config/localization";

class TourismBanner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            topImages:[]
        };
    }

     /**
     * @method componentWillReceiveProps
     * @description receive props
     */
    componentWillReceiveProps(nextprops, prevProps) {
        let catIdInitial = this.props.match.params.categoryId;
        let catIdNext = nextprops.match.params.categoryId;
        let subCatIdInitial = this.props.match.params.subCategoryId
        let subCatIdNext = nextprops.match.params.subCategoryId
        if ((catIdInitial !== catIdNext) || (subCatIdInitial !== subCatIdNext)) {
            this.props.enableLoading();
            const id = nextprops.match.params.subCategoryId ? nextprops.match.params.subCategoryId : nextprops.match.params.categoryId
            this.getBannerData(id, catIdNext);
        }
    }

    /**
     * @method componentWillMount
     * @description called before mounting the component
     */
    componentWillMount() {
        let parameter = this.props.match.params
        this.props.enableLoading();
        let id = parameter.subCategoryId ? parameter.subCategoryId : parameter.categoryId
        this.getBannerData(id,parameter.categoryId);
    }

     /**
     * @method getBannerData
     * @description get banner detail
     */
    getBannerData = (categoryId, pid) => {
        let parameter = this.props.match.params
        this.props.getBannerById(3, (res) => {
        this.props.disableLoading();
            if (res.status === 200) {
                const data = res.data.data && Array.isArray(res.data.data.banners) ? res.data.data.banners : "";
                const top = data && data.filter((el) => el.bannerPosition === langs.key.top); 
                let subcategory_page_image = top.length !== 0 && top.filter(el => el.subcategoryId == categoryId && el.categoryId == pid)
                let landing_page_image = top.length !== 0 && top.filter(el => el.categoryId == categoryId && el.subcategoryId === '')
                if(parameter.subCategoryId && parameter.subCategoryId !== undefined){
                    this.setState({ topImages: subcategory_page_image })
                } else {
                    this.setState({ topImages: landing_page_image })
                }
            }
        });
    };


    /**
     * @method render
     * @description render components
     */
    render() {
        const { topImages } = this.state
        return (
            <CarouselSlider bannerItem={topImages} pathName="/" />
        )
    }
}


const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn,
    };
}

export default connect(
    mapStateToProps,{getBannerById,enableLoading, disableLoading}
)(TourismBanner);