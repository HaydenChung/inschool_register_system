import React from "react";
import Template from "../page/Template";

import LargeUserCard from '../group/LargeUserCard';
import { FormHelperText } from "@material-ui/core";
import HiddenInput from "../item/HiddenInput";
import { ajaxCall } from "../../utils";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            studentData: {},
            active: true,
            isVerify: false,
        }

        this.hiddenInputRef = React.createRef();
        this.inputOnKeyPressHandler = this.inputOnKeyPressHandler.bind(this);
    }

    inputOnKeyPressHandler(ev) {
        if(ev.keyCode === 13 || ev.key === 'Enter') {

            this.setState({active: false});

            const cardId = ev.target.value;
            ev.target.value = '';
            let isVerify = false;

            ajaxCall({
                action: 'fetch_night_in_school_student_registered',
                postData: {
                    'card_number': cardId,
                }
            }).then(response=> {
                if(response[0].uid != 'undefined') {

                    const uid = response[0].uid;
                    isVerify = true;

                    ajaxCall({
                        action: 'update_on_dup_night_in_school_student',
                        postData: {
                            'card_number': cardId,
                            'state': 1,
                        }
                    }).then((response)=> {
                        if(response) {
                            ajaxCall({
                                action: 'fetch_user_static',
                                postData: {
                                    'conditions': JSON.stringify({
                                        field: 'uid',
                                        params: uid,
                                        operator: '='
                                    })
                                }
                            }).then(response=> {
                                let student = {};
                                Object.keys(response).some((key)=> {
                                    student = response[key];
                                });
                                this.setState({studentData: student, active: true, isVerify});
                            });
                        }
                    });
                } else {
                    ajaxCall({
                        action: 'fetch_user_static',
                        postData: {
                            'conditions': JSON.stringify({
                                field: 'card_id',
                                params: cardId,
                                operator: '='
                            })
                        }
                    }).then(response => {
                        let student = {};
                        Object.keys(response).some((key)=> {
                            student = response[key];
                        });
                        this.setState({studentData: student, active: true, isVerify});
                    });

                }
            });
        }
    }

    render() {

        const student = this.state.studentData;
        console.log('isVerify',this.state.isVerify);

        return (
            <Template active={this.state.active}>
                <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                    <HiddenInput disabled={!this.state.active} onKeyPress={this.inputOnKeyPressHandler} ref={this.hiddenInputRef}/>
                    <LargeUserCard chi_name={student.chi_name} eng_name={student.eng_name} class={student.class} class_number={student.class_number} image={student.uri} student_no={student.name} />
                </div>
            </Template>
        )
    }
}

export default RegisterPage;
