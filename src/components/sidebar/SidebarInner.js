import React from 'react';
import { Link } from 'react-router-dom'
import { Layout, Typography } from 'antd';
import { connect } from 'react-redux';
import { logout } from '../../actions/index';
import { toastr } from 'react-redux-toastr';
import { langs } from '../../config/localization';
import Icon from '../customIcons/customIcons';
import Back from '../common/Back'
import './sidebar.less';
const { Sider } = Layout;
const { Text } = Typography;

class SidebarInner extends React.Component {

    /**
    * @method Logout User
    * @description Logout the user & clear the Session 
    */
    logout = () => {
        this.props.logout()
        toastr.success(langs.success, langs.messages.logout_success)
        window.location.assign('/');
    };

    render() {
        const { isLoggedIn } = this.props;
        return (
            <Sider width={200} className='site-layout-background'>
                <Link to='/' title='Home' className='home-link'>
                    <Icon icon='home' size='20' />
                </Link>
                <Back {...this.props} />
                <div className='sidebar-space'>&nbsp;</div>
                <div className='mt-25'>
                    <Link to='/'>
                        <Text className='fs-12' style={{ lineHeight: '13px', display: 'inline-block' }}>Save <br />Search</Text>
                    </Link>
                </div>
                {isLoggedIn && <div className='mt-50 mb-5'>
                    <Link to='/' onClick={() => this.logout()} className='logout-link'>
                        <Text>Logout</Text>
                    </Link>
                </div>}
                <div className='mt-50 mb-5'>
                    <Link to='/' className='border-link'>
                        <Text>About</Text>
                    </Link>
                </div>
                {/* <Link to='/'>
                    <Text className='fs-11'>Need help?</Text>
                </Link> */}
            </Sider>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store
    return {
        isLoggedIn: auth.isLoggedIn,
        userProfile: profile.userProfile
    };
};
export default connect(
    mapStateToProps,
    { logout }
)(SidebarInner);
