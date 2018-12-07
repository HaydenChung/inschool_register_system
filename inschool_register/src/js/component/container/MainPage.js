import React from "react";

import Routing from "../routing";

class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h5>Here are the main page.</h5>
                <Routing />
            </div>
        )
    }

}

export default MainPage;