import React from "react";

const denialSound = new Audio(
    "/inschool_register/sound/denial.mp3"
);
const acceptSound = new Audio(
    "/inschool_register/sound/accept.mp3"
);

const UserConfig = React.createContext(false);
const PageConfig = React.createContext(false);
const UiSound = React.createContext(false);

function withUiSound(Component) {
    return function(props) {
        return (
            <UiSound.Provider value={{ denialSound, acceptSound }}>
                <UiSound.Consumer>
                    {uiSound => <Component {...props} uiSound={uiSound} />}
                </UiSound.Consumer>
            </UiSound.Provider>
        );
    };
}

export { UserConfig, PageConfig, withUiSound };
