import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate, IconContainer } from './utils';
import { Chart, registerables } from 'chart.js';
import MonthlyCharts from './MonthlyCharts';
import useDatabase from '../hooks/useDatabase';

Chart.register(...registerables);

const ReportFinancial = () => {
    const db = useDatabase()
    const [history, setHistory] = useState([])
    const [financial, setFinancial] = useState({})
    const [revenues, setRevenues] = useState([]);
    const [organizedData, setOrganizedData] = useState({});
    // const [revenueData, setRevenueData] = useState([]);
    const [showYear, setShowYear] = useState('');
    const [yearsList, setYearsList] = useState([]);
    const [months, setMonths] = useState([]);
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

    const monthsPrevious = [
        ["Janeiro", "jan"],
        ["Fevereiro", "feb"],
        ["Março", "mar"],
        ["Abril", "apr"],
        ["Maio", "may"],
        ["Junho", "jun"],
        ["Julho", "jul"],
        ["Agosto", "aug"],
        ["Setembro", "sep"],
        ["Outubro", "oct"],
        ["Novembro", "nov"],
        ["Dezembro", "dec"]
    ];

    const monthsList = () => {
        const completeList = [];
        monthsPrevious.map((month, index) => {
            const monthNumber = String(index + 1).padStart(2, "0"); // Garante formato "01", "02", etc.
            completeList.push([...month, `${showYear}-${monthNumber}`])
        });
        setMonths(completeList);
    };

    const handleChange = (e) => {
        setShowYear(e.target.value)
    };

    useEffect(() => {
        monthsList();
    }, [showYear]);

    useEffect(() => {
        if (!db) return

        db.find({
            selector: {dataType: 'financial'}
        }).then(data => {
            const financial = data.docs[0]
            const organized = organizeByMonth(financial);
            const organizedObj = {};
            organized.forEach(item => {
                organizedObj[item.month] = item;
            });
            setOrganizedData(organizedObj);
            setFinancial(financial)

            const getAllYears = (financial) => {
                const years = new Set();
                for (const key in financial) {
                    if (Array.isArray(financial[key])) {
                        financial[key].forEach(item => {
                            if (item.date) {
                                const year = parseInt(item.date.split("-")[0]);
                                years.add(year);
                            }
                            if (item.month) {
                                const year = parseInt(item.month.split("-")[0]);
                                years.add(year);
                            }
                        });
                    }
                }
                return Array.from(years);
            };
    
            const years = getAllYears(financial);
            setShowYear(Math.max(...years));
            setYearsList(years);
        })

        db.find({
            selector: {dataType: 'cultivation'}
        }).then(data => {
            const history = data.docs;
            history.forEach((hist) => {
                if ("harvest" in hist) {
                    hist.harvest.forEach((harv) => {
                        const harvData = {
                            date: harv.id.date,
                            price: harv.id.price,
                            biomass: harv.data.biomass || harv.data.biomassAtFinalHarvest,
                        };
                        revenue.push(harvData);
                    })
                }
            })
            setHistory(history)
        })
    }, [db]);

    // useEffect(() => {
    //     const history = JSON.parse(localStorage.getItem('history'));
    //     let revenue = [];
    //     if (history) {
    //         if (history) {
    //             history.forEach((hist) => {
    //                 if ("harvest" in hist) {
    //                     hist.harvest.forEach((harv) => {
    //                         const harvData = {
    //                             date: harv.id.date,
    //                             price: harv.id.price,
    //                             biomass: harv.data.biomass || harv.data.biomassAtFinalHarvest,
    //                         };
    //                         revenue.push(harvData);
    //                     })
    //                 }
    //             })
    //         }
    //     }
    //     setRevenues(revenue);
    // }, []);

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

        revenues && revenues.forEach(rev => {
            const month = extractMonth(rev.date);
            if (!result[month]) {
                result[month] = { purchases: [], payroll: [], payments: [], revenue: 0 };
            }
            result[month].revenue += rev.price * rev.biomass;
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

    const revenueByMonth = (month) => {
        let monthRevenue = [];
        revenues.forEach((m) => {
            const monthFiltered = m.date.slice(0, 7);
            if (month === monthFiltered) monthRevenue.push(m);
        });
        return monthRevenue;
    }

    const isAnyMonthExpanded = () => {
        return Object.values(show).some(value => value);
    };

    return (
        <div>
            <div className="identify-data">
                <h2>Movimento Mensal</h2>
                {/* <h3>{showYear}</h3> */}
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
                                        <MonthlyCharts data={organizedData[m[2]]} revenues={revenues} />
                                    </div>

                                    {revenueByMonth(m[2]).length > 0 ?
                                        (
                                            <table className="biometry-table">
                                                <thead>
                                                    <tr>
                                                        <th colSpan="2" className="report-table-head revenue-head">
                                                            Receitas
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th>Data</th>
                                                        <th>Valor</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {revenueByMonth(m[2]).map((entry, i) => (
                                                        <tr key={i}>
                                                            <td>{new Date(entry.date).toLocaleDateString("pt-BR")}</td>
                                                            <td style={{ textAlign: "right" }}>
                                                                R$ {(parseFloat(entry.price) * parseFloat(entry.biomass)).toLocaleString("pt-BR", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="total-line-revenue">
                                                        <td style={{ textAlign: "center" }}>
                                                            <strong>Total</strong>
                                                        </td>
                                                        <td style={{ textAlign: "right" }}>
                                                            <strong>
                                                                R$ {revenueByMonth(m[2]).reduce((total, entry) => total + parseFloat(entry.price) * parseFloat(entry.biomass), 0).toLocaleString("pt-BR", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        ) : (<h4 className="revenues-obs">Sem receitas no mês</h4>
                                        )
                                    }

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
                                                        R$ {purchase.category === ("Probióticos" || "Fertilizantes") ? parseFloat(purchase.value).toLocaleString('pt-BR',
                                                            { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : parseFloat((purchase.bagQuantity || purchase.quantity) * purchase.value).toLocaleString('pt-BR',
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
                                                    <React.Fragment key={i}>
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
                                                    </React.Fragment>
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
                                                    <React.Fragment key={i}>
                                                        {labor.payroll.map((p, idx) => (
                                                            <tr key={`${i}-payroll-${idx}`}>
                                                                <td>{p.name}</td>
                                                                <td style={{ textAlign: "right" }}>
                                                                    R$ {parseFloat(p.salary).toLocaleString("pt-BR",
                                                                        { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
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
                    
                    <select
                        name="selectYear"
                        value={showYear}
                        onChange={handleChange}
                        className="select-year"
                    >
                        {/* <option>Selecione o ano</option> */}
                        {yearsList.length > 0 && yearsList.map((y, index) =>
                            <option value={y} key={index}>{y}</option>
                        )}
                    </select>
                    <br /><br /><br /><br /><br /><br /><br />
                </div>
            </div>
            <IconContainer />
        </div>
    );
};

export default ReportFinancial;
