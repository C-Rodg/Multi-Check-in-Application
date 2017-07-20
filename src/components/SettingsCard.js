import React, { Component } from 'react';
import { Col, Card, Row, Switch } from 'antd';

class SettingsCard extends Component {
    constructor(props) {
        super(props);
        const settingsStr = window.localStorage.getItem(props.campaign);
        let settingsObj = { walkin: true, prereg: true };
        if (settingsStr) {
            settingsObj = JSON.parse(settingsStr);
        }
        this.state = {
            event: props.campaign,
            walkin: settingsObj.walkin,
            prereg: settingsObj.prereg
        };

        this.handleSaveSettings = this.handleSaveSettings.bind(this);
    }

    // Save settings on unmount
    componentWillUnmount() {
        const settings = {
            walkin: this.state.walkin,
            prereg: this.state.prereg
        };
        window.localStorage.setItem(this.state.event, JSON.stringify(settings));
    }

    // Update component state
    handleSaveSettings(prop, val) {
        this.setState({
            [prop]: val
        });
    }

    // Render Event Settings box
    render() {        
        return (
            <Col span={6}>
                <Card title={this.props.name + ' settings'} noHovering="false" style={settingsCardStyles.card}>
                    <Row gutter={8} style={settingsCardStyles.row}>
                        <Col span={10}>
                            Walk-ins: 
                        </Col> 
                        <Col span={14}>
                            <Switch checked={this.state.walkin} onChange={(ev) => this.handleSaveSettings('walkin', ev)} />
                        </Col>
                    </Row>
                    {
                        (this.props.coworking) ?
                        "" :
                        <Row gutter={8}>
                            <Col span={10}>
                                Partner Question: 
                            </Col> 
                            <Col span={14}>
                                <Switch checked={this.state.prereg} onChange={(ev) => this.handleSaveSettings('prereg', ev)}/>
                            </Col>
                        </Row>
                    }                
                </Card>
            </Col>
        );
    }
}

const settingsCardStyles = {
    card: {
        minHeight: '165px',
        marginRight: '10px'
    },
    row: {
        marginBottom: '15px'
    }
};

export default SettingsCard;