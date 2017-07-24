import React from 'react';
import { withRouter } from 'react-router-dom';

const ThankYouBox = (props) => {

    // Navigate back to welcome after pause
    setTimeout(() => {
        props.history.push({ pathname: '/welcome' });
    }, 3000);  

    return (
        <div className="thankyou-box" style={thankyouStyles.container} >
            <div className="checkmark-wrapper">
                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
        </div>
    );
}

const thankyouStyles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: '1'
    }
};

export default withRouter(ThankYouBox);