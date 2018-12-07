import React from "react";
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";

import NavBlock from "../group/NavBlock";

class Template extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBlock />
                <Fade
                    in={this.props.active}
                    timeout={this.props.active ? 1000 : 0}
                >
                    <Paper>{this.props.children}</Paper>
                </Fade>
            </div>
        );
    }
}

Template.defaultProps = {
    active: true
};

export default Template;
