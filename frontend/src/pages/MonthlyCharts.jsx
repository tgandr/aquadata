import React, { useEffect, useRef } from 'react';
import { Chart, scales } from 'chart.js/auto';

const MonthlyCharts = ({ data, revenues }) => {
    const chartInstances = useRef({});

    const destroyChartInstance = (month) => {
        if (chartInstances.current[month]) {
            if (chartInstances.current[month].horizontal) {
                chartInstances.current[month].horizontal.destroy();
            }
            if (chartInstances.current[month].vertical) {
                chartInstances.current[month].vertical.destroy();
            }
            delete chartInstances.current[month];
        }
    };

    useEffect(() => {
        return () => {
            destroyChartInstance(data.month);
        };
    }, [data.month]);

    const calculateTotalExpenses = (i) => {
        return (calculateTotal(i.purchases) ? calculateTotal(i.purchases) : 0)
            + (calculatePaymentsTotal(i.payments) ? calculatePaymentsTotal(i.payments) : 0)
            + (calculatePayrollTotal(i.payroll) ? calculatePayrollTotal(i.payroll) : 0)
    }

    const revenuesByMonth = (month) => {
        let monthRevenue = [];
        revenues.forEach((m) => {
            const monthFiltered = m.date.slice(0, 7);
            if (month === monthFiltered) monthRevenue.push(m);
        })
        return monthRevenue.reduce((total, r) => total + (r.biomass * r.price), 0);
    }

    function calculateTotal(purchases) {
        if (purchases) {
            return purchases.reduce((total, purchase) => {
                if ("purchaseId" in purchase) {
                    if (purchase.purchaseId.purchase === 'ration') {
                        return total + (parseFloat(purchase.bagQuantity) * parseFloat(purchase.value));
                    }
                }
                return total + (parseFloat(purchase.quantity) * parseFloat(purchase.value));
            }, 0);
        }
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

    const horizontalChartData = {
        labels: [`Receitas\nR$ ${(revenuesByMonth(data.month)).toLocaleString('pt-BR',
            { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `Despesas\nR$ ${(calculateTotalExpenses(data)).toLocaleString('pt-BR',
            { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}`],
        datasets: [
            {
                backgroundColor: ['#34D399', '#F87171'],
                data: [
                    revenuesByMonth(data.month),
                    calculateTotalExpenses(data),
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
                            return label.split('\n');
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

    const horizontalChartOptions = {
        ...chartOptions,
        indexAxis: 'y',
        scales: {
            y: {
                ticks: {
                    color: '#1E3A8A',
                    callback: function (value, index, values) {
                        const label = horizontalChartData.labels[index];
                        if (typeof label === 'string') {
                            return label.split('\n');
                        }
                        return label;
                    }
                }
            },
            x: {
                ticks: {
                    beginAtZero: true,
                    display: false,
                    color: '#1E3A8A',
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
                    const formattedValue = `R$ ${value && value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    const textWidth = ctx.measureText(formattedValue).width;
                    const x = bar.x - textWidth / 2;
                    const y = bar.y - 5;
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

        if (!Array.isArray(data.revenue) && !Array.isArray(data.expenses) && !Array.isArray(data.purchases) && !Array.isArray(data.payments) && !Array.isArray(data.payroll)) {
            return;
        }

        const horizontalChartInstance = new Chart(`horizontal-chart-${data.month}`, {
            type: 'bar',
            data: horizontalChartData,
            options: horizontalChartOptions,
        });

        const verticalChartInstance = new Chart(`chart-${data.month}`, {
            type: 'bar',
            data: chartData,
            options: chartOptions,
            plugins: [customDataLabelsPlugin],
        });

        chartInstances.current[data.month] = {
            horizontal: horizontalChartInstance,
            vertical: verticalChartInstance,
        };

        return () => {
            destroyChartInstance(data.month);
        };
    }, [data.month, chartData, chartOptions, horizontalChartData, horizontalChartOptions]);

    if (!Array.isArray(data.revenue) && !Array.isArray(data.expenses) && !Array.isArray(data.purchases) && !Array.isArray(data.payments) && !Array.isArray(data.payroll)) {
        return (
            <div className="monthly-chart">
                <p>Sem dados disponíveis para este mês.</p>
            </div>
        );
    }

    return (
        <div key={data.month} className="monthly-chart">
            <h4>Saldo: R$ {(revenuesByMonth(data.month) - calculateTotalExpenses(data))
                .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
            <canvas id={`horizontal-chart-${data.month}`} /><hr />
            <h4>Despesas: R$ {(calculateTotalExpenses(data))
                .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
            <canvas id={`chart-${data.month}`} />
        </div>
    );
};

export default MonthlyCharts;
