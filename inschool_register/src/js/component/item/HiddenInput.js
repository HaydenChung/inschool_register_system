import React from "react";

class HiddenInput extends React.Component {
    constructor(props) {
        super(props);
        
        this.htmlBody = document.querySelector('body');
        this.inputValue = '';

        this.hiddenInputListener = this.hiddenInputListener.bind(this);
    }

    componentDidMount() {
        this.htmlBody.addEventListener('keyup', this.hiddenInputListener);
    }

    componentWillUnmount() {
        this.htmlBody.removeEventListener('keyup', this.hiddenInputListener);
    }

    hiddenInputListener(ev) {

        if(this.props.disabled == true) return;

        if(ev.key != 'Enter' || ev.keyCode != 13) {
            this.inputValue += ev.key;
            return;
        }

        ev.target.value = this.inputValue;
        this.props.onKeyPress(ev);
        setTimeout(()=> this.inputValue = '', 0)
    }

    render() {
        return (<div></div>);
    }

}

export default HiddenInput;


HiddenInput.defaultProps = {
    onKeyPress: ()=> {}
};