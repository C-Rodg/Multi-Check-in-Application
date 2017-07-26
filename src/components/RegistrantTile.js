import React from 'react';
import { Link } from 'react-router-dom';

const RegistrantTile = (props) => {   
    const { event, registrant, settings } = props;
    return (
        <div className="registrant-tile" style={regTileStyles.tile}>
            <Link to={{ pathname:"/registrant", state: { event, registrant, settings }}} style={regTileStyles.link} >
                <h1 style={regTileStyles.text}>{registrant.FirstName + " " + registrant.LastName}</h1>
                <h2 style={regTileStyles.textSub}>{registrant.Company}</h2>                
            </Link>
            <span className="line" style={regTileStyles.line}></span>
        </div>
    );
};

const regTileStyles = {
    link : {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: 'calc(100% - 22px)'
    },
    text: {
        color: '#fff'
    },
    textSub: {
        fontWeight: '200',
        color: '#fff',
        fontSize: '1.3rem'
    },
    line: {
        backgroundColor: '#ff9900',
        width: '85%',
        height: '5px',
        margin: '8px auto 0',
        borderRadius: '2px',
        display: 'block'
    },
    tile: {
        height: '100%',
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        backgroundColor: '#2F3842',
        borderRadius: '4px',
    }
};

export default RegistrantTile;