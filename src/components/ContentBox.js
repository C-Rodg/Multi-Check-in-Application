import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Routes
import StatusText from './StatusText';
import EventListBox from './EventListBox';
import SearchBox from './SearchBox';
import WalkInBox from './WalkInBox';
import RegistrantBox from './RegistrantBox';
import ThankYouBox from './ThankYouBox';
import SettingsBox from './SettingsBox';

const ContentBox = () => {
        return (
            <Switch>
                <Route exact path="/settings" render={(props) => (
                    <div className="content-box" style={contentBoxStyles}>
                        <StatusText {...props} status="Settings" />                        
                        <SettingsBox {...props} />
                    </div>
                )} />
                <Route exact path="/welcome" render={(props) => (
                    <div className="content-box" style={contentBoxStyles}>
                        <StatusText {...props} status="Why are you here today?" />
                        <EventListBox {...props} />
                    </div>
                )} />                    
                <Route exact path="/search" render={(props) => (
                    <div className="content-box" style={contentBoxStyles}>
                        <StatusText {...props} status="Please enter your last name or email." />
                        <SearchBox {...props} />
                    </div>
                )} />
                <Route exact path="/walkin" render={(props) => (
                    <div className="content-box" style={contentBoxStyles}>
                        <StatusText {...props} status="Please enter your information." />
                        <WalkInBox {...props} />
                    </div>
                )} />
                <Route exact path="/registrant" render={(props) => (
                    <div className="content-box" style={contentBoxStyles}>
                        <StatusText {...props} status="Please confirm your information." />
                        <RegistrantBox {...props} />
                    </div>
                )} /> 
                <Route exact path="/thankyou" render={(props) => (
                    <div className="content-box" style={contentBoxStyles}>
                        <StatusText {...props} status="Thank you! You're all set!" />
                        <ThankYouBox {...props} />
                    </div>
                )} /> 
                <Redirect from="/" exact to="/welcome" />        
            </Switch>            
        );
};

const contentBoxStyles = {
    flexGrow: '1',
    display: 'flex',
    flexDirection: 'column'
};

export default ContentBox;