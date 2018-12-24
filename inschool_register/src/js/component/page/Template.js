import React from "react";
import Paper from "@material-ui/core/Paper";
import Fade from "@material-ui/core/Fade";
import classnames from "classNames";

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
                    {this.props.children}
                </Fade>
            </div>
        );
    }
}

Template.defaultProps = {
    active: true
};

export default Template;

// Template.defaultProps = {
//     className: null
// };