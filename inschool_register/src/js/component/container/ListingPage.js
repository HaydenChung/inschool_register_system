import React from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Template from "../page/Template";
import UserCardGrid from "../item/UserCardGrid";
import HiddenInput from "../item/HiddenInput";
import { PageConfig, withUiSound } from "../../context";
import LargeUserCard from "../group/LargeUserCard";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';

import { ajaxCall } from "../../utils";

const styles = () => ({
    gridView: {
        display: "flex",
        flexFlow: "row wrap",
        alignContent: "flex-start",
        alignItem: "flex-start",
        justifyContent: "flex-start"
    },
    popUpCard: {
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%,0)"
    }
});

class ListingPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            students: [],
            active: false,
            dialogOpen: false,
            selectedStudent: {},
        };

        this.reloadTimer = 0;

        this.fetchNightInSchoolStudent = this.fetchNightInSchoolStudent.bind(
            this
        );
        this.inputOnKeyPressHandler = this.inputOnKeyPressHandler.bind(this);
        this.userGridOnClickHandler = this.userGridOnClickHandler.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.popUpTransition = this.popUpTransition.bind(this);
    }

    componentDidMount() {
        this.fetchNightInSchoolStudent(true);

        this.reloadTimer = setInterval(
            this.fetchNightInSchoolStudent.bind(this, true),
            30000
        );
    }

    componentWillUnmount() {
        clearInterval(this.reloadTimer);
    }

    fetchNightInSchoolStudent(display) {
        this.setState({ active: false });

        ajaxCall({
            action: "fetch_night_in_school_student"
            // postData
        }).then(response => {
            const inschoolState = response || [];

            let uids = [];
            let approvedStudents = [];
            inschoolState.forEach(student => {
                uids.push(student.uid);
                if (student["is_approved"] == 1)
                    approvedStudents.push(student.uid);
            });

            if (uids.length == 0) {
                this.setState({
                    students: [],
                    active:
                        typeof display == "undefined"
                            ? this.state.active
                            : display
                });

                return;
            }

            let postData = {
                conditions: JSON.stringify([
                    { field: "uid", params: uids, operator: "IN" }
                ])
            };

            ajaxCall({
                action: "fetch_user_static",
                postData
            }).then(response => {
                let students = [];
                Object.keys(response).forEach(key => {
                    if (response[key]["role_id"] == 5)
                        students.push(
                            Object.assign(response[key], {
                                isApproved:
                                    approvedStudents.indexOf(
                                        response[key].uid
                                    ) != -1
                            })
                        );
                });

                this.setState({
                    students: students || [],
                    active:
                        typeof display == "undefined"
                            ? this.state.active
                            : display
                });
            });
        });
    }

    //this method was build to update user leave school status, have been replan to observe user gate out record from attendance system.
    inputOnKeyPressHandler(ev) {
        if (ev.keyCode === 13 || ev.key === "Enter") {
            const cardId = ev.target.value;
            ev.target.value = "";

            this.setState({});

            ajaxCall({
                action: "update_on_dup_night_in_school_student",
                postData: {
                    card_number: cardId,
                    state: 0
                }
            }).then(response => {
                if (response >= 0) {
                    this.fetchNightInSchoolStudent(true);
                    this.props.uiSound.acceptSound.play();
                }
            });
        }
    }

    userGridOnClickHandler({ uid }) {
        let result = [];

        this.state.students.some(student => {
            if (student.uid == uid) {
                result = student;
                return;
            }
        });

        this.setState({selectedStudent: result, dialogOpen: true});
    }

    handleDialogClose() {
        this.setState({selectedStudent: {}, dialogOpen: false})
    }


    popUpTransition(props) {
        return <Slide direction="up" {...props} />
    }

    render() {
        const students = this.state.students || [];
        const selectedStudent = this.state.selectedStudent || {};

        return (
            <PageConfig.Consumer>
                {({ viewMode }) => (
                    <div>
                        <Template active={this.state.active}>
                            <Paper>
                                {/* <HiddenInput onKeyPress={this.inputOnKeyPressHandler} /> */}
                                <div className={this.props.classes.gridView}>
                                    {students.map((student, index) => (
                                        <UserCardGrid
                                            onClick={
                                                this.userGridOnClickHandler
                                            }
                                            key={"elm_key" + index}
                                            data={student}
                                            mode={viewMode}
                                        />
                                    ))}
                                </div>
                            </Paper>
                        </Template>
                            <div className={this.props.classes.popUpCard}>
                                <Dialog
                                    open={this.state.dialogOpen}
                                    TransitionComponent={this.popUpTransition}
                                    keepMounted
                                    onClose={this.handleDialogClose}
                                    aria-labelledby="student-card-pop-up"
                                >
                                    <LargeUserCard
                                        chi_name={
                                            selectedStudent["chi_name"]
                                        }
                                        eng_name={
                                            selectedStudent["eng_name"]
                                        }
                                        class={
                                            selectedStudent["class"]
                                        }
                                        uid={
                                            selectedStudent["uid"]
                                        }
                                        image={
                                            selectedStudent['uri']
                                        }
                                        class_number={
                                            selectedStudent['class_number']
                                        }
                                    />
                                </Dialog>
                            </div>
                    </div>
                )}
            </PageConfig.Consumer>
        );
    }
}

export default withStyles(styles)(withUiSound(ListingPage));
