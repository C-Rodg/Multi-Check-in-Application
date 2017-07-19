import React from 'react';
import { Col, Card, Switch } from 'antd';

const SettingsCard = (props) => {

    return (
        <Col span={6}>
            <Card title={props.name + ' settings'} noHovering="false" style={settingsCardStyles.card}>
                <div>
                    <span>Walk-ins: </span> <Switch />
                </div>
                {
                    (props.coworking) ?
                    "" :
                    <div>
                        <span>Partner Question: </span> <Switch />
                    </div>
                }                
            </Card>
        </Col>
    );
};

const settingsCardStyles = {
    card: {
        minHeight: '142px'
    }
};

export default SettingsCard;