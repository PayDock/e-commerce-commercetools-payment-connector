import React, { useState, useEffect } from 'react';

import Text from '@commercetools-uikit/text';
import {Pagination} from '@commercetools-uikit/pagination';
import messages from './messages';
import styles from './log.module.css';
import './log.css';
import axios from 'axios';
import moment from 'moment';
import {ContentNotification} from "@commercetools-uikit/notifications";
import CommerceToolsAPIAdapter from '../../commercetools-api-adaptor';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';

const LogsHistory = () => {
    const env = useApplicationContext(
      (context) => context.environment
    );
    const apiAdapter = new CommerceToolsAPIAdapter(env);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [currentRows, setCurrentRows] = useState([]);
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const columns = [
        {key: 'date', label: 'Date'},
        {key: 'operation_id', label: 'Paydock Charge ID'},
        {key: 'operation', label: 'Operation'},
        {key: 'status', label: 'Status'},
        {key: 'message', label: 'Message'},
    ];

    const [page, changePage] = useState(1);
    const [perPage, changePerPage] = useState(20);

    const lastRowIndex = page * perPage;
    const firstRowIndex = lastRowIndex - perPage;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                let logs = await apiAdapter.getLogs();
                setRows(logs);
                setCurrentRows(logs.slice(firstRowIndex, lastRowIndex));
            } catch (error) {
                setError({ message: `Error: ${error.message}` });
            }
        };

        fetchLogs();
    }, []);

    useEffect(() => {
        const lastRowIndex = page * perPage;
        const firstRowIndex = lastRowIndex - perPage;

        if (sortedColumn) {
            const sortedRows = [...rows].sort((a, b) => {
                const aValue = a[sortedColumn];
                const bValue = b[sortedColumn];
                if (sortOrder === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            setCurrentRows(sortedRows.slice(firstRowIndex, lastRowIndex));
        } else {
            setCurrentRows(rows.slice(firstRowIndex, lastRowIndex));
        }
    }, [rows, page, perPage, sortedColumn, sortOrder, firstRowIndex, lastRowIndex]);

    const handleSort = (column) => {
        if (column === 'message') return;

        if (sortedColumn === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortedColumn(column);
            setSortOrder('asc');
        }
    };

    return (
        <>
            <div className={styles.paySettingsHead}>
                <Text.Headline as="h1" intlMessage={messages.pageTitle}/>
                {error && (
                    <ContentNotification type="error">{error.message}</ContentNotification>
                )}
            </div>

            <div className="table-wrap">
                <table className='table-logs'>
                    <thead>
                    <tr>
                        {columns.map((column) => {
                            return <th 
                                className={column.key} 
                                key={column.key}
                                onClick={() => handleSort(column.key)}
                            >
                                {column.label}
                                {sortedColumn === column.key ? (
                                    <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                ) : (
                                    column.key !== 'message' && (<span className='sort-default'>⇅</span>)
                                )}
                            </th>
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {currentRows.map((d, i) => (
                      <tr key={i}>
                          <td className="date">{moment(d.date).format('YYYY-MM-DD HH:mm:ss')}</td>
                          <td className="operation_id">{d.operation_id}</td>
                          <td className="operation">{d.operation}</td>
                          <td className={`status ${d.status?.toLowerCase().replace(/\s+/g, '-')}`}><span>{d.status}</span></td>
                          <td className="message">{d.message}</td>
                      </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                totalItems={rows.length}
                page={page}
                perPageRange="s"
                onPageChange={(nextPage) => {
                    changePage(nextPage);
                }}
                perPage={perPage}
                onPerPageChange={(nextPerPage) => {
                    changePerPage(nextPerPage);
                    changePage(1);
                }}
            />

        </>
    );
};

LogsHistory.displayName = 'LogsHistory';

export default LogsHistory;
