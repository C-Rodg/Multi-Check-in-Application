import React from 'react';

const RegistrantTile = ({FirstName, LastName, Company}) => {
    return (
        <div className="registrant-tile">
            <h1>{FirstName + " " + LastName}</h1>
            <h2>{Company}</h2>
        </div>
    );
};

export default RegistrantTile;