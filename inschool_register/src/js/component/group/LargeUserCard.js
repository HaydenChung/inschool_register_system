import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHead from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme)=> ({
    'cardMedia': {
        height: '50vh',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
    },
    'image': {
        height: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
    },
    'inlineTypo': {
        display: 'inline-block',
    },
    'halfSpan': {
        display: 'inline-block',
        width: '49%',
        whiteSpace: 'nowrap',
    },
    'card': {
        // maxWidth: '80%',
        // maxHeight: '80vh',
        // minWidth: '70%',
        display: 'flex',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
});

class LargeUserCard extends React.Component {
    constructor(props) {
        super(props);

        this.onLoadImageError = this.onLoadImageError.bind(this);

    }

    onLoadImageError(ev) {
        const tmpPath = window.location.protocol + '//' + window.location.host + '/seating_plan/img/stud_default.jpg'
        let target = ev.target;
        if(target.src !== tmpPath) target.src = tmpPath;
    }

    render() {

        const props = this.props;

        return(
            <Card className={props.classes.card} >
                {/* <CardHead></CardHead> */}
                <CardMedia
                    className={props.classes.cardMedia}
                    title="Student Photo"
                >
                    <img onError={this.onLoadImageError} src={props.image} className={props.classes.image}></img>
                </CardMedia>
                <CardContent>
                    <div>
                        <span className={props.classes.halfSpan}>
                            <Typography  className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>Class:</Typography>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>{props['class']}</Typography>
                        </span>
                        <span className={props.classes.halfSpan}>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>Chinese Name:</Typography>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>{props['chi_name']}</Typography>
                        </span>
                    </div>
                    <div>
                        <span className={props.classes.halfSpan}>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>Class No.:</Typography>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>{props['class_number']}</Typography>
                        </span>
                        <span className={props.classes.halfSpan}>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>English Name:</Typography>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>{props['eng_name']}</Typography>
                        </span>
                    </div>

                    <div>
                        <span className={props.classes.halfSpan}>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>Student Number:</Typography>
                            <Typography className={props.classes.inlineTypo} variant={'display1'} noWrap={true}>{props['student_no']}</Typography>
                        </span>
                    </div>

                </CardContent>
            </Card>
        );
    }
}

export default withStyles(styles)(LargeUserCard);

LargeUserCard.defaultProps = {
    chi_name: "",
    class: "",
    class_number: "",
    eng_name: "",
    name: "",
    role_id: "",
    uid: "",
    image: ""
};
