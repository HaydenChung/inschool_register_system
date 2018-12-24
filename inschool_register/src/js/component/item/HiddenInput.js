import React from "react";
import { withStyles } from "@material-ui/core/styles";

const HiddenInput = React.forwardRef((props, ref)=> (
    <div>
        <input disabled={props.disabled} onKeyPress={props.onKeyPress} ref={ref} type='text'  autofocus="true" />
    </div>

));

export default HiddenInput;

HiddenInput.defaultProps = {
    onKeyPress: ()=> {}
};