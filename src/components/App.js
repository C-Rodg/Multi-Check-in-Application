import React from 'react';
import { HashRouter } from 'react-router-dom';
import moment from 'moment';

import HeaderImage from './HeaderImage';
import ContentBox from './ContentBox';
import { eventList } from '../config/events';

const App = () => {
    
    // For Testing, production link to external event script
    window.eventList = eventList;

    // Determine today's events
    const today = moment();
    window.todaysEvents = window.eventList.filter((event) => {
        return today.isBetween(event.startDate, event.endDate, 'day', '[]');
    });
    console.log(todaysEvents);
    
    return (
        <div className="app" style={appStyles} >
            <HeaderImage />
            <HashRouter>
                <ContentBox />
            </HashRouter>
        </div>
    );
}

const appStyles = {
    display: 'flex',
    flexDirection: 'column'
};

export default App;