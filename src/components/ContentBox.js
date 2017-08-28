import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// Routes
import HeaderImage from "./HeaderImage";
import StatusText from "./StatusText";
import EventListBox from "./EventListBox";
import SearchBox from "./SearchBox";
import WalkInBox from "./WalkInBox";
import RegistrantBox from "./RegistrantBox";
import ThankYouBox from "./ThankYouBox";
import SettingsBox from "./SettingsBox";
import SecretSettingsButton from "./SecretSettingsButton";
import ReportingBox from "./ReportingBox";

const ContentBox = () => {
	return (
		<Switch>
			<Route
				exact
				path="/settings"
				render={props =>
					<div style={contentStyles.routerRoot}>
						<HeaderImage showBack={true} showReporting={true} />
						<div className="content-box" style={contentStyles.contentBox}>
							<StatusText {...props} status="Settings" />
							<SettingsBox {...props} />
						</div>
					</div>}
			/>
			<Route
				exact
				path="/welcome"
				render={props => {
					const msg =
						window.todaysEvents && window.todaysEvents.length > 0
							? "Welcome! What are you checking in for?"
							: "No events today...";
					return (
						<div style={contentStyles.routerRoot}>
							<SecretSettingsButton />
							<HeaderImage showBack={false} />
							<div className="content-box" style={contentStyles.contentBox}>
								<StatusText {...props} status={msg} />
								<EventListBox {...props} />
							</div>
						</div>
					);
				}}
			/>
			<Route
				exact
				path="/search"
				render={props =>
					<div style={contentStyles.routerRoot}>
						<HeaderImage showBack={true} />
						<div className="content-box" style={contentStyles.contentBox}>
							<StatusText
								{...props}
								status="Please enter your last name or email."
							/>
							<SearchBox {...props} />
						</div>
					</div>}
			/>
			<Route
				exact
				path="/walkin"
				render={props =>
					<div style={contentStyles.routerRoot}>
						<HeaderImage showBack={true} />
						<div className="content-box" style={contentStyles.contentBox}>
							<StatusText {...props} status="Please enter your information." />
							<WalkInBox {...props} />
						</div>
					</div>}
			/>
			<Route
				exact
				path="/registrant"
				render={props =>
					<div style={contentStyles.routerRoot}>
						<HeaderImage showBack={true} />
						<div className="content-box" style={contentStyles.contentBox}>
							<StatusText
								{...props}
								status="Please confirm your information."
							/>
							<RegistrantBox {...props} />
						</div>
					</div>}
			/>
			<Route
				exact
				path="/thankyou"
				render={props =>
					<div style={contentStyles.routerRoot}>
						<HeaderImage showBack={false} />
						<div className="content-box" style={contentStyles.contentBox}>
							<StatusText {...props} status="Thank you! You're all set!" />
							<ThankYouBox {...props} />
						</div>
					</div>}
			/>
			<Route
				exact
				path="/reporting"
				render={props =>
					<div style={contentStyles.routerRoot}>
						<HeaderImage showBack={true} />
						<div className="content-box" style={contentStyles.contentBox}>
							<StatusText {...props} status="Amazon Events" />
							<ReportingBox />
						</div>
					</div>}
			/>
			<Redirect from="/" exact to="/settings" />
		</Switch>
	);
};

const contentStyles = {
	contentBox: {
		flexGrow: "1",
		display: "flex",
		flexDirection: "column"
	},
	routerRoot: {
		display: "flex",
		flexDirection: "column",
		height: "100vh"
	}
};

export default ContentBox;
