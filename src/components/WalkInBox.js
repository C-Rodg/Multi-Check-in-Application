import React, { Component } from 'react';
import { message, Card, Row, Col, Input, Select, Button, Icon } from 'antd';
const Option = Select.Option;
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { company_size, company_type, job_role, industry, levels,
    countryList, states_us, states_australia, states_brazil, states_canada, states_china, states_germany, states_hongkong, states_india } from '../config/dropdowns';
import { generateFreshForm, requiredFields, convertFormToSurveyData, generateRegistrant, markAsWalkIn, assignStationName } from '../config/registrant';

class WalkInBox extends Component {
    constructor(props) {
        super(props);

        if (props.location && props.location.state && props.location.state.event) {
            const settingsStr = window.localStorage.getItem(props.location.state.event.campaign);
            this.state = {
                form: generateFreshForm(),
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

        this.selectCountry = this.selectCountry.bind(this);   
        this.onFormSubmit = this.onFormSubmit.bind(this); 
    }

    // Check if app is in invalid state
    componentWillMount() {
        if (!this.state.event.campaign) {
            message.error('Something appears to be wrong. Please go back and try again...', 3);
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

    // Update state on input changes
    onInputChange(ev, prop) {
        const form = Object.assign({}, this.state.form);
        form[prop] = ev.target ? ev.target.value : ev;
        this.setState({
            form
        });
    }

    // Form submitted
    onFormSubmit(ev) {
        ev.preventDefault();

        // Ensure all fields have been filled out
        let errorMsg = "";
        const { form } = this.state;
        for (let i = 0, j = requiredFields.length; i < j; i++) {
            const { tag } = requiredFields[i];
            if (!form[tag]) {
                if(tag === 'qrState' && this.state.showStateOther) {
                    // do nothing...
                } else if (tag === 'qrPartnerQuestion' && (!this.state.settings.prereg && this.state.event.campaign)) {
                    // do nothing
                } else if (tag === 'qrAccountID' && (!this.state.event.campagin)) {
                    // do nothing
                } else {
                    errorMsg = `${requiredFields[i].name} is a required field.`;
                    break;
                }
            }
        }
        if(errorMsg) {
            message.error(errorMsg, 3);
            return false;
        }        

        // Generate registrant, mark as walk in and assign station name
        const registrant = assignStationName(markAsWalkIn(generateRegistrant()));
        registrant.SurveyData = convertFormToSurveyData(form);
        
        console.log(registrant);
        // TODO: SUBMIT TO VALIDAR SERVICE, navigate to thank you route
    }

    // Render the walk-in box
    render() {
        const { form } = this.state;
        return (
            <div className="walkin-box" style={walkInBoxStyles.container} >
                <form onSubmit={this.onFormSubmit}>
                    <Row>
                        <Col span={14} offset={5}>
                            <Card title="New Registration" noHovering="true">
                                <Row>

                                    <Col span={11}>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">First Name:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrFirstName} onChange={(ev) => this.onInputChange(ev, 'qrFirstName')}/>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Last Name:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrLastName} onChange={(ev) => this.onInputChange(ev, 'qrLastName')}/>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Phone:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrPhone} onChange={(ev) => this.onInputChange(ev, 'qrPhone')}/>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Email:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrEmail} onChange={(ev) => this.onInputChange(ev, 'qrEmail')}/>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Company:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrCompany} onChange={(ev) => this.onInputChange(ev, 'qrCompany')}/>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Company Size:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrCompanySize} onChange={(ev) => this.onInputChange(ev, 'qrCompanySize')}>
                                                    {this.generateDropdown(company_size)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Company Type:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrCompanyType} onChange={(ev) => this.onInputChange(ev, 'qrCompanyType')}>
                                                    {this.generateDropdown(company_type)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        {
                                            (this.state.event.coworking) ?
                                            <Row style={walkInBoxStyles.row}>
                                                <Col span={10} style={walkInBoxStyles.label} className="req">AWS Account ID:</Col>
                                                <Col span={14}>
                                                    <Input size="large" value={form.qrAccountID} onChange={(ev) => this.onInputChange(ev, 'qrAccountID')}/>
                                                </Col>
                                            </Row> 
                                            :
                                            ""
                                        }
                                        {
                                            (!this.state.event.coworking && this.state.settings.prereg ) ?
                                            <Row style={walkInBoxStyles.row}>
                                                <Col span={10} style={walkInBoxStyles.optInLabel} className="req">Allow Sponsor communication?</Col>
                                                <Col span={14}>
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
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Job Title:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrTitle} onChange={(ev) => this.onInputChange(ev, 'qrTitle')}/>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Job Role:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrJobRole} onChange={(ev) => this.onInputChange(ev, 'qrJobRole')}>
                                                    {this.generateDropdown(job_role)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Industry:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" value={form.qrIndustry} onChange={(ev) => this.onInputChange(ev, 'qrIndustry')}>
                                                    {this.generateDropdown(industry)}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Country:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large" onChange={this.selectCountry} value={form.qrCountry} >
                                                    {this.generateDropdown(countryList)}                                           
                                                </Select>
                                            </Col>
                                        </Row>
                                        {
                                            !this.state.showStateOther ? 

                                            <Row style={walkInBoxStyles.row}>
                                                <Col span={10} style={walkInBoxStyles.label} className="req">State:</Col>
                                                <Col span={14}>
                                                    <Select style={{width: '100%'}} size="large" value={form.qrState} onChange={(ev) => this.onInputChange(ev, 'qrState')}>
                                                        {this.generateStateDropdown()}                                           
                                                    </Select>
                                                </Col>
                                            </Row>
                                            
                                            :

                                            <Row style={walkInBoxStyles.row}>
                                                <Col span={10} style={walkInBoxStyles.label}>State Other:</Col>
                                                <Col span={14}>
                                                    <Input size="large" value={form.qrStateOther} onChange={(ev) => this.onInputChange(ev, 'qrStateOther')}/>
                                                </Col>
                                            </Row>
                                        }      
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label} className="req">Zip Code:</Col>
                                            <Col span={14}>
                                                <Input size="large" value={form.qrZip} onChange={(ev) => this.onInputChange(ev, 'qrZip')}/>
                                            </Col>
                                        </Row>  
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.longLabel} className="req">Level of AWS Usage:</Col>
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
                                            Register<Icon type="right" />
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

const walkInBoxStyles = {
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

export default withRouter(WalkInBox);