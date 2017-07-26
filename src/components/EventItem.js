import React from 'react';
import { Col } from 'antd';
import { Link } from 'react-router-dom';

const EventItem = (props) => {
    return (
        <Col span={5} style={eventItemStyles.column}>
            <Link to={{ pathname:"/search", state: {event: props }}} style={eventItemStyles.link}>
                <span style={eventItemStyles.spanText}>{props.name}</span>
            </Link>
            <span className="line" style={eventItemStyles.line}></span>
        </Col>
    );
}; 

const eventItemStyles = {
    column: {
        backgroundColor: '#2F3842',
        minHeight: '290px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        marginRight: '10px',
        marginBottom: '10px'
    },
    link: {
        color: '#fff',
        fontSize: '2rem',
        flexGrow: '1',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    line: {
        backgroundColor: '#ff9900',
        width: '85%',
        height: '5px',
        marginBottom: '22px',
        borderRadius: '2px'
    },
    spanText: {
        width: '87%',
        margin: '0 auto'
    }
};

export default EventItem;