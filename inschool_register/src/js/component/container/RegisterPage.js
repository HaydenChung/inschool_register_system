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
            freePassLock: false,
        }

        this.freePassTimer = null;

        this.hiddenInputRef = React.createRef();
        this.inputOnKeyPressHandler = this.inputOnKeyPressHandler.bind(this);
        this.toggleFreePassPeriod = this.toggleFreePassPeriod.bind(this);
        this.onRegisterFailHandler = this.onRegisterFailHandler.bind(this);
    }

    toggleFreePassPeriod({expire= 30, state}) {
        clearTimeout(this.freePassTimer);

        if(state != true) {
            this.setState({freePassLock: false});

            return;
        }

        this.setState({freePassLock: true});
        this.freePassTimer = setTimeout(()=> this.setState({freePassLock: true}), expire* 1000);
    }

    inputOnKeyPressHandler(ev) {
        if(ev.keyCode === 13 || ev.key === 'Enter') {

            this.setState({active: false});

            const cardId = ev.target.value;
            ev.target.value = '';
            let isVerify = false;


            if(this.state.freePassLock === true) {

            } else {
                
            }

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
                                    student = Object.assign(response[key], isVerify);
                                });
                                this.setState({studentData: student, active: true});
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
                            student = Object.assign(response[key], isVerify);
                        });
                        this.setState({studentData: student, active: true});
                    });

                }
            });
        }
    }

    checkWhiteList(cardId){

        return ajaxCall({
            action: 'fetch_night_in_school_student_registered',
            postData: {
                'card_number': cardId,
            }
        })
        .then(response => {
            if(!response[0].uid) {
                let error = new Error("No result return from register list.");
                error.code = "NOT_IN_WHITELIST";
                error.userCardId = cardId;
                throw error;
            }
        })
    }

    fetchUser(cardId, isVerify) {

        return ajaxCall({
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
                student = Object.assign(response[key], isVerify);
            });
            this.setState({studentData: student, active: true});
        })
        .catch(this.onRegisterFailHandler);

    }



    onRegisterFailHandler(error) {

        switch error.code {
            case 'NOT_IN_WHITELIST':
                this.fetchUser(error.userCardId,false);
                return;
            break;
        }

        reminder('Register Failed, please check your connection or contact support staff.');

        this.setState({studentData: {}, active: true});
    }

    render() {

        const student = this.state.studentData;
        console.log('isVerify',this.state.isVerify);

        return (
            <Template active={this.state.active}>
                <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                    <HiddenInput disabled={!this.state.active} onKeyPress={this.inputOnKeyPressHandler} ref={this.hiddenInputRef}/>
                    <LargeUserCard freePassLock={this.state.freePassLock} chi_name={student.chi_name} eng_name={student.eng_name} class={student.class} class_number={student.class_number} image={student.uri} student_no={student.name} />
                </div>
            </Template>
        )
    }
}

export default RegisterPage;
