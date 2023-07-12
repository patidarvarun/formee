import React, { Component } from 'react';
import { Button, Input, Modal } from 'antd';
import { SHARING_URL } from '../../../config/Config'
import {
    FacebookShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    PinterestShareButton,
    VKShareButton,
    OKShareButton,
    RedditShareButton,
    TumblrShareButton,
    LivejournalShareButton,
    MailruShareButton,
    ViberShareButton,
    WorkplaceShareButton,
    EmailShareButton,
    FacebookMessengerShareButton

} from 'react-share';
import {
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    LinkedinIcon,
    PinterestIcon,
    VKIcon,
    OKIcon,
    RedditIcon,
    TumblrIcon,
    LivejournalIcon,
    MailruIcon,
    ViberIcon,
    WorkplaceIcon,
    EmailIcon,
    FacebookMessengerIcon
} from 'react-share';

/* multiple image slider component  */
export class SocialShare extends Component {

    constructor(props) {
        super(props);
        this.state = {
            copySuccess: false
        }
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    };

    handleVisibleChange = visible => {
        this.setState({ visible: true, copySuccess: false });
    };

    copyCodeToClipboard = () => {
        const el = this.textArea
        el.select()
        document.execCommand("copy")
        this.setState({ copySuccess: true })
    }

    /**
     * @method render
     * @description render component
     */
    render() {
        const { showLabel = true } = this.props
        const shareUrl = this.props.location.pathname ? `${SHARING_URL}${this.props.location.pathname}` : '';
        const title = this.props.location.pathname ? `${SHARING_URL}${this.props.location.pathname}` : '';
        return (
            <div className="social-ads">
                {showLabel ? <h3>Share This Ad:</h3> : ''}
                <ul>
                    <li key='0'>
                        <FacebookMessengerShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <FacebookMessengerIcon size={32} round />
                        </FacebookMessengerShareButton>
                        {/* <GooglePlusShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <GooglePlusIcon size={32} round />
                        </GooglePlusShareButton> */}
                        {/* <LinkedinShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                        <TwitterShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton> */}
                    </li>
                    <li key='0'>
                        <WhatsappShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </li>
                    <li key='0'>
                        {/* <TelegramShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <TelegramIcon size={32} round />
                        </TelegramShareButton> */}
                        <PinterestShareButton
                            url={String(shareUrl)}
                            media={`${shareUrl}`}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <PinterestIcon size={32} round />
                        </PinterestShareButton>
                        {/* <VKShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <VKIcon size={32} round />
                        </VKShareButton>
                        <OKShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <OKIcon size={32} round />
                        </OKShareButton> */}
                        {/* <RedditShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <RedditIcon size={32} round />
                        </RedditShareButton> */}
                    </li>
                    <li key='0'>
                        {/* <TumblrShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <TumblrIcon size={32} round />
                        </TumblrShareButton>
                        <LivejournalShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <LivejournalIcon size={32} round />
                        </LivejournalShareButton>
                        <MailruShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <MailruIcon size={32} round />
                        </MailruShareButton>
                        <ViberShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <ViberIcon size={32} round />
                        </ViberShareButton> */}
                        <EmailShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                    </li>
                    <li key='0'>
                        {/*  <Popover
                            content={<div>
                               <Input value={shareUrl}
                                    ref={(textarea) => this.textArea = textarea}
                                    onFocus={(e) => e.target.select()}
                                />
                                <Button type="primary" onClick={() => this.copyCodeToClipboard()}>
                                    Copy Link</Button>
                            </div>}
                            title={this.state.copySuccess ?
                                <div style={{ "color": "green" }}>
                                    Link Copied!
                                </div> : null}
                            trigger="click"
                            placement="right"
                            visible={this.state.visible}
                            onVisibleChange={this.handleVisibleChange}
                        >
                            <p type="primary">Copy Link</p>
                        </Popover> */}
                        {/* <WorkplaceShareButton
                            url={shareUrl}
                            quote={title}
                            className='Demo__some-network__share-button'
                        >
                            <WorkplaceIcon size={32} round />
                        </WorkplaceShareButton> */}
                        <div className="link-img-icon" type="primary" onClick={this.handleVisibleChange}>
                            <img
                                className="camera-icon"
                                src={require("../../../assets/images/icons/link.svg")}
                                alt=""
                                style={{width:"32px", height:"32px"}}
                            />
                        </div>
                    </li>

                </ul>
                <Modal
                    title={
                        this.state.copySuccess ?
                            <div >
                                Link Copied!
                                </div> : null
                    }
                    visible={this.state.visible}
                    className={'custom-modal style1 make-offer-style'}
                    footer={false}
                    onCancel={this.hide}
                >
                    <div className='padding'>
                        <Input value={shareUrl}
                            className='shadow-input'
                            ref={(textarea) => this.textArea = textarea}
                            onFocus={(e) => e.target.select()}
                        />
                        <div className="btn-space mt-15 mb-15 text-center">
                            <Button type='default' disabled={this.state.copySuccess} onClick={() => this.copyCodeToClipboard()}>
                                Copy Link</Button>
                        </div>

                    </div>
                </Modal>
            </div>

        )
    }
}
