import React, { Component } from 'react';
import { Input, Row, Col, message } from 'antd'
const Search = Input.Search;
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import Loading from './Loading';
import RegistrantTile from './RegistrantTile';
import WalkInButton from './WalkInButton';

import { getTextFromXml } from '../utils/registrant'

class SearchBox extends Component {
    constructor(props) {
        super(props);
        if (this.props.location && this.props.location.state) {   
            const settingsStr = window.localStorage.getItem(this.props.location.state.event.campaign);      
            this.state = {
                selectedEvent: { ...this.props.location.state.event },
                loading: false,
                registrants: [],
                settings: JSON.parse(settingsStr)
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
            }
        };
        axios.post('Services/Methods.asmx/SearchRegistrants', inputArgs).then((resp) => {
            const { d } = resp.data;
            if (d && !d.Fault) {
                // Get just the master records
                const masterList = d.Registrants.filter((p) => {
                    return !p.ScanKey;
                });
                let filteredList = [];

                // If COWORKING or ALLOW WALKINS - no need to filter
                // If EVENT and NO WALKINS - search for qrEventName and match with currentEventName
                if (this.state.selectedEvent.coworking || this.state.settings.walkin) {
                    filteredList = masterList;
                } else {
                    const currentEventName = this.state.selectedEvent.name.replace(/\W/g, '').toUpperCase();
                    filteredList = masterList.filter((person) => {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(person.SurveyData, "application/xml");
                        const rootNode = xmlDoc.firstChild;
                        const responsesElement = rootNode.firstChild;
                        let allowedEvent = getTextFromXml(responsesElement, 'qrEventName');
                        if (allowedEvent) {
                          allowedEvent = allowedEvent.replace(/\W/g, '').toUpperCase();
                          return allowedEvent === currentEventName;  
                        } else {
                            return false;
                        }
                    });
                }

                if (filteredList && filteredList.length === 1) {
                    this.props.history.push({
                        pathname: '/registrant',
                        state: { event: this.state.selectedEvent, registrant: filteredList[0], settings: this.state.settings }
                    });
                } else if (filteredList && filteredList.length === 0) {
                    //  About to navigate to walkin mode, check if walk-ins enabled
                    if (this.state.settings.walkin) {
                        message.warn('No registration found. Please complete the form below to continue checking in.', 3);
                        this.props.history.push({
                            pathname: '/walkin',
                            state: { event: this.state.selectedEvent, searchTerm: val, settings: this.state.settings }
                        });
                    } else {
                        this.setState({ loading: false });
                        message.warn('Walk-ins are not allowed for this event. Please see the help desk for more information..', 3);
                    }                   
                } else {
                    // Display list of registrants                    
                    this.setState({ loading: false, registrants: filteredList }); 
                }                
            } else {
                message.error('There seems to be an issue searching...', 3);
                this.setState({ loading: false });
            }            
        }).catch((err) => {
            // Display Message and stop loading
            message.error('There seems to be an issue searching...', 3);
            this.setState({ loading: false });
        });
    }

    generateRegistrantTiles() {
        return (
            <Row type="flex" justify="space-around" gutter={12}>                
                {this.state.registrants.map((reg) => {
                    return (
                        <Col span={6} key={reg.AttendeeGuid} style={searchBoxStyles.item} >
                            <RegistrantTile registrant={reg} event={this.state.selectedEvent} settings={this.state.settings} />
                        </Col>
                    );
                })}  
                {
                    this.state.settings.walkin ? 
                    <Col span={24} >
                        <WalkInButton event={this.state.selectedEvent} />
                    </Col>
                    :
                    ""
                }
                              
            </Row>
        );
    }

    // Display Component
    render() {
        return (
            <div className="search-box" style={(this.state && this.state.registrants && this.state.registrants.length > 8) ? searchBoxStyles.wrapperAbs : searchBoxStyles.wrapper} >
                <Row type="flex" justify="space-around" align="middle" style={searchBoxStyles.searchRow}>
                    <Col span={12} >
                        {
                            (this.state && this.state.loading) ?
                            <Loading />
                            :
                            <Search 
                                id="search-box-input"
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
        textAlign: 'center',
        padding: '15px'    
    },
    wrapperAbs: {
        position: 'absolute',
        top: '200px',
        textAlign: 'center',
        padding: '15px',
        backgroundColor: '#fff'
    },
    searchRow: {
        marginBottom: '20px',
        alignItems: 'center'
    },
    item: {
        marginBottom: '15px'
    }
}

export default withRouter(SearchBox);