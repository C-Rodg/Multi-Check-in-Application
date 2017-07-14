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
                    <div className="content-box">
                        <StatusText {...props} status="Settings" />                        
                        <SettingsBox />
                    </div>
                )} />
                <Route exact path="/welcome" render={(props) => (
                    <div className="content-box">
                        <StatusText {...props} status="Why are you here today?" />
                        <EventListBox />
                    </div>
                )} />                    
                <Route exact path="/search" render={(props) => (
                    <div className="content-box">
                        <StatusText {...props} status="Please enter your last name or email." />
                        <SearchBox />
                    </div>
                )} />
                <Route exact path="/walkin" render={(props) => (
                    <div className="content-box">
                        <StatusText {...props} status="Please enter your information." />
                        <WalkInBox />
                    </div>
                )} />
                <Route exact path="/registrant" render={(props) => (
                    <div className="content-box">
                        <StatusText {...props} status="Please confirm your information." />
                        <RegistrantBox />
                    </div>
                )} /> 
                <Route exact path="/thankyou" render={(props) => (
                    <div className="content-box">
                        <StatusText {...props} status="Thank you! You're all set!" />
                        <ThankYouBox />
                    </div>
                )} /> 
                <Redirect from="/" exact to="/welcome" />        
            </Switch>            
        );
};

export default ContentBox;