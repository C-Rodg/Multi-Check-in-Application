import React, { Component } from 'react';
import { Row, Card, Col, Input, Select } from 'antd';
const Option = Select.Option;
import axios from 'axios';

import SettingsCard from './SettingsCard';

class SettingsBox extends Component {
    constructor(props) {
        super(props);  

        const stationName = window.localStorage.getItem('validar_stationName') || '';
        const selectedPrinter = window.localStorage.getItem('validar_selectedPrinter') || '';
        this.state = {
            stationName,
            selectedPrinter,
            printerList: []
        };

        // Bind methods to class
        this.updateStationName = this.updateStationName.bind(this);
        this.updateSelectedPrinter = this.updateSelectedPrinter.bind(this);
    }

    // Get printer list
    componentWillMount() {
        axios.post('Services/Methods.asmx/ListPrinters', {})
            .then((resp) => {
                const printers = resp.data.d.Printers;
                this.setState({ printerList: printers });
            })
            .catch((err) => {

            });
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

    // Update value of selected printer
    updateSelectedPrinter(val) {
        window.localStorage.setItem('validar_selectedPrinter', val);
        this.setState({ selectedPrinter: val });
    }

    // Get dropdown of printers
    generatePrinterDropdown() {
        return this.state.printerList.map((printer) => {
            return <Option key={printer} value={printer}>{printer}</Option>;
        });
    }

    render() {
        return (
            <div className="settings-box" style={settingsStyles.container}>
                <Row gutter={16} justify="center" type="flex">
                    <Col span={6} style={settingsStyles.station}>
                        <Card title="Station Settings" noHovering="false" >
                            <Row style={settingsStyles.row} >
                                <Col span={10}>
                                    Station Name: 
                                </Col> 
                                <Col span={14}>
                                    <Input size="large" placeholder="Station Name" onChange={this.updateStationName} value={this.state.stationName} />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={10}>
                                    Printer:
                                </Col>
                                <Col span={14}>
                                    <Select style={{width: '100%'}} size="large" value={this.state.selectedPrinter} onChange={this.updateSelectedPrinter}>
                                        <Option value=""></Option>
                                        {
                                           this.generatePrinterDropdown()
                                        }    
                                    </Select>
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
    },
    row: {
        marginBottom: '15px'
    }
};

export default SettingsBox;