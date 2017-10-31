import React, { Component } from 'react';
// import { FacebookLoginButton } from 'react-social-login-buttons';
import { PropTypes } from 'prop-types';

const objectToParams = (paramsObj) => {

  let str = '';
  for (const key in paramsObj) {
    if (str !== '') {
      str += '&';
    }
    str += `${key}=${encodeURIComponent(paramsObj[key])}`;
  }
  return str;
};

const getIsMobile = () => {
  let isMobile = false;

  try {
    isMobile = !!((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile;
};

// https://www.w3.org/TR/html5/disabled-elements.html#disabled-elements
const _shouldAddDisabledProp = (tag) => [
  'button',
  'input',
  'select',
  'textarea',
  'optgroup',
  'option',
  'fieldset',
].indexOf((tag + '').toLowerCase()) >= 0;

class FacebookButton extends Component {

    static propTypes = {
        isDisabled: PropTypes.bool,
        callback: PropTypes.func.isRequired,
        appId: PropTypes.string.isRequired,
        xfbml: PropTypes.bool,
        cookie: PropTypes.bool,
        reAuthenticate: PropTypes.bool,
        scope: PropTypes.string,
        redirectUri: PropTypes.string,
        textButton: PropTypes.string,
        typeButton: PropTypes.string,
        autoLoad: PropTypes.bool,
        disableMobileRedirect: PropTypes.bool,
        isMobile: PropTypes.bool,
        size: PropTypes.string,
        fields: PropTypes.string,
        cssClass: PropTypes.string,
        version: PropTypes.string,
        icon: PropTypes.any,
        language: PropTypes.string,
        onClick: PropTypes.func,
        containerStyle: PropTypes.object,
        buttonStyle: PropTypes.object,
        tag: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
        onFailure: PropTypes.func,
    };

    static defaultProps = {
        textButton: 'Login with Facebook',
        typeButton: 'button',
        redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
        scope: 'public_profile,email',
        xfbml: false,
        cookie: false,
        reAuthenticate: false,
        size: 'metro',
        fields: 'name',
        cssClass: 'kep-login-facebook',
        version: '2.3',
        language: 'en_US',
        disableMobileRedirect: false,
        isMobile: getIsMobile(),
        tag: 'button',
        onFailure: null,
    };

    state = {
        isSdkLoaded: false,
        isProcessing: false,
    };

    componentDidMount() {

        this._isMounted = true;
        if (document.getElementById('facebook-jssdk')) {
            this.sdkLoaded();
            return;
        }
        this.setFbAsyncInit();
        this.loadSdkAsynchronously();
        let fbRoot = document.getElementById('fb-root');
        if (!fbRoot) {
            fbRoot = document.createElement('div');
            fbRoot.id = 'fb-root';
            document.body.appendChild(fbRoot);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setStateIfMounted(state) {
        if (this._isMounted) {
            this.setState(state);
        }
    }

    setFbAsyncInit() {
        const { appId, xfbml, cookie, version, autoLoad } = this.props;
        window.fbAsyncInit = () => {
            window.FB.init({
                version: `v${version}`,
                appId,
                xfbml,
                cookie,
            });
            this.setStateIfMounted({ isSdkLoaded: true });
            if (autoLoad || window.location.search.includes('facebookdirect')) {
                window.FB.getLoginStatus(this.checkLoginAfterRefresh);
            }
        };
    }

    sdkLoaded() {
        this.setState({ isSdkLoaded: true });
    }

    loadSdkAsynchronously() {
        const { language } = this.props;
        ((d, s, id) => {
            const element = d.getElementsByTagName(s)[0];
            const fjs = element;
            let js = element;
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = `https://connect.facebook.net/${language}/sdk.js`;
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }

    responseApi = (authResponse) => {
        window.FB.api('/me', { locale: this.props.language, fields: this.props.fields }, (me) => {
            Object.assign(me, authResponse);
            this.props.callback(me);
        });
    };

    checkLoginState = (response) => {
        this.setStateIfMounted({ isProcessing: false });
        if (response.authResponse) {
            this.responseApi(response.authResponse);
        } else {
            if (this.props.onFailure) {
                this.props.onFailure({ status: response.status });
            } else {
                this.props.callback({ status: response.status });
            }
        }
    };

    checkLoginAfterRefresh = (response) => {
        if (response.status === 'connected') {
            this.checkLoginState(response);
        } else {
            window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
        }
    };

    click = (e) => {

        if (!this.state.isSdkLoaded || this.state.isProcessing || this.props.isDisabled) {
            return;
        }

        this.setState({ isProcessing: true });
        const { scope, appId, onClick, reAuthenticate, redirectUri, disableMobileRedirect } = this.props;

        console.log(e);
        if (typeof onClick === 'function') {
            onClick(e);
        }

        const params = {
            client_id: appId,
            redirect_uri: redirectUri,
            state: 'secret98053',
            scope,
        };

        if (reAuthenticate) {
            params.auth_type = 'reauthenticate';
        }

        console.log(params)
        if (this.props.isMobile && !disableMobileRedirect) {
            window.location.href = `//www.facebook.com/dialog/oauth?${objectToParams(params)}`;
        } else {
            window.FB.login(this.checkLoginState, { scope, auth_type: params.auth_type });
        }
    };

    style() {
        const defaultCSS = this.constructor.defaultProps.cssClass;
        if (this.props.cssClass === defaultCSS) {
            return <style dangerouslySetInnerHTML={{ __html: styles }}></style>;
        }
        return false;
    }

    containerStyle() {

        const style = { transition: 'opacity 0.5s' };
        if (this.state.isProcessing || !this.state.isSdkLoaded || this.props.isDisabled) {
            style.opacity = 0.6;
        }

        return Object.assign(style, this.props.containerStyle);
    }

    render() {
        return (
            <button text={this.props.text} onClick={this.click}>{this.props.text}</button>
        );
    }
}

export default FacebookButton;
