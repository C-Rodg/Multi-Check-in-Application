import React from 'react';
import { Icon } from 'antd';
import { Link } from 'react-router-dom';

const HeaderImage = ({showBack}) => {
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
            <img src={require('../static/bg-nyc.jpg')} alt="Amazon" />
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
        top: '15px',
        left: '15px',
        fontSize: '4rem',
        color: '#2F3842'
    }
};



export default HeaderImage;