import React from 'react';
import { Row } from 'antd';

import EventItem from './EventItem';

const EventListBox = () => {
    return (
        <div className="eventlist-box" style={eventListStyles}>
            <Row type="flex" justify="space-around" align="middle">
                {window.todaysEvents && window.todaysEvents.map((event) => {
                    return (
                        <EventItem {...event} key={event.campaign} />
                    );
                })}
            </Row>
        </div>
    );
};

const eventListStyles = {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center'
};

export default EventListBox;