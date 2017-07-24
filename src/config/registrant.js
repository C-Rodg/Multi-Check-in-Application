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
        qrPartnerQuestion: '',
        qrEventName: ''
    };
};

export const loadRegistrantIntoForm = (existingReg) => {
    const newForm = generateFreshForm();

    const parser = new DOMParser();
    const formDoc = parser.parseFromString(existingReg.SurveyData, 'text/xml');
    const rootNode = formDoc.firstChild;
    const responsesElement = rootNode.firstChild;

    for(let prop in newForm) {
        if (newForm.hasOwnProperty(prop)) {
            newForm[prop] = getTextFromXml(responsesElement, prop);
        }
    }

    console.log(newForm);
    return newForm;
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

// Assign Company, Email, FirstName, LastName, Attendee Type??
export const assignRegistrantProps = (reg, form) => {
    return Object.assign({}, reg, {
        Company: form.qrCompany || '',
        Email: form.qrEmail || '',
        FirstName: form.qrFirstName || '',
        LastName: form.qrLastName || ''
    });
};

// 
export const assignAsAttended = (reg) => {
    const FirstCheckInDateTime = reg.FirstCheckInDateTime ? reg.FirstCheckInDateTime : new Date();
    return Object.assign({}, reg, {
        Attended: true,
        OnSiteModifiedDateTime: new Date(),
        FirstCheckInDateTime
    });
}

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

// Generate printer args to send to service
export const generatePrintArgs = (reg, printerName) => {

    const printArgs = {
        attendeeGuid: reg.AttendeeGuid,
        documentId: 'badge',
        markPrinted: true,
        printDocument: null,
        printSettingsXml: null,
        printToImage: false,
        printerName,
        registrantDocument: null
    };

    printArgs.printDocument = generatePrintDoc(reg);
    console.log(printArgs);

    return printArgs;
};

// Generate printdoc to send
const generatePrintDoc = (reg) => {
    
    // Print Doc
    const printDocString = '<print><printitems></printitems></print>';
    const printParser = new DOMParser();
    const printDoc = printParser.parseFromString(printDocString, 'application/xml');
    const items = printDoc.getElementsByTagName('printitems')[0];

    // Survey Data Doc
    const surveyData = reg.SurveyData ? reg.SurveyData : '<result><responses></responses></result>';
    const formParser = new DOMParser();
    const formDoc = formParser.parseFromString(surveyData, 'application/xml');
    const rootFormNode = formDoc.firstChild;
    const responsesElement = rootFormNode.firstChild;
    
    // Get Printed fields
    const name = reg.FirstName + ' ' + reg.LastName;
    const company = reg.Company;
    const title = getTextFromXml(responsesElement, 'qrTitle');
    const role = getTextFromXml(responsesElement, 'qrJobRole');

    // Add to print doc
    appendXmlPrintItem(printDoc, 'slot1', name);
    appendXmlPrintItem(printDoc, 'slot2', company);
    appendXmlPrintItem(printDoc, 'slot3', title);
    appendXmlPrintItem(printDoc, 'slot4', role);

    return (new XMLSerializer).serializeToString(printDoc);
};

// Append new print item to print doc
const appendXmlPrintItem = (printDoc, id, val) => {
    const items = printDoc.getElementsByTagName('printitems')[0];
    const newEl = printDoc.createElement('printitem');
    newEl.setAttribute('id', id);
    newEl.textContent = val;
    items.appendChild(newEl);
};

// Get text from xml parsed survey data
const getTextFromXml = (responsesElement, elementId) => {
    if ( elementId && elementId != "" ) {
        const existingElements = responsesElement.getElementsByTagName(elementId);
        if ( (existingElements != null) && (existingElements.length > 0) ) {
            const node = existingElements[0];
            const textNode = node.firstChild;
            if ( textNode != null ) {
                return textNode.textContent;
            }
        }
    }
    return "";
};