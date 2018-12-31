import React from "react";
// import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
// import Toolbar from '@material-ui/core/Toolbar';
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Checkbox from "@material-ui/core/Checkbox";

import classNames from "classnames";

import NewTableRow from "../item/NewTableRow";
import NewTablePaginationActions from "../item/NewTablePaginationActions";

import { ArraySort } from "../../utils";
import { withUserConfig } from "../context";

const styles = theme => ({
    selectedRow: {
        backgroundColor: "#b7d6e4 !important"
    },
    stickyHead: {
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    tableCellFont: {
        fontSize: "0.6rem"
    },
    desktopCellFont: {
        fontSize: "1.1rem"
    },
    minPadding: {
        padding: "4px 44px 4px 18px"
    },
    laptopPadding: {
        padding: "4px 22px 4px 9px"
    },
    tableWrapper: {
        flex: 1
    },
    tableInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: "1px solid #ced4da",
        fontSize: 16,
        padding: "10px 12px",
        width: "2.6rem"
    },
    tableCaptionWrapper: {
        display: "flex",
        justifyContent: "space-between"
    },
    topRightActionWrapper: {
        margin: "0 1rem"
    }
});

class NewTable extends React.Component {
    constructor(props) {
        super(props);

        this.reOrder = true;

        this.state = {
            resetSelected: false,
            orderByIndex: null,
            orderBy: null,
            order: "desc",
            dataVer: 0,
            pagination: null,
            checkAllBox: false
        };

        this.inputOnChangeHandler = this.inputOnChangeHandler.bind(this);
        this.checkAllBoxOnClickHandler = this.checkAllBoxOnClickHandler.bind(
            this
        );
    }

    checkAllBoxOnClickHandler(ev) {
        // console.log('is checked', ev.target.checked);
        this.props.checkAllBoxHandler(ev.target.checked);
        // this.setState({ checkAllBox: !this.state.checkAllBox });
    }

    headerOnClickHandler(index) {
        if (typeof this.sorter == "undefined")
            this.sorter = new ArraySort({ input: this.props.data.slice() });

        let curIndex = index;
        let orderBy = "";
        let order =
            index == this.state.orderByIndex
                ? this.state.order == "asc"
                    ? "desc"
                    : "asc"
                : "desc";

        Object.keys(this.props.data[0]).some((key, i) => {
            if (this.props.hiddenField.indexOf(key) != -1) curIndex++;
            if (i == curIndex) return (orderBy = key);
        });

        if (this.reOrder) {
            this.reOrder = false;
            const newData = this.sorter.settle({ sortBy: orderBy, order });
            this.orderedData = newData;
        }
        this.setState({ orderByIndex: index, orderBy, order });
    }

    inputOnChangeHandler(rowId, itemName, item, ev) {
        // this.state.data[rowIndex][itemName] = ev.target.value;
        // this.setState({data: this.state.data});
        if (typeof this.props.inputOnChangeHandler == "function")
            this.props.inputOnChangeHandler(rowId, itemName, item, ev);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data != nextProps.data) {
            this.sorter = new ArraySort({ input: nextProps.data.slice() });
            if (nextState.orderBy != null)
                this.orderedData = this.sorter.settle({
                    sortBy: nextState.orderBy,
                    order: nextState.order
                });
            return true;
        }
        if (
            this.state.orderBy != nextState.orderBy ||
            this.state.order != nextState.order
        )
            this.reOrder = true;

        const doubleCheckItem = [
            "hiddenField",
            "headerNames",
            "rowOnClickPassInItemKey",
            "selectedId",
            "foucSelected",
            "inputField"
        ];
        let cost = null;
        let propsChanged = Object.keys(nextProps).some(key => {
            if (nextProps[key] != this.props[key]) {
                if (doubleCheckItem.indexOf(key) != -1) {
                    if (typeof nextProps[key] == "function")
                        return (
                            JSON.stringify(nextProps[key]) ==
                            JSON.stringify(this.props[key])
                        );

                    if (
                        !nextProps[key] ||
                        !this.props[key] ||
                        nextProps[key].length != this.props[key].length
                    )
                        return true;

                    return Object.keys(nextProps[key]).some(innerKey => {
                        if (
                            nextProps[key][innerKey] !=
                            this.props[key][innerKey]
                        ) {
                            cost = "props" + key + innerKey;
                            return true;
                        }
                    });
                } else {
                    cost = "props" + key;
                    return true;
                }
            }
        });

