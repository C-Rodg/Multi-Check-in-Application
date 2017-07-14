import React from 'react';
import { HashRouter } from 'react-router-dom';

import HeaderImage from './HeaderImage';
import ContentBox from './ContentBox';
import { eventList } from '../config/events';

const App = () => {
    
    // For Testing, production link to external event script
    window.eventList = eventList;
    console.log(window.eventList);
    
    return (
        <div className="app">
            <HeaderImage />
            <HashRouter>
                <ContentBox />
            </HashRouter>
        </div>
    );
}

export default App;