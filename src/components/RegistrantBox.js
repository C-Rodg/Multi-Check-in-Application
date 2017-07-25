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
            let stateList = "";
            let showStateOther = false;
            const country = form.qrCountry.toUpperCase();
            switch(country) {
                case 'AUSTRALIA':
                    stateList = states_australia;
                    break;
                case 'CANADA':
                    stateList = states_canada;
                    break;
                case 'BRAZIL':
                    stateList = states_brazil;
                    break;
                case 'CHINA':
                    stateList = states_china;
                    break;
                case 'GERMANY':
                    stateList = states_germany;
                    break;
                case 'HONG KONG':
                    stateList = states_hongkong;
                    break;
                case 'INDIA':
                    stateList = states_india;
                    break;
                case '':
                case 'UNITED STATES':
                    stateList = states_us;
                    break;
                default:
                    stateList = states_us;
                    showStateOther = true;
                    break;
            } 
            this.state = {
                form,
                stateList,
                showStateOther,
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

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    // Check if app is in invalid state
    componentWillMount() {
        if (!this.state.event.campaign || !this.props.location.state.registrant) {
            message.error('Something appears to be very wrong. Please go back and try again...', 5);
        }
    }

    // Generate State Dropdown
    generateStateDropdown() {        
        return this.state.stateList.map((st) => {
            return <Option key={st} value={st}>{st}</Option>;
        });        
    }

    // Generate Dropdowns
    generateDropdown(list) {
        return list.map((item) => {
            return <Option key={item} value={item}>{item}</Option>
        });        
    }

    // Update state on input changes
    onInputChange(ev, prop) {
        const form = Object.assign({}, this.state.form);
        form[prop] = ev.target ? ev.target.value : ev;
        this.setState({
            form
        });
    }

    // Country selected, display state list
    selectCountry(val) {
        const form = Object.assign({}, this.state.form);        
        form['qrCountry'] = val;
        form['qrState'] = '';
        form['qrStateOther'] = '';
        if (val === 'Canada') {
            this.setState({ stateList: states_canada, showStateOther: false, form });
        } else if (val === 'Australia') {
            this.setState({ stateList: states_australia, showStateOther: false, form });
        } else if (val === 'Brazil') {
            this.setState({ stateList: states_brazil, showStateOther: false, form });
        } else if (val === 'China') {
            this.setState({ stateList: states_china, showStateOther: false, form });
        } else if (val === 'Germany') {
            this.setState({ stateList: states_germany, showStateOther: false, form });
        } else if (val === 'Hong Kong') {
            this.setState({ stateList: states_hongkong, showStateOther: false, form });
        } else if (val === 'India') {
            this.setState({ stateList: states_india, showStateOther: false, form });
        } else if (val === 'United States') {
            this.setState({ stateList: states_us, showStateOther: false, form });
        } else {
            this.setState({ showStateOther: true, form });
        }
    }

    // Form submitted
    onFormSubmit(ev) {
        ev.preventDefault();
    }

    render() {
        const { form } = this.state;
        return (
            <div className="registrant-box">
                <form onSubmit={this.onFormSubmit}>
                    <Row>
                        <Col span={14} offset={5}>
                            <Card title="Confirm Registration" noHovering="true">
                                <Row>

                                    <Col span={11}>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">First Name:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrFirstName} onChange={(ev) => this.onInputChange(ev, 'qrFirstName')}/>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Last Name:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrLastName} onChange={(ev) => this.onInputChange(ev, 'qrLastName')}/>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Phone:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrPhone} onChange={(ev) => this.onInputChange(ev, 'qrPhone')}/>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Email:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrEmail} onChange={(ev) => this.onInputChange(ev, 'qrEmail')}/>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Company:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrCompany} onChange={(ev) => this.onInputChange(ev, 'qrCompany')}/>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Company Size:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrCompanySize} onChange={(ev) => this.onInputChange(ev, 'qrCompanySize')}>
                                                    {this.generateDropdown(company_size)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Company Type:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrCompanyType} onChange={(ev) => this.onInputChange(ev, 'qrCompanyType')}>
                                                    {this.generateDropdown(company_type)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.event.coworking) ?
                                            <Row style={registrantBoxStyles.row}>
                                                <Col span={10} style={registrantBoxStyles.label} className="req">AWS Account ID:</Col>
                                                <Col span={14}>
                                                    <Input size="large" value={form.qrAccountID} onChange={(ev) => this.onInputChange(ev, 'qrAccountID')}/>
                                                </Col>
                                            </Row> 
                                            :
                                            ""
                                        }
                                        {
                                            (!this.state.event.coworking && this.state.settings.prereg ) ?
                                            <Row style={registrantBoxStyles.row}>
                                                <Col span={17} style={registrantBoxStyles.optInLabel} className="req">Allow Sponsor Communication?</Col>
                                                <Col span={7}>
                                                    <Select style={{width: '100%'}} size="large" value={form.qrPartnerQuestion} onChange={(ev) => this.onInputChange(ev, 'qrPartnerQuestion')}>
                                                        <Option value="Yes">Yes</Option>
                                                        <Option value="No">No</Option>                                         
                                                    </Select>
                                                </Col>
                                            </Row>
                                            :
                                            ""
                                        }                                     
                                        
                                    </Col>

                                    <Col span={11} offset={2}>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Job Title:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrTitle} onChange={(ev) => this.onInputChange(ev, 'qrTitle')}/>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Job Role:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrJobRole} onChange={(ev) => this.onInputChange(ev, 'qrJobRole')}>
                                                    {this.generateDropdown(job_role)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Industry:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrIndustry} onChange={(ev) => this.onInputChange(ev, 'qrIndustry')}>
                                                    {this.generateDropdown(industry)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Country:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" onChange={this.selectCountry} value={form.qrCountry} >
                                                    {this.generateDropdown(countryList)}                                           
                                                </Select>
                                            </Col>
                                        </Row>
                                        {
                                            !this.state.showStateOther ? 

                                            <Row style={registrantBoxStyles.row}>
                                                <Col span={10} style={registrantBoxStyles.label} className="req">State:</Col>
                                                <Col span={14}>
                                                    <Select style={{width: '100%'}} size="large" value={form.qrState} onChange={(ev) => this.onInputChange(ev, 'qrState')}>
                                                        {this.generateStateDropdown()}                                           
                                                    </Select>
                                                </Col>
                                            </Row>
                                            
                                            :

                                            <Row style={registrantBoxStyles.row}>
                                                <Col span={10} style={registrantBoxStyles.label}>State Other:</Col>
                                                <Col span={14}>
                                                    <Input size="large" value={form.qrStateOther} onChange={(ev) => this.onInputChange(ev, 'qrStateOther')}/>
                                                </Col>
                                            </Row>
                                        }      
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.label} className="req">Zip Code:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrZip} onChange={(ev) => this.onInputChange(ev, 'qrZip')}/>
                                            </Col>
                                        </Row>  
                                        <Row style={registrantBoxStyles.row}>
                                            <Col span={10} style={registrantBoxStyles.longLabel} className="req">Level of AWS Usage:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrLevel} onChange={(ev) => this.onInputChange(ev, 'qrLevel')}>
                                                    {this.generateDropdown(levels)}                                           
                                                </Select>
                                            </Col>
                                        </Row>  

                                    </Col>

                                </Row>

                                <Row style={{marginTop: '15px'}}>                            
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button onClick={this.onFormSubmit} htmlType="submit" size="large" type="primary" className="register-btn">
                                            Check-in<Icon type="right" />
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </form>
            </div>
        );
    }
}


const registrantBoxStyles = {
    container: {
        flexGrow: '1'
    },
    row: {
        marginBottom: '10px'
    },
    label: {
        textAlign: 'right',
        paddingRight: '12px',
        lineHeight: '1.7'
    },
    longLabel: {
        textAlign: 'right',
        whiteSpace: 'nowrap',
        marginLeft: '-10px',
        marginRight: '10px',
        lineHeight: '1.7'
    },
    optInLabel: {
        textAlign: 'right',
        whiteSpace: 'nowrap',
        marginLeft: '-15px',
        marginRight: '15px',
        fontSize: '15px',
        lineHeight: '2.1'
    }
};

export default withRouter(RegistrantBox);