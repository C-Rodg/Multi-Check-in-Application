import React, { Component } from 'react';
import { message, Card, Row, Col, Input, Select, Button, Icon } from 'antd';
const Option = Select.Option;

import { company_size, company_type, job_role, industry, levels,
    countryList, states_us, states_australia, states_brazil, states_canada, states_china, states_germany, states_hongkong, states_india } from '../config/dropdowns';

class WalkInBox extends Component {
    constructor(props) {
        super(props);

        if (props.location && props.location.state && props.location.state.event) {
            const settingsStr = window.localStorage.getItem(props.location.state.event.campaign);
            this.state = {
                form: {},
                stateList: states_us,
                showStateOther: false,
                event: props.location.state.event,
                settings: JSON.parse(settingsStr)
            };
        } else {            
            this.state = {
                form: {},
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
        if (val === 'Canada') {
            this.setState({ stateList: states_canada, showStateOther: false });
        } else if (val === 'Australia') {
            this.setState({ stateList: states_australia, showStateOther: false });
        } else if (val === 'Brazil') {
            this.setState({ stateList: states_brazil, showStateOther: false });
        } else if (val === 'China') {
            this.setState({ stateList: states_china, showStateOther: false });
        } else if (val === 'Germany') {
            this.setState({ stateList: states_germany, showStateOther: false });
        } else if (val === 'Hong Kong') {
            this.setState({ stateList: states_hongkong, showStateOther: false });
        } else if (val === 'India') {
            this.setState({ stateList: states_india, showStateOther: false });
        } else if (val === 'United States') {
            this.setState({ stateList: states_us, showStateOther: false });
        } else {
            this.setState({ showStateOther: true });
        }
    }

    // Form submitted
    onFormSubmit(ev) {
        ev.preventDefault();

        // TODO: CHECK FOR REQUIRED FIELDS VALID, display prompt if not complete

        // TODO: SUBMIT TO VALIDAR SERVICE, navigate to thank you route
        
    }

    // Render the walk-in box
    render() {
        return (
            <div className="walkin-box" style={walkInBoxStyles.container} >
                <form onSubmit={this.onFormSubmit}>
                <Row>
                    <Col span={14} offset={5}>
                        <Card title="New Registration" noHovering="true">
                            <Row>

                                <Col span={11}>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>First Name:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Last Name:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Phone:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Email:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Company:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Company Size:</Col>
                                        <Col span={14}>
                                            <Select style={{width: '100%'}} size="large">
                                                {this.generateDropdown(company_size)}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Company Type:</Col>
                                        <Col span={14}>
                                            <Select style={{width: '100%'}} size="large">
                                                {this.generateDropdown(company_type)}
                                            </Select>
                                        </Col>
                                    </Row>
                                    {
                                        (this.state.event.coworking) ?
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label}>AWS Account ID:</Col>
                                            <Col span={14}>
                                                <Input size="large" />
                                            </Col>
                                        </Row> 
                                        :
                                        ""
                                    }
                                    {
                                        (!this.state.event.coworking && this.state.settings.prereg ) ?
                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.optInLabel}>Allow Sponsor communication?</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large">
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
                                        <Col span={10} style={walkInBoxStyles.label}>Job Title:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Job Role:</Col>
                                        <Col span={14}>
                                            <Select style={{width: '100%'}} size="large">
                                                {this.generateDropdown(job_role)}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Industry:</Col>
                                        <Col span={14}>
                                            <Select style={{width: '100%'}} size="large">
                                                {this.generateDropdown(industry)}
                                            </Select>
                                        </Col>
                                    </Row>
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Country:</Col>
                                        <Col span={14}>
                                            <Select style={{width: '100%'}} size="large" onChange={this.selectCountry}>
                                                {this.generateDropdown(countryList)}                                           
                                            </Select>
                                        </Col>
                                    </Row>
                                    {
                                        !this.state.showStateOther ? 

                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label}>State:</Col>
                                            <Col span={14}>
                                                <Select style={{width: '100%'}} size="large">
                                                    {this.generateStateDropdown()}                                           
                                                </Select>
                                            </Col>
                                        </Row>
                                        
                                        :

                                        <Row style={walkInBoxStyles.row}>
                                            <Col span={10} style={walkInBoxStyles.label}>State Other:</Col>
                                            <Col span={14}>
                                                <Input size="large" />
                                            </Col>
                                        </Row>
                                    }      
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.label}>Zip Code:</Col>
                                        <Col span={14}>
                                            <Input size="large" />
                                        </Col>
                                    </Row>  
                                    <Row style={walkInBoxStyles.row}>
                                        <Col span={10} style={walkInBoxStyles.longLabel}>Level of AWS Usage:</Col>
                                        <Col span={14}>
                                            <Select style={{width: '100%'}} size="large">
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

export default WalkInBox;