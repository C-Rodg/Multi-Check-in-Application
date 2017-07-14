import React from 'react';
import { Col } from 'antd';
import { Link } from 'react-router-dom';

const EventItem = (props) => {
    return (
        <Col span={6} style={eventItemStyles.column}>
            <Link to={{ pathname:"/search", state: {event: props }}} style={eventItemStyles.link}>
                <span>{props.name}</span>
            </Link>
            <span className="line" style={eventItemStyles.line}></span>
        </Col>
    );
};

const eventItemStyles = {
    column: {
        backgroundColor: '#232f3e',
        minHeight: '340px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    },
    link: {
        color: '#fff',
        fontSize: '3rem',
        flexGrow: '1',
        display: 'flex',
        alignItems: 'center'
    },
    line: {
        backgroundColor: '#febd69',
        width: '85%',
        height: '5px',
        marginBottom: '22px',
        borderRadius: '2px'
    }
};

export default EventItem;