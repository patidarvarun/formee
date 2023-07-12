import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { Steps, Layout, Typography, Card, Space ,Spin} from 'antd';
import Icon from '../../customIcons/customIcons';
import { getUserProfile, changeUserName, changeMobNo } from '../../../actions/index';
import AppSidebar from '../../../components/dashboard-sidebar/DashboardSidebar';
import StepFirst from './StepFirst';
import StepSecond from './StepSecond';
import history from '../../../common/History';
const spinIcon = <img src={require('./../../../assets/images/loader1.gif')} alt='' style={{ width: '64px', height: '64px' }} />;
const { Title, Text } = Typography;

const { Step } = Steps;


class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.child = React.createRef();
        this.state = {
            submitFromOutside: false,
            current: 0,
        };
    }

    /**
    * @method componentDidMount
    * @description called after render the component
    */
    componentDidMount() {
        if (this.props.userDetails) {
            const { id } = this.props.userDetails
            this.props.getUserProfile({ user_id: id })
        }
    }

    /**
     * @method next
     * @description called to go next step
     */
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { current } = this.state;
        const { userDetails } = this.props;

        const steps = [
            {
                title: 'Step First',
                content: <StepFirst userDetails={userDetails} nextStep={() => this.next()} submitFromOutside={this.state.submitFromOutside} />,
            },
            {
                title: 'Step Second',
                content: <StepSecond next={() => this.setState({ current: this.state.current + 1 })} />,
            },
        ];
        // if (this.props.userDetails) {
            return (
                <Layout>
                    <Layout>
                        <AppSidebar history={history} />
                        <Layout style={{ overflowX: 'visible' }}>
                            <div className='my-profile-box'>
                                <div className='card-container signup-tab'>
                                    <div className='steps-content align-left mt-0'>
                                        <div className='top-head-section'>
                                            <div className='left'>
                                                <Title level={2}>My Profile</Title>
                                            </div>
                                            <div className='right'></div>
                                        </div>
                                        <div className='sub-head-section'>
                                            <Text>All Fields Required</Text>
                                        </div>
                                        <Card
                                            className='profile-content-box'
                                            bordered={false}
                                            title='Profile Set Up'
                                            extra={<Link form={'form1'} onClick={() => this.setState({ submitFromOutside: true })} to='#'><Space align={'center'} size={9}>Clear All <Icon icon='delete2' size='12' /></Space></Link>}
                                        >
                                            {steps[current].content}
                                            {/* <Steps progressDot current={current}>
                                            {steps.map(item => (
                                                <Step key={item.title} />
                                            ))}
                                        </Steps> */}
                                        </Card>
                                    </div>
                                    <div className='steps-action align-center mb-32'>
                                    </div>

                                </div>
                            </div>
                        </Layout>
                    </Layout>
                </Layout>
            )
        // } else {
        //     return <Spin tip='Loading...' indicator={spinIcon} spinning={true} />
        //   }
    }
}

const mapStateToProps = (store) => {
    const { auth, profile } = store;
    return {
        isLoggedIn: auth.isLoggedIn,
        loggedInUser: auth.loggedInUser,
        userDetails: profile.userProfile !== null ? profile.userProfile : null
    };
};
export default connect(
    mapStateToProps,
    { getUserProfile, changeUserName, changeMobNo }
)(EditProfile);