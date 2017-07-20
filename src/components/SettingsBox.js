import React, { Component } from 'react';
import { Row, Card, Col, Input } from 'antd';

import SettingsCard from './SettingsCard';

class SettingsBox extends Component {
    constructor(props) {
        super(props);  

        const stationName = window.localStorage.getItem('validar_stationName') || '';
        this.state = {
            stationName
        };

        // Bind methods to class
        this.updateStationName = this.updateStationName.bind(this);
    }

    // Map out today's events settings
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

    // Update this specific station name
    updateStationName(ev) {
        window.localStorage.setItem('validar_stationName', ev.target.value);
        this.setState({ stationName:  ev.target.value });
    }

    render() {
        return (
            <div className="settings-box" style={settingsStyles.container}>
                <Row gutter={16} justify="center" type="flex">
                    <Col span={6} style={settingsStyles.station}>
                        <Card title="Station Settings" noHovering="false" >
                            <Row>
                                <Col span={10}>
                                    Station Name: 
                                </Col> 
                                <Col span={14}>
                                    <Input size="large" placeholder="Station Name" onChange={this.updateStationName} value={this.state.stationName} />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
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
    },
    station: {
        marginBottom: '15px',
        paddingLeft: '0'
    }
};

export default SettingsBox;