import React from "react";
import { withStyles } from "@material-ui/core/styles";

const HiddenInput = React.forwardRef((props, ref)=> (
    <div>
        <input hidden={true} disabled={props.disabled} onKeyPress={props.onKeyPress} ref={ref} type='text'  autofocus="true" />
    </div>

));

export default HiddenInput;

class HiddenInput extends React.Component {
    constructor(props) {
        super(props);
        
        this.htmlBody = document.querySelector('body');
        this.inputValue = null;

        this.addInputListener = this.addInputListener.bind(this);
    }

    componentDidMount() {
        this.htmlBody.addEventListener('keyup', this.hiddenInputListener);
    }

    componentWillUnmount() {
        this.htmlBody.removeEventListener('keyup', this.hiddenInputListener);
    }

    hiddenInputListener(ev) {
        if(ev.key != 'Enter' || ev.keyCode != 13) {
            this.inputValue += ev.key;
            return;
        }

        ev.target.value = this.inputValue;
        this.props.onKeyPress(ev);
    }

}



HiddenInput.defaultProps = {
    onKeyPress: ()=> {}
};