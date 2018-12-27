import React from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Template from "../page/Template";
import UserCardGrid from "../item/UserCardGrid";
import HiddenInput from "../item/HiddenInput";
import { PageConfig } from "../../context";

import { ajaxCall } from "../../utils";

const styles = () => ({
    gridView: {
        display: "flex",
        flexFlow: "row wrap",
        alignContent: "flex-start",
        alignItem: "flex-start",
        justifyContent: "flex-start"
    }
});

class ListingPage extends React.Component {
    constructor(props) {
        super(props);

        this.hiddenInputRef = React.createRef();
        this.wrapperRef = React.createRef();
        this.state = {
            students: [],
            focusTimer: null
        };

        this.onClickFocusInput = this.onClickFocusInput.bind(this);
        this.fetchNightInSchoolStudent = this.fetchNightInSchoolStudent.bind(this);
        this.inputOnKeyPressHandler = this.inputOnKeyPressHandler.bind(this);
    }

    componentWillUnmount() {
        clearInterval(this.state.focusTimer);
        this.wrapperRef.current.removeEventListener('click', this.onClickFocusInput);
    }

    componentDidUpdate(prevProps, prevState) {
        this.hiddenInputRef.current.focus();
    }

    componentDidMount() {
        this.state.focusTimer = setInterval(
            () => this.hiddenInputRef.current.focus(),
            200
        );
        // this.hiddenInputRef.current.focus();
        this.wrapperRef.current.addEventListener('click', this.onClickFocusInput);
        
        this.fetchNightInSchoolStudent();

    }

    fetchNightInSchoolStudent() {
        ajaxCall({
            action: "fetch_night_in_school_student",
            // postData
        }).then(response => {

            const inschoolState = response || [];
            

            let uids = [];
            let approvedStudents = [];
            inschoolState.forEach(student => {
                uids.push(student.uid);
                if(student['is_approved'] == 1) approvedStudents.push(student.uid);
            });

            if(uids.length == 0) {

                this.setState({students : []});

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
                    if(response[key]['role_id'] == 5) students.push(Object.assign(response[key], {isApproved: approvedStudents.indexOf(response[key].uid) != -1}));
                })

                this.setState({ students: students || [] })   
            })

        });
    }

    onClickFocusInput() {
        this.hiddenInputRef.current.focus();
    }

    inputOnKeyPressHandler(ev) {
        if(ev.keyCode === 13 || ev.key === 'Enter') {

            const cardId = ev.target.value;
            ev.target.value = '';

            ajaxCall({
                action: 'update_on_dup_night_in_school_student',
                postData: {
                    'card_number': cardId,
                    'state': 0,
                }
            }).then(response => {
                if(response >= 0) this.fetchNightInSchoolStudent();
            })
        }
    }

    render() {
        const students = this.state.students || [];

        return (
            <PageConfig.Consumer>
                {({ viewMode }) => (
                    <div ref={this.wrapperRef}>
                        <Template>
                            <Paper>
                                <HiddenInput onKeyPress={this.inputOnKeyPressHandler} ref={this.hiddenInputRef} />
                                <div className={this.props.classes.gridView}>
                                    {/* {Object.keys(students).map(key => (
                                        <UserCardGrid
                                            key={"elm_key" + key}
                                            data={students[key]}
                                            mode={viewMode}
                                        />
                                    ))} */}
                                    {students.map((student,index) => (
                                        <UserCardGrid 
                                            key={"elm_key" + index}
                                            data={student}
                                            mode={viewMode}
                                        />
                                    ))}
                                </div>
                            </Paper>
                        </Template>
                    </div>
                )}
            </PageConfig.Consumer>
        );
    }
}

export default withStyles(styles)(ListingPage);
