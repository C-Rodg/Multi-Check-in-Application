import React, { Component } from 'react';
import { message, Card, Row, Col, Input, Select, Button, Icon } from 'antd';
const Option = Select.Option;
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { company_size, company_type, job_role, industry, levels,
    countryList, states_us, states_australia, states_brazil, states_canada, states_china, states_germany, states_hongkong, states_india } from '../config/dropdowns';

import { loadRegistrantIntoForm, generateFreshForm, requiredFields, copyMasterRecord, 
    assignRegistrantProps, assignStationName, assignAsAttended, convertFormToSurveyData, generatePrintArgs } from '../utils/registrant';

class RegistrantBox extends Component {
    constructor(props) {
        super(props);

        const currentPrinter = window.localStorage.getItem('validar_selectedPrinter');
        if (props.location && props.location.state ) {
            const { settings, registrant, event } = props.location.state;
            const form = loadRegistrantIntoForm(registrant);
            form.qrEventName = event.name;
            let stateList = '',
                showStateOther = false;
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
                event,
                settings,
                masterRecord: registrant,
                currentPrinter
            };
        } else {            
            this.state = {
                form: generateFreshForm(),
                stateList: states_us,
                showStateOther: false,
                event: {},
                settings: { walkin: true, prereg: true },
                masterRecord: {},
                currentPrinter
            };
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    // Check if app is in invalid state
    componentWillMount() {
        if (!this.state.event.campaign || (!this.state.masterRecord.hasOwnProperty('AttendeeGuid')) ) {
            message.error('Something appears to be very wrong. Please go back and try again...', 5);
        }
        if (!this.state.currentPrinter) {
            message.error('No printer selected. Please go back to settings and try again..', 4);
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

        // Check for printers
        if (!this.state.currentPrinter) {
            message.error('No printer selected. Please go back to settings and try again..', 4);
            return false;
        }

        // Check form validity
        let errorMsg = "";
        const { form, event } = this.state;
        for (let i = 0, j = requiredFields.length; i < j; i++) {
            const { tag } = requiredFields[i];
            if (!form[tag]) {
                if (tag === 'qrState' && this.state.showStateOther) {}
                else if (tag === 'qrPartnerQuestion' && (!this.state.settings.prereg || this.state.event.coworking)) {}
                else if (tag === 'qrAccountID' && (!this.state.event.coworking)) {}
                else {
                    errorMsg = `${requiredFields[i].name} is a required field.`;
                    break;
                }
            }
        }
        if (errorMsg) {
            message.error(errorMsg, 3);
            return false;
        }

        // Copy Master, assign station name, assign attended, assign registrant props, convert current form to Survey Data        
        const newRegistrant = assignRegistrantProps(assignAsAttended(assignStationName(copyMasterRecord(this.state.masterRecord))), form);
        newRegistrant.SurveyData = convertFormToSurveyData(form, newRegistrant.SurveyData);

        // Assign attendee type
        newRegistrant.AttendeeType = event.name;

        // Assign Scan Key
        newRegistrant.ScanKey = this.state.masterRecord.BadgeId;

        const dupeData = { registrant: newRegistrant };

        const config = {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json'
            }
        };

        // Upsert dupe record        
        axios.post('Services/Methods.asmx/UpsertRegistrant', JSON.stringify(dupeData), config)        
        // Print dupe record
        .then((resp) => {
            const { Registrant } = resp.data.d;

            const printArgs = generatePrintArgs(Registrant, this.state.currentPrinter);
            
            // Print Badge
            return axios.post('Services/Methods.asmx/PrintBadge', JSON.stringify(printArgs), config);
        })
        .then((printResp) => {
            if (printResp.data.d.Fault) {
                message.error('There seems to be an issue printing this record. Please see the help desk.', 3);
                return false;
            }

            this.props.history.push({
                pathname: '/thankyou'
            });
        })
        .catch((err) => {
            console.log(err);
            message.error('There seems to be an issue saving this record. Please see the help desk.', 3);
        });
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