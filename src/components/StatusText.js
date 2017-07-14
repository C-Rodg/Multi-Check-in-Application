import React from 'react';

const StatusText = ({status}) => {    
    return (
        <h1 className="status-text" style={statusTextStyles}>{status}</h1>
    );
}

StatusText.defaultProps = {
    status: 'Welcome to the Amazon Lofts!'
};

const statusTextStyles = {
    textAlign: 'center',
    fontSize: '3.3rem',
    padding: '0.5rem'
};

export default StatusText;