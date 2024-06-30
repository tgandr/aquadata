import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import Stock from '../Stock';  // ajuste o caminho conforme necessário

// Mock localStorage
const mockLocalStorage = (function () {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        },
        removeItem(key) {
            delete store[key];
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Dados mockados
const mockFormData = { nomeFazenda: 'Fazenda Teste' };
const mockStockData = {
    feedPurchase: [{ dataCompra: '2024-06-27', fornecedor: 'Fornecedor A', quantidade: '100', preco: '10', tamanhoSaco: '20' }],
    probioticsPurchase: [],
    fertilizersPurchase: [],
    othersPurchase: []
};

window.localStorage.setItem('formData', JSON.stringify(mockFormData));
window.localStorage.setItem('stockData', JSON.stringify(mockStockData));

test('Renderização inicial da página Stock', () => {
    render(
        <BrowserRouter>
            <Stock />
        </BrowserRouter>
    );

    expect(screen.getByText('Controle de Estoque')).toBeInTheDocument();
    expect(screen.getByText(`Fazenda ${mockFormData.nomeFazenda}`)).toBeInTheDocument();
});

test('Interação com botões e exibição de popups', () => {
    render(
        <BrowserRouter>
            <Stock />
        </BrowserRouter>
    );

    const rationButton = screen.getByText('Ração');
    fireEvent.click(rationButton);
    expect(screen.getByText('Ração')).toBeInTheDocument();
    expect(screen.getByText('Fornecedor A')).toBeInTheDocument();

    const backButton = screen.getByText('Voltar');
    fireEvent.click(backButton);
    expect(screen.queryByText('Ração')).not.toBeInTheDocument();
});

test('Cálculo e exibição do valor total do estoque', () => {
    render(
        <BrowserRouter>
            <Stock />
        </BrowserRouter>
    );

    expect(screen.getByText('Valor Total em Estoque: R$ 50,00')).toBeInTheDocument();
});

test('Carregamento de dados do localStorage', () => {
    render(
        <BrowserRouter>
            <Stock />
        </BrowserRouter>
    );

    expect(screen.getByText('Fornecedor A')).toBeInTheDocument();
});
