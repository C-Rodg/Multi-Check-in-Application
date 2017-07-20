import React, { Component } from 'react';
import { Row } from 'antd';

import SettingsCard from './SettingsCard';

class SettingsBox extends Component {
    constructor(props) {
        super(props);       
    }

    renderCards() {
        if (window.todaysEvents) {
            return window.todaysEvents.map((event) => {                  
                return <SettingsCard key={event.campaign} { ...event } />;
            });
        }
        return (
            <h1>No events today!</h1>   
        );
    }

    render() {
        return (
            <div className="settings-box" style={settingsStyles.container}>
                <Row gutter={16} justify="center" type="flex">
                    {this.renderCards()}                 
                </Row>
            </div>
        );   
    }    
}

const settingsStyles = {
    container: {
        padding: '25px'
    }
};

export default SettingsBox;