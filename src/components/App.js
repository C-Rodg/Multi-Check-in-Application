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
    
    // Set default settings
    window.todaysEvents.forEach((event) => {
        let settings = { walkin: true, prereg: true };
        const settingsStr = window.localStorage.getItem(event.campaign);
        if (settingsStr) {
            settings = JSON.parse(settingsStr);
        }
        window.localStorage.setItem(event.campaign, JSON.stringify(settings));
    });
    
    return (
        <div className="app" style={appStyles} >            
            <HashRouter>                
                <ContentBox />
            </HashRouter>
        </div>
    );
}

const appStyles = {
    height: '100vh'
};

export default App;