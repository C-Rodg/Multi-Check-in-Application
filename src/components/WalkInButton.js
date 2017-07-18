import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const WalkInButton = ({event}) => {
    return (
        <Link to={{ pathname:"/walkin", state: { event }}} >
            <Button style={walkInBtnStyles}>
                Not Yet Registered? Register Here.
            </Button>
        </Link>
    );
};

const walkInBtnStyles = {
    marginTop: '25px',
    fontSize: '24px',
    padding: '10px 20px',
    height: 'auto'
};

export default WalkInButton;

