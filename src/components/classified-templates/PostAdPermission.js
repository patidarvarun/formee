import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { Button } from 'antd';
import { MESSAGES } from '../../config/Message';
import { langs } from '../../config/localization';
import {
  checkPermissionForPostAd,
  openLoginModel,
  enableLoading,
  disableLoading,
} from '../../actions/index';

class PostAdPermission extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: false,
    };
  }

  /**
   * @method handlePostAnAd
   * @description handle and check post ad ad permission
   */
  handlePostAnAd = () => {
    const { isLoggedIn, loggedInDetail } = this.props;
    let pathName = this.props.location.pathname;
    if (!isLoggedIn) {
      this.props.openLoginModel(true);
    } else {
      this.props.enableLoading();
      this.props.checkPermissionForPostAd(
        { user_id: loggedInDetail.id },
        (res) => {
          this.props.disableLoading();
          if (res.status === 200) {
            let data = res.data;
            if (data.seller_type === langs.key.private) {
              let limit =
                data.total_number_of_ads_allowed ==
                data.total_number_of_ads_posted_this_month;
              if (limit) {
                this.setState({ permission: false });
                toastr.warning(langs.warning, MESSAGES.POST_LIMIT);
              } else {
                this.props.history.push({
                  pathname: '/post-an-ad',
                  state: { pathname: pathName },
                });
              }
            } else if (
              data.seller_type === langs.key.business ||
              data.seller_type === langs.key.merchant
            ) {
              console.log('case1',data.seller_type)
              let isjobPost =
                data.package && Array.isArray(data.package) && data.package.length
                  ? data.package[0].is_job_post
                  : '';
              console.log('isjobPost', isjobPost);
              if (isjobPost) {
                let limit =
                  data.total_number_of_ads_posted ===
                  data.total_number_of_ads_allowed;
                console.log('limit', limit);
                if (limit) {
                  console.log('case1');
                  this.setState({ permission: false });
                  toastr.warning(langs.warning, MESSAGES.POST_LIMIT);
                } else if (
                  data.seller_type === langs.key.merchant &&
                  data.is_stripe_accepted === 0 &&
                  data.is_paypal_accepted === 0
                ) {
                  console.log('case2');
                  this.props.history.push({
                    pathname: '/payment',
                    state: { pathname: pathName },
                  });
                } else {
                  console.log('case3');
                  this.props.history.push({
                    pathname: '/post-an-ad',
                    state: { pathname: pathName },
                  });
                }
              } else {
                toastr.warning(langs.warning, MESSAGES.PERMISSION_ERROR);
              }
            }
          }
        }
      );
    }
  };

  /**
   * @method render
   * @description render component
   */
  render() {
    const { title } = this.props;
    return (
      <div className='action'>
        <Button
          type='primary'
          className='btn-blue post-ad-btn'
          size={'large'}
          onClick={() => this.handlePostAnAd()}
        >
          {title !== undefined ? title : 'Post an Ad'}
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { auth } = store;
  return {
    loggedInDetail: auth.loggedInUser,
    isLoggedIn: auth.isLoggedIn,
  };
};

export default connect(mapStateToProps, {
  checkPermissionForPostAd,
  openLoginModel,
  enableLoading,
  disableLoading,
})(withRouter(PostAdPermission));
