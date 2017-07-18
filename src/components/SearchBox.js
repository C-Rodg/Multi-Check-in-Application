import React, { Component } from 'react';
import { Input, Row, Col, message } from 'antd'
const Search = Input.Search;
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Loading from './Loading';
import RegistrantTile from './RegistrantTile';

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
    }
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
        axios.post('Services/Methods.asmx/SearchRegistrants', inputArgs).then((data) => {
            console.log(data);
            if (data && data.d && !data.d.Fault) {
                if (data.d.Registrants && data.d.Registrants.length === 1) {
                    // TODO: Navigate to 'registrant' route with Registrant..
                } else if (data.d.Registrants && data.d.Registrants.length === 0) {
                    // TODO: Navigate to 'walkin' route with empty registrant...
                } else {
                    // Display list of registrants
                    this.setState({ loading: false, registrants: data.d.Registrants });
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
            //this.props.history.push('/walkin');
            this.setState({ registrants: regs });
        });
    }

    generateRegistrantTiles() {
        return (
            <Row type="flex" justify="space-around" align="middle">
                <Col span={24}>
                    {this.state.registrants.map((reg) => {
                        return <RegistrantTile key={reg.AttendeeGuid} {...reg} />;
                    })}
                </Col>
            </Row>
        );
    }

    // Display Component
    render() {
        return (
            <div className="search-box" style={searchBoxStyles.wrapper} >
                <Row type="flex" justify="space-around" align="middle" style={searchBoxStyles.row}>
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
    row: {
        marginTop: '-120px'
    }
}

export default withRouter(SearchBox);