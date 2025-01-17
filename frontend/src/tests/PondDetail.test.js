// PondDetail.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PondDetail from '../pages/PondDetail';

const mockLocation = {
    state: {
        viveiro: { id: '1', nome: 'Viveiro 1' },
        farmName: 'Fazenda 1'
    }
};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => mockLocation,
    useNavigate: () => jest.fn()
}));

describe('PondDetail Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('renders pond details correctly when cultivo is null', () => {
        render(
            <MemoryRouter>
                <PondDetail />
            </MemoryRouter>
        );

        expect(screen.getByText('O viveiro está vazio')).toBeInTheDocument();
        expect(screen.getByText('Novo Ciclo de Cultivo')).toBeInTheDocument();
    });

    test('renders cultivo details correctly', () => {
        const mockCultivo = {
            id: '123',
            dataPovoamento: '2023-01-01',
            origemPL: 'Origem X',
            quantidadeEstocada: '1000',
            feed: [],
            biometrics: []
        };

        localStorage.setItem('history', JSON.stringify([{ viveiroId: '1', ...mockCultivo }]));
        localStorage.setItem(`cultivo-123`, JSON.stringify(mockCultivo));

        render(
            <MemoryRouter>
                <PondDetail />
            </MemoryRouter>
        );

        expect(screen.getByText('Povoamento em 01/01/2023')).toBeInTheDocument();
        expect(screen.getByText('Origem da PL: Origem X')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
    });

    test('opens feed popup on button click', () => {
        render(
            <MemoryRouter>
                <PondDetail />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Ração'));
        expect(screen.getByText('Feed Popup Content')).toBeInTheDocument(); // Supondo que o conteúdo do popup tenha esse texto
    });
});
