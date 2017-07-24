import React, { Component } from 'react';
import { Input, Row, Col, message } from 'antd'
const Search = Input.Search;
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Loading from './Loading';
import RegistrantTile from './RegistrantTile';
import WalkInButton from './WalkInButton';

const regs = [
    {
        Attended: false,
        AttendeeGuid: '123-123-1',
        Company: 'Validar, Inc.',
        FirstName: 'Omeed',
        LastName: 'Jaws',
        ScanKey: 'T010001'
    },
    {
        Attended: false,
        AttendeeGuid: '123-123-2',
        Company: 'Disneyland Parent Company',
        FirstName: 'Tyler',
        LastName: 'Josh-Jackson',
        ScanKey: 'T010002'
    },
    {
        Attended: false,
        AttendeeGuid: '123-123-3',
        Company: 'Toronto Skyline Org.',
        FirstName: 'Jonas',
        LastName: 'Valetnucia',
        ScanKey: 'T010003'
    },
    {
        Attended: false,
        AttendeeGuid: '123-123-4',
        Company: 'Miller, Corp.',
        FirstName: 'Cynthia',
        LastName: 'Mason',
        ScanKey: 'T010004'
    },
    {
        Attended: false,
        AttendeeGuid: '123-123-5',
        Company: 'Amazon - AWS',
        FirstName: 'Muni',
        LastName: 'Muhammed',
        ScanKey: 'T010005'
    },
    {
        Attended: false,
        AttendeeGuid: '123-123-6',
        Company: 'Wilson Basketballs',
        FirstName: 'Mike',
        LastName: 'Doras',
        ScanKey: null
    },
    {
        Attended: false,
        AttendeeGuid: '123-123-7',
        Company: 'MySpace',
        FirstName: 'Tom',
        LastName: 'Douglas',
        ScanKey: null
    },
    // {
    //     Attended: false,
    //     AttendeeGuid: '123-123-8',
    //     Company: 'Facebook',
    //     FirstName: 'Timmy',
    //     LastName: 'Groover',
    //     ScanKey: null
    // }
];

class SearchBox extends Component {
    constructor(props) {
        super(props);
        if (this.props.location && this.props.location.state) {            
            this.state = {
                selectedEvent: { ...this.props.location.state.event },
                loading: false,
                registrants: []
            };
        }  

        this.onSearchSubmit = this.onSearchSubmit.bind(this);      
    }

    // Search was submitted
    onSearchSubmit(val) {
        // Start Loading icon
        this.setState({ loading: true });

        // Create Validar request
        const inputArgs = {
            top: null,
            orderBy: [{Column: "Firstname", OrderByDirection: "Ascending"}],
            searchGroup: {
                Operator: "OR",
                Expressions: [{
                    Column: "LastName",
                    Comparison: "Contains",//"Equals",
                    Value: val
                }, {
                    Column: "Email",
                    Comparison: "Contains",//"Equals",
                    Value: val
                }]
                // TODO: SEARCH FOR NON-NULL Scan KEYS
            }
        };
        axios.post('Services/Methods.asmx/SearchRegistrants', inputArgs).then((resp) => {
            console.log(resp);
            const { d } = resp.data;
            if (d && !d.Fault) {
                if (d.Registrants && d.Registrants.length === 1) {
                    this.props.history.push({
                        pathname: '/registrant',
                        state: { event: this.state.selectedEvent, registrant: d.Registrants[0] }
                    });
                } else if (d.Registrants && d.Registrants.length === 0) {                    
                    this.props.history.push({
                        pathname: '/walkin',
                        state: { event: this.state.selectedEvent, searchTerm: val }
                    });
                } else {
                    // Display list of registrants
                    this.setState({ loading: false, registrants: d.Registrants });
                }                
            } else {
                message.error('There seems to be an issue searching...', 3);
                this.setState({ loading: false });
            }            
        }).catch((err) => {
            // Display Message and stop loading
            message.error('There seems to be an issue searching...', 3);
            this.setState({ loading: false });

            // TESTING
            //this.props.history.push('/walkin', { event: this.state.selectedEvent });
            this.props.history.push({
                pathname: '/walkin',
                state: { event: this.state.selectedEvent }
            });
            //this.setState({ registrants: regs });
        });
    }

    generateRegistrantTiles() {
        return (
            <Row type="flex" justify="center" align="middle" style={searchBoxStyles.listRow} gutter={16}>                
                {this.state.registrants.map((reg) => {
                    return (
                        <Col span={6} key={reg.AttendeeGuid}>
                            <RegistrantTile registrant={reg} event={this.state.selectedEvent} />
                        </Col>
                    );
                })}  
                <Col span={24} style={searchBoxStyles.endRow} >
                    <WalkInButton event={this.state.selectedEvent} />
                </Col>              
            </Row>
        );
    }

    // Display Component
    render() {
        return (
            <div className="search-box" style={searchBoxStyles.wrapper} >
                <Row type="flex" justify="space-around" align="middle" style={searchBoxStyles.searchRow}>
                    <Col span={12} >
                        {
                            (this.state && this.state.loading) ?
                            <Loading />
                            :
                            <Search 
                                id="search-box-input"
                                style={searchBoxStyles.input}
                                placeholder="Email Address or Last Name.."
                                size="large"
                                onSearch={this.onSearchSubmit}
                            />                                                        
                        }
                        
                    </Col>                    
                </Row>
                {
                (this.state && this.state.registrants && this.state.registrants.length > 1) ?
                    this.generateRegistrantTiles()
                    :
                    ""
                }
            </div>
        );
    }
}

const searchBoxStyles = {
    wrapper: {
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'      
    },
    searchRow: {
        marginTop: '-120px'
    },
    listRow: {
        marginTop: '25px'
    },
    endRow: {
        paddingBottom: '15px'
    }
}

export default withRouter(SearchBox);