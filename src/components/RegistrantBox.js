import React, { Component } from 'react';
import { message, Card, Row, Col, Input, Select, Button, Icon } from 'antd';
const Option = Select.Option;
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { company_size, company_type, job_role, industry, levels,
    countryList, states_us, states_australia, states_brazil, states_canada, states_china, states_germany, states_hongkong, states_india } from '../config/dropdowns';

import { loadRegistrantIntoForm, generateFreshForm } from '../config/registrant';

class RegistrantBox extends Component {
    constructor(props) {
        super(props);

        if (props.location && props.location.state && props.location.state.event ) {
            const settingsStr = window.localStorage.getItem(props.location.state.event.campaign);
            const form = props.location.state.registrant ? loadRegistrantIntoForm(props.location.state.registrant) : generateFreshForm();
            form.qrEventName = props.location.state.event.name;       
            this.state = {
                form,
                stateList: states_us,
                showStateOther: false,
                event: props.location.state.event,
                settings: JSON.parse(settingsStr)
            };
        } else {            
            this.state = {
                form: generateFreshForm(),
                stateList: states_us,
                showStateOther: false,
                event: {},
                settings: { walkin: true, prereg: true }
            };
        }
    }

    // Check if app is in invalid state
    componentWillMount() {
        if (!this.state.event.campaign || !this.props.location.state.registrant) {
            message.error('Something appears to be very wrong. Please go back and try again...', 3);
        }
    }

    render() {
        return (
            <div className="registrant-box">
                Registrant box
            </div>
        );
    }
}

export default withRouter(RegistrantBox);