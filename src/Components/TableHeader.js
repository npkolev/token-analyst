import React, { PureComponent } from 'react';
import { react as autoBind } from 'auto-bind';

import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';


class TableHeader extends PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    static propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    desc(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = this.props;
        const createSortHandler = property => event => {
            onRequestSort(event, property);
        };

        const headRows = [
            { id: 'token', numeric: false, disablePadding: true, label: 'Token Name' },
            { id: 'current_24h_count', numeric: true, disablePadding: false, label: 'Current Transaction Count (24h)' },
            { id: 'count_percent_change', numeric: true, disablePadding: false, label: 'Transaction Count Change (%)' },
            { id: 'prior_24h_count', numeric: true, disablePadding: false, label: 'Prior Transaction Count (24h)' },
            { id: 'current_24h', numeric: true, disablePadding: false, label: 'Current Trade Volume (24h)' },
            { id: 'current_24h_usd', numeric: true, disablePadding: false, label: 'Current Trade Volume USD (24h)' },
            { id: 'percent_change', numeric: true, disablePadding: false, label: 'Trade Volume Change' },
            { id: 'prior_24h', numeric: true, disablePadding: false, label: 'Prior Trade Volume (24h)' },
            { id: 'prior_24h_usd', numeric: true, disablePadding: false, label: 'Prior Trade Volume USD (24h)' },
        ];

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'Select all tokens' }}
                        />
                    </TableCell>
                    {headRows.map(row => (
                        <TableCell
                            key={row.id}
                            align={row.numeric ? 'right' : 'left'}
                            padding={row.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === row.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === row.id}
                                direction={order}
                                onClick={createSortHandler(row.id)}
                            >
                                {row.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        )
    }

}

export default TableHeader;
