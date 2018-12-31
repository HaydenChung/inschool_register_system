import React from "react";
import Tab from "@material-ui/core/tab";
import Tabs from "@material-ui/core/tabs";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";

import Gate from "mdi-material-ui/Gate";
import ShieldAccount from "mdi-material-ui/ShieldAccount";

import { withRouter } from "react-router-dom";

const styles = theme => ({
    wrapper: {
        flex: 1
    }
});

class NavBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0
        };

        this.paths = {
            0: "/firstpage",
            1: "/secondpage"
        };

        this.onTabChangeHandler = this.onTabChangeHandler.bind(this);
    }

    onTabChangeHandler(ev, tabIndex) {
        setTimeout(() => this.props.history.push(this.paths[tabIndex]), 1);
    }

    render() {
        return (
            <Paper className={this.props.classes.wrapper}>
                <Tabs
                    value={false}
                    onChange={this.onTabChangeHandler}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab icon={<Gate />} label="GATES" />
                    <Tab icon={<ShieldAccount />} label="PATROL" />
                </Tabs>
            </Paper>
        );
    }
}

export default withStyles(styles)(withRouter(NavBlock));
