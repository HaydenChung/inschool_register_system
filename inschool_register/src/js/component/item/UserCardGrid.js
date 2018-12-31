import React from "react";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Card from "@material-ui/core/Card";
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardAction from '@material-ui/core/CardActions'

const styles = theme => ({
    wrapper: {
        flex: "0 1 8%",
        height: "140px",
        margin: "1%",
        "&:hover": {
            cursor: "pointer"
        }
    },
    mobileWrapper: {
        flex: "0 1 12%",
        height: "140px",
        margin: "1%",
        "&:hover": {
            cursor: "pointer"
        }
    },
    colInner: {
        // border: '4px solid #e0e0e0',
        wordWrap: "break-word"
    },
    studImgWrapper: {
        backgroundColor: "#c4e4f5",
        position: "relative"
    },
    studentClass: {
        backgroundColor: "rgba(237, 237, 237, 0.76)",
        padding: "1px",
        position: "absolute",
        bottom: 0,
        left: "50%"
    },
    studentClassNo: {
        backgroundColor: "rgba(237, 237, 237, 0.76)",
        padding: "1px",
        position: "absolute",
        bottom: 0,
        right: 0
    },
    studImage: {
        maxHeight: "85px",
        maxWidth: "100%",
        height: "auto",
        verticalAlign: "middle"
    },
    studName: {
        height: "3.4rem",
        width: "100%",
        padding: "5px",
        overflow: "hidden"
    },
    smallText: {
        fontSize: "10px",
        fontWeight: "bold"
    },
    notApproved: {
        backgroundColor: theme.palette.secondary.main
    }
});

class UserGrid extends React.Component {
    constructor(props) {
        super(props);

        this.onLoadImageError = this.onLoadImageError.bind(this);
    }

    onLoadImageError(ev) {
        const tmpPath =
            window.location.protocol +
            "//" +
            window.location.host +
            "/seating_plan/img/user_default.png";
        let target = ev.target;
        if (target.src !== tmpPath) target.src = tmpPath;
    }

    render() {
        const props = this.props;
        const data = props.data;

        return (
            <Card
                onClick={() => props.onClick({ uid: data.uid })}
                className={
                    props.viewMode != "desktop"
                        ? props.classes.mobileWrapper
                        : props.classes.wrapper
                }
            >
                <div className={props.classes.colInner}>
                    <div className={props.classes.studImgWrapper}>
                        <div className={props.classes.studentClass}>
                            {data.class}
                        </div>
                        <div className={props.classes.studentClassNo}>
                            {data["class_number"]}
                        </div>
                        <img
                            onError={this.onLoadImageError}
                            className={props.classes.studImage}
                            src={data.uri}
                        />
                    </div>
                    <div className={props.classes.studName}>
                        <div
                            className={classNames(
                                props.classes.smallText,
                                !data["isApproved"] && props.classes.notApproved
                            )}
                        >
                            {data["chi_name"]}
                            <br />
                            {data["eng_name"]}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default withStyles(styles)(UserGrid);

UserGrid.defaultProps = {
    data: {
        chi_name: "",
        eng_name: "",
        class: "",
        class_no: 0,
        student_number: "0",
        photo_path: "",
        uid: 0
    },
    onClick: () => {}
};
