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
    paddingTop: '0.8rem',
    paddingBottom: '0.6rem'
};

export default StatusText;