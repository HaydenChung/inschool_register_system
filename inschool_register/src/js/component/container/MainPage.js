import React from "react";

import Routing from "../routing";
import { PageConfig } from "../../context";

class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewChangeTimer: null
        };

        this.onResizeHandler = this.onResizeHandler.bind(this);
    }

    onResizeHandler() {
        clearTimeout(this.state.viewChangeTimer);

        this.state.viewChangeTimer = setTimeout(() => {
            if (
                this.state.viewMode != "desktop" &&
                window.matchMedia("(min-width: 1460px)").matches
            ) {
                return this.setState({ viewMode: "desktop" });
            }
            if (
                this.state.viewMode != "laptop" &&
                window.matchMedia("(min-width: 1200px) and (max-width: 1460px)")
                    .matches
            ) {
                return this.setState({ viewMode: "laptop" });
            }
            if (
                this.state.viewMode != "table" &&
                window.matchMedia("(max-width: 1200px)").matches
            ) {
                return this.setState({ viewMode: "table" });
            }
        }, 200);
    }

    componentDidMount() {
        // this.setState({'breakView':window.matchMedia("(min-width: 700px)").matches});
        this.onResizeHandler();
        window.addEventListener("resize", this.onResizeHandler);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onResizeHandler);
    }

    render() {
        return (
            <div
                style={{
                    height: this.state.viewMode != "table" ? "auto" : "82vh"
                }}
            >
                <PageConfig.Provider
                    value={{ viewMode: this.state.viewMode }}
                >
                    <Routing />
                </PageConfig.Provider>
            </div>
        );
    }
}

export default MainPage;
