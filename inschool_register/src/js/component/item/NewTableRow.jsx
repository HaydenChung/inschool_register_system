import React from 'react';
import TableRow from "@material-ui/core/TableRow";

const NewTableRow = (props) => {

    return (
        <TableRow className={props.className} hover={props.hover} selected={props.selected} onClick={props.rowOnClickHandler}>
            {props.children}
        </TableRow>
    );
}

export default NewTableRow;