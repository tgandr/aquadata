import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate, IconContainer } from './utils';
import { Chart, registerables } from 'chart.js';


Chart.register(...registerables);

const ReportFinancial = () => {
    const financial = JSON.parse(localStorage.getItem('financial'));
    const [organizedData, setOrganizedData] = useState({});
    const [show, setShow] = useState({
        jan: false,
        feb: false,
        mar: false,
        apr: false,
        may: false,
        jun: false,
        jul: false,
        aug: false,
        sep: false,
        oct: false,
        nov: false,
        dec: false,
    });

    const months = [
        ["Janeiro", "jan", "2024-01"],
        ["Fevereiro", "feb", "2024-02"],
        ["Março", "mar", "2024-03"],
        ["Abril", "apr", "2024-04"],
        ["Maio", "may", "2024-05"],
        ["Junho", "jun", "2024-06"],
        ["Julho", "jul", "2024-07"],
        ["Agosto", "aug", "2024-08"],
        ["Setembro", "sep", "2024-09"],
        ["Outubro", "oct", "2024-10"],
        ["Novembro", "nov", "2024-11"],
        ["Dezembro", "dec", "2024-12"]
    ];

    useEffect(() => {
        if (financial) {
            const organized = organizeByMonth(financial);
            const organizedObj = {};
            organized.forEach(item => {
                organizedObj[item.month] = item;
            });
            setOrganizedData(organizedObj);
        }
    }, []);

    const chartInstances = useRef({});

    function organizeByMonth(data) {
        const result = {};

        function addToMonth(month, category, item) {
            if (!result[month]) {
                result[month] = { purchases: [], payroll: [], payments: [] };
            }
            result[month][category].push(item);
        }

        function extractMonth(dateString) {
            return dateString ? dateString.slice(0, 7) : "unknown";
        }

        data.feedPurchase && data.feedPurchase.forEach(purchase => {
            const month = extractMonth(purchase?.date || '');
            addToMonth(month, 'purchases', { ...purchase, category: 'Ração' });
        });

        data.postLarvaePurchase && data.postLarvaePurchase.forEach(purchase => {
            const month = extractMonth(purchase?.date || '');
            addToMonth(month, 'purchases', { ...purchase, category: 'Pós-Larvas' });
        });

        data.probioticsPurchase && data.probioticsPurchase.forEach(purchase => {
            const month = extractMonth(purchase?.date || '');
            addToMonth(month, 'purchases', { ...purchase, category: 'Probióticos' });
        });

        data.fertilizersPurchase && data.fertilizersPurchase.forEach(purchase => {
            const month = extractMonth(purchase?.date || '');
            addToMonth(month, 'purchases', { ...purchase, category: 'Fertilizantes' });
        });

        data.othersPurchase && data.othersPurchase.forEach(purchase => {
            const month = extractMonth(purchase?.date || '');
            addToMonth(month, 'purchases', { ...purchase, category: 'Outros' });
        });

        data.payments && data.payments.forEach(payment => {
            const month = payment.month;
            addToMonth(month, 'payments', payment);
        });

        data.labor && data.labor.forEach(labor => {
            const month = labor.month;
            addToMonth(month, 'payroll', labor);
        });

        const resultArray = Object.keys(result).map(month => ({ month, ...result[month] }));

        return resultArray;
    }

    function calculateTotal(purchases) {
        return purchases.reduce((total, purchase) => {
            if ("purchaseId" in purchase) {
                if (purchase.purchaseId.purchase === 'ration') {
                    return total + (parseFloat(purchase.bagQuantity) * parseFloat(purchase.value));
                }
            }
            return total + (parseFloat(purchase.quantity) * parseFloat(purchase.value));
        }, 0);
    }

    function calculatePaymentsTotal(payments) {
        return payments.reduce((total, payment) => {
            const energiaTotal = payment.energia ? payment.energia.reduce((sum, e) => sum + parseFloat(e.value), 0) : 0;
            const servicosTotal = payment.servicos ? payment.servicos.reduce((sum, s) => sum + parseFloat(s.value), 0) : 0;
            const outrosTotal = payment.outros ? payment.outros.reduce((sum, o) => sum + parseFloat(o.value), 0) : 0;

            return parseFloat(total) + parseFloat(energiaTotal) + parseFloat(servicosTotal) + parseFloat(outrosTotal);
        }, 0);
    }

    function calculatePayrollTotal(payroll) {
        return payroll.reduce((total, pay) => {
            return parseFloat(total) + (pay.payroll.reduce((sum, p) => sum + parseFloat(p.salary), 0) || 0); // Garantindo que o valor seja um número ou 0
        }, 0);
    }

    const isAnyMonthExpanded = () => {
        return Object.values(show).some(value => value);
    };

    const destroyChartInstance = (month) => {
        if (chartInstances.current[month]) {
            chartInstances.current[month].destroy();
            delete chartInstances.current[month];
        }
    };

    const MonthlyCharts = ({ data }) => {
        useEffect(() => {
            return () => {
                destroyChartInstance(data.month);
            };
        }, [data.month]);

        const chartData = {
            labels: ['Compras\nde insumos', 'Pagamentos\ne serviços', 'Mão-de-obra'],
            datasets: [
                {

                    backgroundColor: ['#FB923C', '#93C5FD', '#EF4444'],
                    borderColor: 'rgba(0, 0, 0, 0)',
                    borderWidth: 0,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [
                        calculateTotal(data.purchases),
                        calculatePaymentsTotal(data.payments),
                        calculatePayrollTotal(data.payroll),
                    ],
                },
            ],
        };

        const chartOptions = {
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: '#1E3A8A', 
                    },
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.raw.toFixed(2)} `; 
                        }
                    },
                    bodyColor: '#1E3A8A',
                }
            },

            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 10,
                    bottom: 10
                }
            },

            scales: {
                y: {
                    ticks: {
                        display: false, 
                        color: '#1E3A8A',
                    },
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                },
                x: {
                    ticks: {
                        beginAtZero: true,
                        color: '#1E3A8A',
                        callback: function (value, index, values) {
                            const label = chartData.labels[index];
                            if (typeof label === 'string') {
                                return label.split('\n'); // Remove quebras de linha ao renderizar ticks no eixo x
                            }
                            return label;
                        }
                    },
                    grid: {
                        color: '#93C5FD',
                    },
                },
            },
        };

        const customDataLabelsPlugin = {
            id: 'customDataLabelsPlugin',
            afterDatasetsDraw: (chart) => {
                const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = chart;

                ctx.save();
                data.datasets.forEach((dataset, i) => {
                    chart.getDatasetMeta(i).data.forEach((bar, index) => {
                        const value = dataset.data[index];
                        const formattedValue = `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                        const textWidth = ctx.measureText(formattedValue).width;
                        const x = bar.x - textWidth / 2; // Centraliza o texto na barra
                        const y = bar.y - 5; // Ajuste vertical
                        ctx.fillStyle = '#1E3A8A';
                        ctx.fillText(formattedValue, x, y);
                    });
                });
                ctx.restore();
            }
        };

        useEffect(() => {
            if (chartInstances.current[data.month]) {
                destroyChartInstance(data.month);
            }

            const newChartInstance = new Chart(`chart-${data.month}`, {
                type: 'bar',
                data: chartData,
                options: chartOptions,
                plugins: [customDataLabelsPlugin],
            });

            chartInstances.current[data.month] = newChartInstance;

            return () => {
                destroyChartInstance(data.month);
            };
        }, [data.month, chartData, chartOptions]);

        return (
            <div key={data.month} className="monthly-chart">
                <canvas id={`chart-${data.month}`}
                />
            </div>
        );
    };

    return (
        <div>
            <div className="identify-data">
                <h2>Relatório Financeiro</h2>
                <h3>2024</h3>
            </div>
            <div className="pond-detail">
                <div className="infos"></div>
                <div className="report-tables">
                    {months.map((m, index) => (
                        <div key={index}>
                            <h3
                                className={`toggle-title ${!show[m[1]] && isAnyMonthExpanded() ? 'collapsed' : ''}`}
                                onClick={() => setShow(prevShow => ({
                                    ...prevShow,
                                    [m[1]]: !prevShow[m[1]]
                                }))}
                            >
                                {m[0]}
                                {show[m[1]] ? (
                                    <FontAwesomeIcon icon={faChevronDown} className="toggle-icon" />
                                ) : (
                                    <FontAwesomeIcon icon={faChevronDown} className="toggle-icon rotate-icon" />
                                )}
                            </h3>
                            {show[m[1]] && organizedData[m[2]] ? (
                                <div className="monthly-data">
                                    <div className="chart-box">
                                        <MonthlyCharts data={organizedData[m[2]]} />
                                    </div>
                                    <table className="biometry-table">
                                        <thead>
                                            <tr>
                                                <th colSpan="4"
                                                    className="report-table-head inputs-head">
                                                    Compras de Insumos
                                                </th>
                                            </tr>
                                            <tr>
                                                <th></th>
                                                <th>Data</th>
                                                <th>Categoria</th>
                                                <th>Item</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {organizedData[m[2]].purchases.map((purchase, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{formatDate(purchase.date).date}</td>
                                                    <td>{purchase.category}</td>
                                                    <td>{purchase.label}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Quantidade</th>
                                                <th>Valor</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {organizedData[m[2]].purchases.map((purchase, i) => (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>

                                                    <td style={{ textAlign: "right" }}>{(purchase.quantity).toLocaleString('pt-BR')}</td>
                                                    <td style={{ textAlign: "right" }}>
                                                        R$ {purchase.category === "Ração"
                                                            ? parseFloat(purchase.value / purchase.bagSize).toLocaleString('pt-BR',
                                                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                            : parseFloat(purchase.value).toLocaleString('pt-BR',
                                                                { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td style={{ textAlign: "right" }}>
                                                        R$ {parseFloat((purchase.bagQuantity || purchase.quantity) * purchase.value).toLocaleString('pt-BR',
                                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr className="total-line-inputs">
                                                <td colSpan="3" style={{ textAlign: "center" }}>
                                                    <strong>Total</strong>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <strong>
                                                        R$ {calculateTotal(organizedData[m[2]].purchases).toLocaleString("pt-BR",
                                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </strong></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="biometry-table">
                                        <thead>
                                            <tr>
                                                <th colSpan="3"
                                                    className="report-table-head payments-head">
                                                    Pagamentos e Serviços
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Categoria</th>
                                                <th>Descrição</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {organizedData[m[2]].payments &&
                                                organizedData[m[2]].payments.map((payment, i) => (
                                                    <>
                                                        {payment.energia && payment.energia.map((e, idx) => (
                                                            <tr key={`${i}-energia-${idx}`}>
                                                                <td>Energia</td>
                                                                <td>{e.description}</td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    R$ {parseFloat(e.value).toLocaleString("pt-BR",
                                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {payment.servicos && payment.servicos.map((s, idx) => (
                                                            <tr key={`${i}-servicos-${idx}`}>
                                                                <td>Serviços</td>
                                                                <td>{s.description}</td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    R$ {parseFloat(s.value).toLocaleString("pt-BR",
                                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {payment.outros && payment.outros.map((o, idx) => (
                                                            <tr key={`${i}-outros-${idx}`}>
                                                                <td>Outros</td>
                                                                <td>{o.description}</td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    R$ {parseFloat(o.value).toLocaleString("pt-BR",
                                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ))}
                                            <tr className="total-line-payments">
                                                <td colSpan="2" style={{ textAlign: "center" }}>
                                                    <strong>Total</strong>
                                                </td>
                                                <td style={{ textAlign: "right" }}>
                                                    <strong>
                                                        R$ {calculatePaymentsTotal(organizedData[m[2]].payments).toLocaleString("pt-BR",
                                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </strong></td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="biometry-table">
                                        <thead>
                                            <tr>
                                                <th
                                                    colSpan="2"
                                                    className="report-table-head labor-head">
                                                    Mão-de-Obra
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Nome</th>
                                                <th>Salário</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {organizedData[m[2]].payroll &&
                                                organizedData[m[2]].payroll.map((labor, i) => (
                                                    <>
                                                        {labor.payroll.map((p, idx) => (
                                                            <tr key={`${i}-payroll-${idx}`}>
                                                                <td>{p.name}</td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    R$ {parseFloat(p.salary).toLocaleString("pt-BR",
                                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </>
                                                ))}
                                            <tr className="total-line-labor">
                                                <td style={{ textAlign: "center" }}>
                                                    <strong>Total</strong>
                                                </td>
                                                <td style={{ textAlign: "right" }}>

                                                    <strong>
                                                        R$ {calculatePayrollTotal(organizedData[m[2]].payroll).toLocaleString("pt-BR",
                                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </strong></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            ) : show[m[1]] && (
                                <div className="no-data-message">Sem dados para {m[0]}</div>
                            )}
                        </div>
                    ))}
                    <br /><br /><br /><br /><br /><br /><br />
                </div>
            </div>
            <IconContainer />
        </div>
    );
};


export default ReportFinancial;
