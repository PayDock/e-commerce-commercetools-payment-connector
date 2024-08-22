import React, { useState, useEffect } from 'react';
import Text from '@commercetools-uikit/text';
import {Pagination} from '@commercetools-uikit/pagination';
import messages from './messages';
import styles from './log.module.css';
import './order.css';
import moment from 'moment';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import {ContentNotification} from '@commercetools-uikit/notifications';
import NumberField from '@commercetools-uikit/number-field';
import PulseLoader from 'react-spinners/PulseLoader';
import CommerceToolsAPIAdapter from '../../commercetools-api-adaptor';
import {useApplicationContext} from '@commercetools-frontend/application-shell-connectors';
import RefundIcon from './RefundIcon';
import CapturedIcon from './CapturedIcon';

const OrdersHistory = () => {
    const env = useApplicationContext(
        (context) => context.environment
    );
    const apiAdapter = new CommerceToolsAPIAdapter(env);
    const [error, setError] = useState(null);
    const [rows, setRows] = useState([]);
    const [currentRows, setCurrentRows] = useState([]);
    const [rowErrors, setRowErrors] = useState({});
    const [rowSuccess, setRowSuccess] = useState({});
    const [typedAmountRefund, setTypedAmountRefund] = useState({});
    const [updateAmountRefund, setUpdateAmountRefund] = useState({});
    const [changeStatus, setChangeStatus] = useState({});
    const [changeDate, setChangeDate] = useState({});
    const [isVisibleInputRefaund, setIsVisibleInputRefaund] = useState({});
    const [typedAmountCaptured, setTypedAmountCaptured] = useState({});
    const [isVisibleInputCapturedAmount, setVisibleInputCapturedAmount] = useState({});
    const [updateAmountCaptured, setUpdateAmountCaptured] = useState({});


    const [isVisibleRefundButtons, setIsVisibleRefundButtons] = useState({});
    const [isVisibleAuthorizedButtons, setIsVisibleAuthorizedButtons] = useState({});
    const [statusUpdated, setStatusUpdated] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [status, setStatus] = useState(null);
    const [statusName, setStatusName] = useState({});
    const [dateUpdated, setDateUpdated] = useState({});
    const [type, setType] = useState(null);
    const [captured, setCaptured] = useState(null);
    const [refund, setRefund] = useState(null);
    const [loading, setLoading] = useState({});
    const [sortedColumn, setSortedColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const requestUpdateOrder = async (id, status, operation_amount = null, updated_at) => {

        const requestData = {
            orderId: id,
            newStatus: status,
            newDate: updated_at,
        };

        if (operation_amount !== null) {
            if (status === 'paydock-paid' || status === 'paydock-p-paid') {
                requestData.capturedAmount = operation_amount;
            } else {
                requestData.refundAmount = operation_amount;
            }
        }
        let result = await apiAdapter.updateOrderStatus(requestData);
        if (result.success) {
            setStatusUpdated(true);
            setRowSuccess(prevState => ({
                ...prevState,
                [id]: true,
            }));
        } else {
            setRowErrors(prevState => ({
                ...prevState,
                [id]: {message: result.message},
            }));
            setLoading(prevState => ({
                ...prevState,
                [id]: false,
            }));
        }
    };

    useEffect(() => {
        if (statusUpdated) {
            setChangeStatus(prevState => ({
                ...prevState,
                [orderId]: status,
            }));
            setStatusName(prevState => ({
                ...prevState,
                [orderId]: statusName,
            }));
            setChangeDate(prevState => ({
                ...prevState,
                [orderId]: dateUpdated,
            }));
            if (type === 'cancel-authorize') {
                setIsVisibleAuthorizedButtons(prevState => ({
                    ...prevState,
                    [orderId]: false,
                }));
            }
            if (type === 'capture') {
                setIsVisibleRefundButtons(prevState => ({
                    ...prevState,
                    [orderId]: true,
                }));
                setIsVisibleInputRefaund(prevState => ({
                    ...prevState,
                    [orderId]: false,
                }));
                setIsVisibleAuthorizedButtons(prevState => ({
                    ...prevState,
                    [orderId]: false,
                }));
            }

            if (type === 'submit-captured') {
                setUpdateAmountCaptured(prevState => ({
                    ...prevState,
                    [orderId]: captured,
                }));

                setIsVisibleAuthorizedButtons(prevState => ({
                    ...prevState,
                    [orderId]: false,
                }));

                setVisibleInputCapturedAmount(prevState => ({
                    ...prevState,
                    [orderId]: false,
                }));

                setIsVisibleRefundButtons(prevState => ({
                    ...prevState,
                    [orderId]: true,
                }));
            }

            if (type === 'cancel') {
                setIsVisibleRefundButtons(prevState => ({
                    ...prevState,
                    [orderId]: false,
                }));
            }
            if (type === 'submit-refund') {
                setUpdateAmountRefund(prevState => ({
                    ...prevState,
                    [orderId]: refund,
                }));
                if (status === 'paydock-refunded') {
                    setIsVisibleRefundButtons(prevState => ({
                        ...prevState,
                        [orderId]: false,
                    }));
                } else {
                    setIsVisibleInputRefaund(prevState => ({
                        ...prevState,
                        [orderId]: false,
                    }));
                    setTypedAmountRefund({});
                }
            }
            setStatusUpdated(false);
            setLoading(prevState => ({
                ...prevState,
                [orderId]: false,
            }));
        }
    }, [statusUpdated, statusName, orderId, status, type, refund, dateUpdated]);

    const handleOrderAction = (type, id, amount = null, refund_amount = null) => {
        if (type == 'refund-btn') {
            setIsVisibleInputRefaund(prevState => ({
                ...prevState,
                [id]: true,
            }));
        } else if (type == 'cancel-refund') {
            setIsVisibleInputRefaund(prevState => ({
                ...prevState,
                [id]: false,
            }));
        } else if (type == 'captured-btn') {
            setVisibleInputCapturedAmount(prevState => ({
                ...prevState,
                [id]: true,
            }));
        } else if (type == 'cancel-partial-captured') {
            setVisibleInputCapturedAmount(prevState => ({
                ...prevState,
                [id]: false,
            }));
        }

        if (rowSuccess) {
            setRowSuccess(prevState => ({
                ...prevState,
                [id]: false,
            }));
        }
        if (rowErrors) {
            setRowErrors(prevState => ({
                ...prevState,
                [id]: false,
            }));
        }

        let newDates = moment().format('YYYY-MM-DD HH:mm:ss');
        if (type === 'capture' || type === 'cancel-authorize') {
            const newStatus = type === 'capture' ? 'paydock-paid' : 'paydock-cancelled';
            const newStatusName = type === 'capture' ? 'Paid via Paydock' : 'Cancelled via Paydock';

            setLoading(prevState => ({
                ...prevState,
                [id]: true,
            }));

            setType(type);
            setStatus(newStatus);
            setStatusName(newStatusName)
            setOrderId(id);
            setDateUpdated(newDates);

            requestUpdateOrder(id, newStatus, null, newDates);
        }

        if (type === 'submit-captured') {
            let capturedAmount;
            if(typeof typedAmountCaptured[id] === 'undefined'){
                capturedAmount = amount;
            }else{
                capturedAmount = parseFloat(Number(typedAmountCaptured[id]).toFixed(2));
            }
            if (capturedAmount <= 0 || capturedAmount > amount) return;

            setLoading(prevState => ({
                ...prevState,
                [id]: true,
            }));

            const newStatus = capturedAmount === amount ? 'paydock-paid' : 'paydock-p-paid';
            const newStatusName = newStatus === 'paydock-paid' ? 'Paid via Paydock' : 'Partial paid via Paydock';
            setType(type);
            setStatus(newStatus);
            setCaptured(capturedAmount);
            setStatusName(newStatusName)
            setOrderId(id);
            setDateUpdated(newDates);

            requestUpdateOrder(id, newStatus, capturedAmount, newDates);
        }


        if (type === 'cancel') {
            const newStatus = 'paydock-cancelled';
            const newStatusName = 'Cancelled via Paydock'

            setLoading(prevState => ({
                ...prevState,
                [id]: true,
            }));

            setType(type);
            setStatus(newStatus);
            setStatusName(newStatusName)
            setOrderId(id);
            setDateUpdated(newDates);

            requestUpdateOrder(id, newStatus, null, newDates);
        }

        if (type === 'submit-refund') {

            let refundAmount;
            let refundAmountUpdate;

            const typedAmount = parseFloat(Number(typedAmountRefund[id]).toFixed(2));
            if (typedAmount <= 0 || typedAmount > amount) return;

            if (updateAmountRefund[id] !== undefined) {
                refundAmountUpdate = parseFloat((Number(updateAmountRefund[id]) + Number(typedAmountRefund[id])).toFixed(2));
            } else {
                refundAmountUpdate = parseFloat(Number(typedAmountRefund[id]).toFixed(2)) || null;
            }

            if (refund_amount !== null && updateAmountRefund[id] === undefined) refundAmountUpdate = refundAmountUpdate + refund_amount;

            refundAmount = parseFloat(Number(typedAmountRefund[id]).toFixed(2)) || null;

            if (refundAmountUpdate > amount) return;

            setLoading(prevState => ({
                ...prevState,
                [id]: true,
            }));

            const newStatus = refundAmountUpdate === amount
                ? 'paydock-refunded'
                : (refundAmountUpdate < amount && refundAmountUpdate > 0)
                    ? 'paydock-p-refund'
                    : undefined;

            const newStatusName = newStatus === 'paydock-refunded' ? 'Refunded via Paydock' : 'Partial refunded via Paydock';
            setRefund(refundAmountUpdate);
            setType(type);
            setStatus(newStatus);
            setStatusName(newStatusName)
            setOrderId(id);
            setDateUpdated(newDates);

            requestUpdateOrder(id, newStatus, refundAmount, newDates);
        }
    };

    const handleTypedAmountRefund = (e, id) => {
        const value = e.target.value;
        setTypedAmountRefund({...typedAmountRefund, [id]: value});
    };

    const handleTypedAmountCaptured = (e, id) => {
        const value = e.target.value;
        setTypedAmountCaptured({...typedAmountCaptured, [id]: value});
    };

    const columns = [
        {key: 'id', label: 'Commercetools Order ID'},
        {key: 'paydock_transaction', label: 'Paydock Charge ID'},
        {key: 'billing_information', label: 'Billing information'},
        {key: 'shipping_information', label: 'Shipping information'},
        {key: 'amount', label: 'Amount'},
        {key: 'currency', label: 'Currency'},
        {key: 'payment_source_type', label: 'Payment Source Type'},
        {key: 'created_at', label: 'Creation date'},
        {key: 'updated_at', label: 'Last updated date'},
        {key: 'status', label: 'Status'},
        {key: 'action', label: 'Action'},
    ];

    const [page, changePage] = useState(1);
    const [perPage, changePerPage] = useState(20);

    const lastRowIndex = page * perPage;
    const firstRowIndex = lastRowIndex - perPage;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let orders = await apiAdapter.getOrders();
                setRows(orders);
                setCurrentRows(rows.slice(firstRowIndex, lastRowIndex));
            } catch (error) {
                setError({ message: `Error: ${error.message}` });
            }
        };

        fetchOrders();
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
        if (column === 'action') return;

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
                <table className="table-orders">
                    <thead>
                    <tr>
                        {columns.map((column) => {
                            return <th
                                className={column.key}
                                key={column.key}
                                onClick={(e) => handleSort(column.key)}
                            >
                                {column.label}
                                {sortedColumn === column.key ? (
                                    <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                                ) : (
                                    column.key !== 'action' && (<span className="sort-default">⇅</span>)
                                )}
                            </th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {currentRows.map((d, i) => (
                        <tr key={i}>
                            <td className="id">
                                <span className="mobile-label">{columns[0].label}:</span>
                                <a
                                    href={`${d.order_url}`}>{d.order_number ?? d.id}</a>
                            </td>
                            <td className="operation transaction">
                                <span className="mobile-label">{columns[1].label}:</span>
                                {d.paydock_transaction}
                            </td>
                            <td className="billing_information">
                                <span className="mobile-label">{columns[2].label}:</span>
                                {d.billing_information}
                            </td>
                            <td className="shipping_information">
                                <span className="mobile-label">{columns[3].label}:</span>
                                {d.shipping_information}
                            </td>
                            <td className="amount">
                                <span className="mobile-label">{columns[4].label}:</span>
                                 <span>
                                {changeStatus[d.order_number] === 'paydock-p-refund' || changeStatus[d.order_number] === 'paydock-refunded' || changeStatus[d.order_number] === 'paydock-p-paid' ? (
                                    changeStatus[d.order_number] === 'paydock-p-paid' ? (
                                        <>
                                            <span className="refund-base-amount">{d.amount}</span>
                                            {Math.round((d.amount - updateAmountCaptured[d.order_number]) * 100) / 100}<br/>
                                            <span className="captured-amount">
                                                <CapturedIcon/>
                                                &nbsp;{updateAmountCaptured[d.order_number]}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="refund-base-amount">{d.amount}</span>
                                            {Math.round((d.amount - updateAmountRefund[d.order_number]) * 100) / 100}<br/>
                                            <span className="refund">
                                                <RefundIcon/>
                                                &nbsp;{updateAmountRefund[d.order_number]}
                                            </span>
                                        </>
                                    )
                                ) : (
                                    d.status === 'paydock-p-refund' || d.status === 'paydock-refunded' || d.status === 'paydock-p-paid' ? (
                                            d.status === 'paydock-p-paid' ? (
                                                <>
                                                    <span className="refund-base-amount">{d.amount}</span>
                                                    {Math.round((d.amount - d.captured_amount) * 100) / 100}<br/>
                                                    <span className="captured-amount">
                                                        <CapturedIcon/>
                                                        &nbsp;{d.captured_amount}
                                                    </span>
                                                </>
                                            ) : (
                                        <>
                                            <span className="refund-base-amount">{d.amount}</span>
                                            {Math.round((d.captured_amount - d.refund_amount) * 100) / 100}<br/>
                                            <span className="refund">
                                                <RefundIcon/>
                                                &nbsp;{d.refund_amount}
                                            </span>
                                        </>
                                    )) : (
                                        <>{d.amount}</>
                                    )
                                )}
                            </span>
                            </td>
                            <td className="currency">
                                <span className="mobile-label">{columns[5].label}:</span>
                                AUD
                            </td>
                            <td className="payment-source">
                                <span className="mobile-label">{columns[6].label}:</span>
                                {d.payment_source_type}
                            </td>
                            <td className="date">
                                <span className="mobile-label">{columns[7].label}:</span>
                                {moment(d.created_at).format('YYYY-MM-DD HH:mm:ss')}
                            </td>
                            <td className="date updated_at">
                                <span className="mobile-label">{columns[8].label}:</span>
                                {changeDate[d.order_number] ? moment(changeDate[d.order_number]).format('YYYY-MM-DD HH:mm:ss') : moment(d.updated_at).format('YYYY-MM-DD HH:mm:ss')}
                            </td>
                            <td className={`status ${changeStatus[d.order_number] ? changeStatus[d.order_number] : d.status}`}>
                                <span className="mobile-label">{columns[9].label}:</span>
                                <span>{statusName[d.order_number] ? statusName[d.order_number] : d.statusName}</span>
                            </td>
                            <td className="action">
                                <div className="action-wrapper">
                                    <span className="mobile-label">{columns[10].label}:</span>
                                    {loading[d.order_number] ?
                                        <PulseLoader color={'#36d7b7'} loading={loading} size={10}/> : (
                                            <>
                                                {d.status === 'paydock-authorize' && isVisibleAuthorizedButtons[d.order_number] !== false && (

                                                    <>
                                                        {isVisibleInputCapturedAmount[d.order_number] ? (
                                                            <>
                                                                <NumberField
                                                                    title="amount"
                                                                    value={typedAmountCaptured[d.order_number] || d.possible_amount_captured.toFixed(2)}
                                                                    onChange={(e) => handleTypedAmountCaptured(e, d.order_number)}
                                                                    name="amount-captured"
                                                                    inputMode="decimal"
                                                                    isRequired={true}
                                                                />
                                                                <PrimaryButton
                                                                    label="Capture"
                                                                    onClick={() => handleOrderAction('submit-captured', d.order_number, d.amount, d.captured_amount)}
                                                                    isDisabled={
                                                                        (typedAmountCaptured[d.order_number] <= 0 ||
                                                                            typedAmountCaptured[d.order_number] > d.possible_amount_captured) ? true : false
                                                                    }
                                                                />
                                                                <SecondaryButton
                                                                    label="Cancel"
                                                                    onClick={() => handleOrderAction('cancel-partial-captured', d.order_number, d.possible_amount_captured)}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <PrimaryButton
                                                                    label="Capture Charge"
                                                                    onClick={() => handleOrderAction('captured-btn', d.order_number)}
                                                                />
                                                                <SecondaryButton
                                                                    label="Cancel Charge"
                                                                    onClick={() => handleOrderAction('cancel-authorize', d.order_number)}
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )}

                                                {(['paydock-paid', 'paydock-p-paid', 'paydock-p-refund', 'paydock-requested'].includes(d.status) || isVisibleRefundButtons[d.order_number]) && isVisibleRefundButtons[d.order_number] !== false && (
                                                    <>
                                                        {isVisibleInputRefaund[d.order_number] ? (
                                                            <>
                                                                <NumberField
                                                                    title="amount"
                                                                    value={typedAmountRefund[d.order_number] || ''}
                                                                    onChange={(e) => handleTypedAmountRefund(e, d.order_number)}
                                                                    name="amount-refund"
                                                                    isRequired={true}
                                                                />
                                                                { updateAmountCaptured[d.order_number] ? (
                                                                <PrimaryButton
                                                                    label="Refund"
                                                                    onClick={() => handleOrderAction('submit-refund', d.order_number, updateAmountCaptured[d.order_number], d.refund_amount)}
                                                                    isDisabled={
                                                                        (typedAmountRefund[d.order_number] <= 0 ||
                                                                            typedAmountRefund[d.order_number] > updateAmountCaptured[d.order_number] ||
                                                                            (typedAmountRefund[d.order_number] > (updateAmountRefund[d.order_number] !== undefined ? updateAmountCaptured[d.order_number] - updateAmountRefund[d.order_number] : updateAmountCaptured[d.order_number] - d.refund_amount))) ? true : false
                                                                    }
                                                                />
                                                                    ) :
                                                                    (
                                                                        <PrimaryButton
                                                                            label="Refund"
                                                                            onClick={() => handleOrderAction('submit-refund', d.order_number, d.captured_amount, d.refund_amount)}
                                                                            isDisabled={
                                                                                (typedAmountRefund[d.order_number] <= 0 ||
                                                                                    typedAmountRefund[d.order_number] > d.captured_amount ||
                                                                                    (typedAmountRefund[d.order_number] > (updateAmountRefund[d.order_number] !== undefined ? d.captured_amount - updateAmountRefund[d.order_number] : d.captured_amount - d.refund_amount))) ? true : false
                                                                            }
                                                                        />
                                                                    )}
                                                                <SecondaryButton
                                                                    label="Cancel Charge"
                                                                    onClick={() => handleOrderAction('cancel-refund', d.order_number)}
                                                                />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <SecondaryButton
                                                                    label="Refund"
                                                                    onClick={() => handleOrderAction('refund-btn', d.order_number)}
                                                                />

                                                                {d.status !== 'paydock-refunded' && (
                                                                    <PrimaryButton
                                                                        label="Cancel Charge"
                                                                        onClick={() => handleOrderAction('cancel', d.order_number)}
                                                                    />
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                </div>
                                {rowErrors[d.order_number] && (
                                    <div className="error-notification">
                                        <ContentNotification
                                            type="error">{rowErrors[d.order_number].message}</ContentNotification>
                                    </div>
                                )}
                                {rowSuccess[d.order_number] && (
                                    <div className="success-notification">
                                        <ContentNotification type="success">Updated successfully!</ContentNotification>
                                    </div>
                                )}
                            </td>
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

OrdersHistory.displayName = 'OrdersHistory';

export default OrdersHistory;
