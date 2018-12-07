import React from 'react';
import Card from "@material-ui/core/Card";
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

import { withRouter } from "react-router-dom";


const NavBlock = (props)=> (
    <Card>
        <CardActions>
            <Button variant="contained" onClick={()=> props.history.push('/firstpage')} >First</Button>
            <Button variant="contained" onClick={()=> props.history.push('/secondpage')} >Second</Button>
            <Button variant="contained" onClick={()=> props.history.push('/thirdpage')} >Last</Button>
        </CardActions>

    </Card>
);

export default withRouter(NavBlock);