        let stateChanged = Object.keys(nextState).some(key => {
            if (nextState[key] != this.state[key]) {
                if (doubleCheckItem.indexOf(key) != -1) {
                    if (typeof nextState[key] == "function")
                        return (
                            JSON.stringify(nextState[key]) ==
                            JSON.stringify(this.state[key])
                        );

                    if (
                        !nextState[key] ||
                        !this.state[key] ||
                        nextState[key].length != this.state[key].length
                    )
                        return true;

                    return Object.keys(nextState[key]).some(innerKey => {
                        if (
                            nextState[key][innerKey] !=
                            this.state[key][innerKey]
                        ) {
                            cost = "state" + key + innerKey;
                            return true;
                        }
                    });
                } else {
                    cost = "state" + key;
                    return true;
                }
            }
        });

        return propsChanged || stateChanged;

        // return true;
    }

    render() {

        let data = this.props.data;

        const cellPadding = this.props.classes.laptopPadding;
        const cellFont =
            this.props.userConfig.viewMode == "table"
                ? this.props.classes.tableCellFont
                : this.props.classes.desktopCellFont;

        if (this.state.orderByIndex != null) {
            data = this.orderedData;
        }

        let headers = [];
        if(typeof this.props.headerNames == 'undefined') {
            const sample = data.slice(0, 10);

            headers = sample.reduce((collection, row)=> {
                Object.keys(row).forEach((key)=> {
                    if(this.props.hiddenField.indexOf(key) != -1 || collection.indexOf(key) != -1) return;
                    collection.push(key);
                });
                return collection;
            }, []);

        }else {
            headers = this.props.headerNames;
        }

        const headerCells = headers.map((name, index) => {
            const ordering = index === this.state.orderByIndex;
            return (
                <TableCell
                    className={classNames(
                        this.props.classes.stickyHead,
                        cellPadding
                    )}
                    key={index}
                >
                    {this.props.sortable ? (
                        <Tooltip
                            title="Sort"
                            placement={"bottom-end"}
                            enterDelay={300}
                        >
                            <TableSortLabel
                                direction={this.state.order}
                                onClick={this.headerOnClickHandler.bind(
                                    this,
                                    index
                                )}
                                active={ordering}
                                // className={classNames(cellFont)}
                            >
                                {name}
                            </TableSortLabel>
                        </Tooltip>
                    ) : (
                        name
                    )}
                </TableCell>
            );
        });

        if (this.props.withCheckbox && headerCells.length != 0) {
            headerCells.unshift(
                <TableCell
                    className={classNames(
                        this.props.classes.stickyHead,
                        cellPadding
                    )}
                    key={headerCells.length}
                >
                    <Checkbox
                        // checked={this.state.checkAllBox}
                        checked={this.props.data.length == this.props.checkedId.length}
                        onChange={this.checkAllBoxOnClickHandler}
                    />
                </TableCell>
            );
        }

        const propSelectedId = Array.isArray(this.props.selectedId)
            ? this.props.selectedId
            : [this.props.selectedId];

        const propCheckedId = Array.isArray(this.props.checkedId)
            ? this.props.checkedId
            : [this.props.checkedId];

        const rows = data.map((row, rowIndex) => {
            const selected =
                this.props.reset == false
                    ? false
                    : propSelectedId.indexOf(row[this.props.rowIdName]) != -1;

            const checked =
                propCheckedId.indexOf(row[this.props.rowIdName]) != -1;

            const handlerParams = {};
            this.props.rowOnClickPassInItemKey.forEach(
                key => (handlerParams[key] = row[key])
            );

            return (
                <NewTableRow
                    key={rowIndex}
                    id={row[this.props.rowIdName]}
                    rowOnClickHandler={ev =>
                        this.props.rowOnClickHandler(handlerParams, ev)
                    }
                    hover={this.props.hoverable}
                    selected={selected}
                    className={selected ? this.props.classes.selectedRow : ""}
                >
                    {this.props.withCheckbox === true ? (
                        <TableCell
                            className={classNames(cellFont, cellPadding)}
                        >
                            <Checkbox
                                checked={checked}
                                onClick={ev => ev.stopPropagation()}
                                onChange={ev => {
                                    this.props.checkboxOnChangeHandler(
                                        handlerParams,
                                        ev
                                    );
                                }}
                            />
                        </TableCell>
                    ) : null}
                    {Object.keys(row).map((key, itemIndex) => {
                        if (this.props.hiddenField.indexOf(key) != -1) return;
                        // const inputIndex = this.props.inputField.indexOf(key);
                        const inputIndex = key;
                        const inputOption =
                            // inputIndex == -1 ||
                            typeof this.props.inputOptions == "undefined" ||
                            typeof this.props.inputOptions[inputIndex] ==
                                "undefined"
                                // ? {}
                                ? undefined
                                : this.props.inputOptions[inputIndex];

                        const cellOptions = this.props.cellOptions.length != 0 && typeof this.props.cellOptions[rowIndex][itemIndex] != 'undefined' ? this.props.cellOptions[rowIndex][itemIndex] : {};

                        return (
                            <TableCell
                                className={classNames(cellFont, cellPadding)}
                                {...cellOptions}
                                key={itemIndex}
                            >
                                {/* {inputIndex != -1 ? ( */}
                                {this.props.inputField.indexOf(key) != -1 ? (
                                    <Input
                                        onChange={event =>
                                            this.inputOnChangeHandler(
                                                row[this.props.rowIdName],
                                                key,
                                                row,
                                                event
                                            )
                                        }
                                        className={
                                            this.props.classes.tableInput
                                        }
                                        disableUnderline={true}
                                        value={data[rowIndex][key] || ""}
                                        {...inputOption}
                                    />
                                ) : (
                                    row[key]
                                )}
                            </TableCell>
                        );
                    })}
                </NewTableRow>
            );
        });

        const pagerOptions = this.props.pagerOptions;

        const tableFooter =
            this.props.pagination == true ||
            this.props.tableActionWrapper != null ? (
                <TableFooter>
                    <TableRow>
                        {this.props.tableActionWrapper == null
                            ? null
                            : this.props.tableActionWrapper}
                        {this.props.pagination === true ? (
                            <TablePagination
                                // colSpan={3}
                                count={pagerOptions.totalLength}
                                rowsPerPage={pagerOptions.rowsPrePage}
                                page={pagerOptions.pageIndex}
                                onChangePage={pagerOptions.onChangePage}
                                onChangeRowsPerPage={
                                    pagerOptions.onChangeRowsPerPage
                                }
                                rowsPerPageOptions={
                                    pagerOptions.rowsPerPageOptions
                                }
                                ActionsComponent={NewTablePaginationActions}
                            />
                        ) : null}
                    </TableRow>
                </TableFooter>
            ) : null;

        return (
            <div
                className={classNames(
                    this.props.classes.tableWrapper,
                    this.props.className
                )}
            >
                <div className={this.props.classes.tableCaptionWrapper}>
                    {this.props.titleName ? (
                        <Typography variant="title" color="inherit">
                            {this.props.titleName}
                        </Typography>
                    ) : null}
                    {this.props.topRightActionWrapper ? (
                        <div
                            className={this.props.classes.topRightActionWrapper}
                        >
                            {this.props.topRightActionWrapper}
                        </div>
                    ) : null}
                </div>

                <Table>
                    <TableHead>
                        <TableRow>{headerCells}</TableRow>
                    </TableHead>
                    <TableBody>{rows}</TableBody>
                    {tableFooter}
                </Table>
            </div>
        );
    }
}

NewTable.defaultProps = {
    hiddenField: [],
    inputField: [],
    rowOnClickPassInItemKey: [],
    rowOnClickHandler: function() {},
    selectedId: [],
    sortable: true,
    hoverable: true,
    tableActionWrapper: null,
    pagination: false,
    className: null,
    cellOptions: [],
};

export default withStyles(styles)(withUserConfig(NewTable));
