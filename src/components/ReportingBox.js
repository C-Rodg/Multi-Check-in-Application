import React, { Component } from 'react';
import { Row, Card, Col } from 'antd';
import axios from 'axios';

class ReportingBox extends Component {
    constructor(props) {
        super(props);

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const date = new Date();

        this.state = {
            currentMonth: months[date.getMonth()]
        };
    }

    // Get Registration Stats
    getRegistrationStats() {
        return axios.post('Services/Methods.asmx/GetRegistrationStats', {}, { headers: {  'Content-Type': 'application/json; charset=UTF-8' }});
    }

    // Search Registrants
    searchRegistrants(inputArgs) {
        return axios.post('Services/Methods.asmx/SearchRegistrants', inputArgs);
    }

    render() {
        return (
            <div className="reporting-box">
               <Row>
                    <Col span={14} offset={5}>
                        <Card title={this.state.currentMonth + ' reporting'} noHovering="true">
                            Reporting data here...
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ReportingBox;