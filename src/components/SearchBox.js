import React, { Component } from 'react';
import { Input, Row, Col } from 'antd'
const Search = Input.Search;

class SearchBox extends Component {
    constructor(props) {
        super(props);
        if (this.props.location && this.props.location.state) {
            this.state = {
                selectedEvent: { ...this.props.location.state.event }
            };
        }        
        console.log(this.state);
    }

    onSearchSubmit(val) {
        console.log(val);
    }

    render() {
        return (
            <div className="search-box" style={searchBoxStyles.wrapper} >
                <Row type="flex" justify="space-around" align="middle" style={searchBoxStyles.row}>
                    <Col span={12} >
                        <Search 
                            id="search-box-input"
                            style={searchBoxStyles.input}
                            placeholder="Email Address or Last Name.."
                            size="large"
                            onSearch={this.onSearchSubmit}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

const searchBoxStyles = {
    wrapper: {
        flexGrow: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'        
    },
    row: {
        marginTop: '-120px'
    }
}

export default SearchBox;