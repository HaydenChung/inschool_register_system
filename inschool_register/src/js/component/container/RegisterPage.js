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
            freePassPeriod: false,
            approver: '',
        }

        this.freePassTimer = null;
        this.resetPageTimer = null;

        this.inputOnKeyPressHandler = this.inputOnKeyPressHandler.bind(this);
        this.toggleFreePassPeriod = this.toggleFreePassPeriod.bind(this);
        this.onRegisterFailHandler = this.onRegisterFailHandler.bind(this);
        this.checkWhiteList = this.checkWhiteList.bind(this);
        this.updateUserInschool = this.updateUserInschool.bind(this);
        this.setResetPage = this.setResetPage.bind(this);
    }

    toggleFreePassPeriod({expire= 30, state = true, approver}) {
        clearTimeout(this.freePassTimer);

        if(state != true) {
            this.setState({freePassPeriod: false, approver: ''});

            return;
        }

        const newState = {freePassPeriod: true, approver: typeof approver == 'undefined' ? this.state.approver : approver};

        this.setState(newState);
        this.freePassTimer = setTimeout(()=> this.setState({freePassPeriod: false, approver: ''}), expire* 1000);
    }

    
    setResetPage(expire = 30) {
        clearTimeout(this.resetPageTimer);

        this.resetPageTimer = setTimeout(()=> this.setState({studentData: {}, active: true}), expire * 1000);
    }

    // inputOnKeyPressHandler(ev) {
    //     if(ev.keyCode === 13 || ev.key === 'Enter') {

    //         this.setState({active: false});

    //         const cardId = ev.target.value;
    //         ev.target.value = '';
    //         let isVerify = false;


    //         if(this.state.freePassPeriod === true) {

    //         } else {
                
    //         }

    //         ajaxCall({
    //             action: 'fetch_night_in_school_student_registered',
    //             postData: {
    //                 'card_number': cardId,
    //             }
    //         }).then(response=> {
    //             if(response[0].uid != 'undefined') {

    //                 const uid = response[0].uid;
    //                 isVerify = true;

    //                 ajaxCall({
    //                     action: 'update_on_dup_night_in_school_student',
    //                     postData: {
    //                         'card_number': cardId,
    //                         'state': 1,
    //                     }
    //                 }).then((response)=> {
    //                     if(response) {
    //                         ajaxCall({
    //                             action: 'fetch_user_static',
    //                             postData: {
    //                                 'conditions': JSON.stringify({
    //                                     field: 'uid',
    //                                     params: uid,
    //                                     operator: '='
    //                                 })
    //                             }
    //                         }).then(response=> {
    //                             let student = {};
    //                             Object.keys(response).some((key)=> {
    //                                 student = Object.assign(response[key], isVerify);
    //                             });
    //                             this.setState({studentData: student, active: true});
    //                         });
    //                     }
    //                 });
    //             } else {
    //                 ajaxCall({
    //                     action: 'fetch_user_static',
    //                     postData: {
    //                         'conditions': JSON.stringify({
    //                             field: 'card_id',
    //                             params: cardId,
    //                             operator: '='
    //                         })
    //                     }
    //                 }).then(response => {
    //                     let student = {};
    //                     Object.keys(response).some((key)=> {
    //                         student = Object.assign(response[key], isVerify);
    //                         return true;
    //                     });
    //                     //Let student register for 30 sec ,even when they are not in whitelist
    //                     if(student['role_id'] == 4) this.toggleFreePassPeriod();
    //                     this.setState({studentData: student, active: true});
    //                 });

    //             }
    //         });
    //     }
    // }

    
    inputOnKeyPressHandler(ev) {
        if(ev.keyCode === 13 || ev.key === 'Enter') {

            this.setState({active: false, studentData: {}});

            const cardId = ev.target.value;
            ev.target.value = '';
            let freePass = this.state.freePassPeriod;

            let student = {};

            this.fetchUser(cardId)
            .then(response => {

                if(!response) throw new Error('No user found, please check the Smartcard id.');

                Object.keys(response).some(key => {
                    student = Object.assign({}, response[key]);
                });

                this.setState({studentData: student});

                //If this is a teacher, we will give the student a freepass period to register.
                if(student['role_id'] == 4) {
                    this.toggleFreePassPeriod({state: true, approver: student['uid']});
                    freePass = true;
                }

                if(freePass) {
                    return this.updateUserInschool(cardId)
                    .then(response => {
                        if(response >= 0) {
                            this.toggleFreePassPeriod({state: true, approver: student['uid']});
                            this.setState({studentData: Object.assign(this.state.studentData, {'isVerify': true}),active: true});
                        }
                    })
                    // .catch(this.onRegisterFailHander);
                }else {
                    return this.checkWhiteList(cardId)
                    .then(response=> {
                        if(typeof response[0] != 'undefined' && typeof response[0].uid != 'undefined') {
                            return this.updateUserInschool(cardId)
                            .then(response=> {
                                this.setState({studentData: Object.assign(this.state.studentData, {'isVerify': true}),active: true});
                            }) 
                        } else {
                            ajaxCall({
                                action: 'fetch_night_in_school_student',
                                postData: {
                                    'uid': student.uid
                                }
                            })
                            .then((response) => {
                                let newState = {active: true, 'studentData': Object.assign(this.state.studentData, {isVerify: typeof response[0] == 'undefined' ? false : true })};
                                this.setState(newState);
                            });

                        }
                    })
                    // .catch(this.onRegisterFailHander);;
                }
                
            })
            .then((response) => {
                this.setResetPage(30);
            })
            .catch(this.onRegisterFailHandler);

        }
    }

    checkWhiteList(cardId){

        return ajaxCall({
            action: 'fetch_night_in_school_student_registered',
            postData: {
                'card_number': cardId,
            }
        });
    }

    fetchUser(cardId) {

        return ajaxCall({
            action: 'fetch_user_static',
            postData: {
                'conditions': JSON.stringify({
                    field: 'card_id',
                    params: cardId,
                    operator: '='
                })
            }
        });
    }

    updateUserInschool(cardId) {
        return ajaxCall({
            action: 'update_on_dup_night_in_school_student',
            postData: {
                'card_number': cardId,
                'state': 1,
                'approver': this.state.approver
            }
        });
    }


    onRegisterFailHandler(error) {

        switch (error.code) {
            case 'NOT_IN_WHITELIST':
                this.fetchUser(error.userCardId,false);
                return;
            break;
        }

        console.log(error);

        reminder('Register Failed, please check your connection or contact support staff.');
        setTimeout(() => closeReminder(0), 5000);

        this.setState({studentData: {}, active: true});
    }


    render() {

        const student = this.state.studentData;

        return (
            <div>
                <Template active={this.state.active}>
                    <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <HiddenInput disabled={!this.state.active} onKeyPress={this.inputOnKeyPressHandler} />
                        <LargeUserCard freePassPeriod={this.state.freePassPeriod} chi_name={student.chi_name} eng_name={student.eng_name} class={student.class} class_number={student.class_number} image={student.uri} student_no={student.name} isVerify={student.isVerify} />
                    </div>
                </Template>
            </div>

        )
    }
}

export default RegisterPage;
