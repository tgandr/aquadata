import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { formatDate, IconContainer } from './utils';

const ReportCosts = () => {
    const history = JSON.parse(localStorage.getItem('history'));
    
    return (
        <div>
            <div className="identify-data">
                <h2>Relatório de Custos</h2>
                <h3>2024</h3>
            </div>
            <div className="pond-detail">
                <div className="infos"></div>
                <div className="report-tables">
                    
                    <br /><br />
                </div>
            </div>
            <IconContainer />
        </div>
    );
};


export default ReportCosts;
