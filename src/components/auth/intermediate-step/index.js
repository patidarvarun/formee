import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { Steps } from 'antd';
import StepFirst from './Category';
import StepSecond from './SubCategory';
import ThankYouPage from './ThankYouPage';
const { Step } = Steps;

class InterMediateStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
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
        const steps = [
            {
                title: 'Step First',
                content: <StepFirst nextStep={() => this.next()} />,
            },
            {
                title: 'Step Second',
                content: <StepSecond nextStep={() => this.next()} />,
            },
            {
                title: 'Step Third',
                content: <ThankYouPage nextStep={() => this.next()} />,
            },
        ];
     
        return (
            <Fragment>
                <div className='wrap pb-40 signup-box'>
                    <div className='steps-content'>{steps[current].content}</div>
                    <Steps progressDot current={current}>
                        {steps.map(item => (
                            <Step key={item.title} />
                        ))}
                    </Steps>
                </div>
            </Fragment>
        )
    }
}

const mapStateToProps = (store) => {
    const { auth } = store;
    return {
        loggedInDetail: auth.loggedInUser,
        isLoggedIn: auth.isLoggedIn
    };
};

export default connect(
    mapStateToProps,
    null
)(InterMediateStep);