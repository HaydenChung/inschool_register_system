import React from "react";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import RegisterPage from "../container/RegisterPage";
import UnRegisterPage from "../container/UnRegisterPage";
import ListingPage from "../container/ListingPage";

class Routing extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MemoryRouter>
                <div>
                    <Route
                        exact
                        path="/"
                        render={props=>
                            (<ListingPage />)

                        }
                    />
                    <Route
                        exact
                        path="/firstpage"
                        render={props=> 
                            (<ListingPage />)

                        }
                    />
                    <Route
                        exact
                        path="/secondpage"
                        render={props=> 
                            (<RegisterPage />)

                        }
                    />
                    <Route
                        exact
                        path="/thirdpage"
                        render={props=> 
                            (<UnRegisterPage />)

                        }
                    />

                    
                </div>
            </MemoryRouter>
        )
    }
}

export default Routing;