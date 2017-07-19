import React from 'react';
import { Link } from 'react-router-dom';

const SecretSettingsButton = () => {
    return (
        <Link to="settings" style={secretBtnStyles}>

        </Link>
    );
};

const secretBtnStyles = {
    //backgroundColor: "#333",
    position: 'absolute',
    top: '0',
    left: '0',
    width: '80px',
    height: '80px'
};

export default SecretSettingsButton;