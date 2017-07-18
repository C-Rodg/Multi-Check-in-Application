import React from 'react';
import { Link } from 'react-router-dom';

const RegistrantTile = (props) => {   
    const { event, registrant } = props;
    return (
        <div className="registrant-tile">
            <Link to={{ pathname:"/registrant", state: { event, registrant }}} style={regTileStyles.link} >
                <h1 style={regTileStyles.text}>{registrant.FirstName + " " + registrant.LastName}</h1>
                <h2 style={regTileStyles.textSub}>{registrant.Company}</h2>
                <span className="line" style={regTileStyles.line}></span>
            </Link>
        </div>
    );
};

const regTileStyles = {
    link : {
        margin: '10px 15px',
        display: 'block',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        backgroundColor: '#2F3842',
        borderRadius: '4px',
        padding: '10px',
        minHeight: '96px'
    },
    text: {
        color: '#fff'
    },
    textSub: {
        fontWeight: '200',
        color: '#fff'
    },
    line: {
        backgroundColor: '#ff9900',
        width: '85%',
        height: '5px',
        margin: '8px auto 0',
        borderRadius: '2px',
        display: 'block'
    }
};

export default RegistrantTile;