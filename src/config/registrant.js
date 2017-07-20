export const generateFreshForm = () => {
    return {
        qrFirstName: '',
        qrLastName: '',
        qrEmail: '',
        qrAccountID: '',
        qrPhone: '',
        qrCompany: '',
        qrCompanySize: '',
        qrCompanyType: '',
        qrIndustry: '',
        qrJobRole: '',
        qrTitle: '',
        qrCountry: '',
        qrState: '',
        qrStateOther: '',
        qrZip: '',
        qrLevel: '',
        qrPartnerQuestion: ''
    };
};

export const requiredFields = [
    { tag: 'qrFirstName', name: 'First Name' },
    { tag: 'qrLastName', name: 'Last Name' },
    { tag: 'qrPhone', name: 'Phone' },
    { tag: 'qrEmail', name: 'Email' },       
    { tag: 'qrCompany', name: 'Company' },
    { tag: 'qrCompanySize', name: 'Company Size' },
    { tag: 'qrCompanyType', name: 'Company Type' },
    { tag: 'qrPartnerQuestion', name: 'Allow Sponsor communication' },
    { tag: 'qrAccountID', name: 'AWS Account ID' }, 
    { tag: 'qrTitle', name: 'Title' },
    { tag: 'qrJobRole', name: 'Job Role' },
    { tag: 'qrIndustry', name: 'Industry' },       
    { tag: 'qrCountry', name: 'Country' },
    { tag: 'qrState', name: 'State' },
    { tag: 'qrZip', name: 'Zip Code' },
    { tag: 'qrLevel', name: 'Level of AWS Usage' }    
];

// Generate Fresh Registrant
export const generateRegistrant = () => {
    return {
        Attended: false,
        AttendeeGuid: null,
        AttendeeId: null,
        AttendeeType: null,
        BadgeId: null,
        Company: null,
        Email: null,
        FirstCheckInDateTime: null,
        FirstName: null,
        FirstPrintDateTime: null,
        LastName: null,
        OnSiteModifiedDateTime: null,
        PrePrint: false,
        PreRegistrationDateTime: null,
        Printed: false,
        RegistrantId: null,
        ScanKey: null,
        ServerGuid: null,
        ServerName: null,
        StationName: null,
        SurveyData: null,
        UploadGuid: null,
        Uploaded: false,
        WalkIn: false
    };
};

// Mark registrant as a walkIn
export const markAsWalkIn = (reg) => {
    return Object.assign({}, reg, { WalkIn: true });
}

// Assign a station name
export const assignStationName = (reg) => {
    const StationName = window.localStorage.getItem('validar_stationName') || '-NO STATION NAME-'
    return Object.assign({}, reg, { StationName })
};

// Convert Form Object to survey data / new survey data
export const convertFormToSurveyData = (form, survey) => {
    let surveyData = survey ? survey : '<result><responses></responses></result>';
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(surveyData, "application/xml");
    const rootNode = xmlDoc.firstChild;
    const responsesElement = rootNode.firstChild;

    // Loop through responses and update survey data
    for (let prop in form) {
        if (form.hasOwnProperty(prop)) {
            reflectTextNode(responsesElement, prop, form[prop], xmlDoc);
        }
    }

    return (new XMLSerializer()).serializeToString(xmlDoc);
};

// Updated xmlDoc with new element or edit existing element
const reflectTextNode = (responsesElement, elementId, textValue, xmlDoc) => {
    if ( elementId && elementId != "" ) {
        const existingElements = responsesElement.getElementsByTagName(elementId);
        if ( (existingElements == null) || (existingElements.length == 0) ) {
            const element = xmlDoc.createElement(elementId);
            responsesElement.appendChild(element);
            const textNode = xmlDoc.createTextNode(textValue);
            element.appendChild(textNode);
        } else {
            const node = existingElements[0];
            const textNode = xmlDoc.createTextNode(textValue);
            if ( node.firstChild == null ) {
                node.appendChild(textNode);
            } else {
                node.replaceChild(textNode, node.firstChild);
            }
        }
    }
}