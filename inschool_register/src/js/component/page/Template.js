import React from "react";
import Fade from "@material-ui/core/Fade";
import classnames from "classNames";
import { withStyles } from "@material-ui/core/styles";
import { PageConfig } from "../../context";

import NavBlock from "../group/NavBlock";

const styles = theme => ({
    wrapperTop: {
        marginTop: 24
    }
});

class Template extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <PageConfig.Consumer>
                {({ viewMode }) => (
                    <div
                        className={classnames(
                            viewMode === "desktop" &&
                                this.props.classes.wrapperTop
                        )}
                    >
                        <NavBlock />
                        <Fade
                            in={this.props.active}
                            timeout={this.props.active ? 1000 : 0}
                        >
                            {this.props.children}
                        </Fade>
                    </div>
                )}
            </PageConfig.Consumer>
        );
    }
}

Template.defaultProps = {
    active: true
};

export default withStyles(styles)(Template);
