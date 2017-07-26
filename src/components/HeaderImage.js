import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

const HeaderImage = ({showBack, showReporting}) => {
    return (
        <div className="header-image" style={headerStyles.header}>
            {
                showBack ?
                <Link to="welcome" className="back-btn" style={headerStyles.back}>
                    <Icon type="left-circle-o" />
                </Link>
                :
                ""
            }            
            <img src={require('../static/bg-nyc.png')} alt="Amazon" />
            {
                showReporting ?
                <Link to="reporting" className="report-btn" style={headerStyles.reporting}>
                    <Icon type="info-circle-o" />
                </Link> :
                ""
            }
        </div>
    );
};

const headerStyles = {
    header: {
        textAlign: 'center',
        padding: '35px 15px 0 15px'
    },
    back: {
        position: 'absolute',
        top: '5px',
        left: '15px',
        fontSize: '4rem',
        color: '#2F3842'
    },
    reporting: {
        position: 'absolute',
        top: '5px',
        right: '15px',
        fontSize: '4rem',
        color: '#2F3842'
    }
};



export default HeaderImage;