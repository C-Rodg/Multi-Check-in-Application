import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

const WalkInButton = ({ event, settings }) => {
	return (
		<Link to={{ pathname: "/walkin", state: { event, settings } }}>
			<Button style={walkInBtnStyles}>
				Not Yet Registered? Register Here.
			</Button>
		</Link>
	);
};

const walkInBtnStyles = {
	margin: "10px auto 15px auto",
	fontSize: "24px",
	padding: "10px 20px",
	height: "auto"
};

export default WalkInButton;
