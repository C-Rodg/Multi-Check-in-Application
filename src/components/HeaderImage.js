import React from 'react';

const HeaderImage = () => {
    return (
        <div className="header-image" style={headerStyle}>
            <img src={require('../static/bg-nyc.jpg')} alt="Amazon" />
        </div>
    );
};

const headerStyle = {
    textAlign: 'center',
    paddingTop: '25px'
};

export default HeaderImage;