import React, { Component } from 'react';
import { Input } from 'antd'
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

    render() {
        return (
            <div className="search-box">
                <Search 
                    placeholder="Email Address or Last Name.."
                />
            </div>
        );
    }
}

export default SearchBox;