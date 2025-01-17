const Example = (check) => {
    if (check) {
        const formData = {
            nomeCompleto: "AquaData APP",
            email: "",
            senha: "123",
            confirmarSenha: "123",
            telefone: "85999807026",
            enderecoFazenda: "Ceará",
            nomeFazenda: "Aqua Data",
            perfil: "fornecedor",
            tipoInsumo: "",
            eraseLocalStorageAfterLogout: true,
            saveLogin: false
        }
    
        const viveiros = [
            {"id":1,"nome":"Viveiro 1","area":"0.4"},
            {"id":2,"nome":"Viveiro 2","area":"0.5"},
            {"id":3,"nome":"Viveiro 3","area":"0.5"},
            {"id":4,"nome":"Viveiro 4","area":"0.5"},
            {"id":5,"nome":"Viveiro 5","area":"0.6"},
            {"id":6,"nome":"Viveiro 6","area":"0.5"},
            {"id":7,"nome":"Viveiro 7","area":"0.5"},
            {"id":8,"nome":"Viveiro 8","area":"0.6"},
            {"id":9,"nome":"Viveiro 9","area":"0.4"},
            {"id":10,"nome":"Viveiro 10","area":"0.5"}
        ];
    
        const cultivo_1 = [
            {
                dataPovoamento: "2024-03-01",
                origemPL: "Larvifort",
                quantidadeEstocada: 300000,
                testeEstresse: "Não",
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 1,
                viveiroId: 1,
                id: 1,
                hasShrimp: true,
                biometrics: [
                    { data: "2024-03-08", Pesagem: 120, Contagem: 1200, pesoMedio: 0.1 },
                    { data: "2024-03-29", Pesagem: 250, Contagem: 500, pesoMedio: 0.5 },
                    { data: "2024-04-30", Pesagem: 89, Contagem: 100, pesoMedio: 0.9 },
                    { data: "2024-05-23", Pesagem: 135, Contagem: 110, pesoMedio: 1.2 }
                ]
            },
            {
                dataPovoamento: "2024-04-01",
                origemPL: "Larvifort",
                quantidadeEstocada: 299000,
                testeEstresse: "Não",
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 3,
                viveiroId: 3,
                id: 2,
                hasShrimp: true,
                biometrics: [
                    { data: "2024-04-19", Pesagem: 140, Contagem: 146, pesoMedio: 1.0 },
                    { data: "2024-05-02", Pesagem: 200, Contagem: 150, pesoMedio: 1.3 },
                    { data: "2024-05-24", Pesagem: 200, Contagem: 90, pesoMedio: 2.2 }
                ]
            },
            {
                dataPovoamento: "2024-05-03",
                origemPL: "CELM",
                quantidadeEstocada: 250000,
                testeEstresse: false,
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 4,
                viveiroId: 4,
                id: 3,
                hasShrimp: true
            },
            {
                dataPovoamento: "2024-06-03",
                origemPL: "CELM",
                quantidadeEstocada: 289000,
                testeEstresse: false,
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 5,
                viveiroId: 5,
                id: 4,
                hasShrimp: true
            }
        ];
        
        const cultivo_2 = {
            dataPovoamento: "2024-04-01",
            origemPL: "Larvifort",
            quantidadeEstocada: 299000,
            testeEstresse: "Não",
            tipoTeste: "",
            alteracaoNatatoria: "",
            larvasMortas: "",
            viveiro: 3,
            viveiroId: 3,
            id: 2,
            hasShrimp: true,
            biometrics: [
                { data: "2024-04-19", Pesagem: 140, Contagem: 146, pesoMedio: 1.0 },
                { data: "2024-05-02", Pesagem: 200, Contagem: 150, pesoMedio: 1.3 },
                { data: "2024-05-24", Pesagem: 200, Contagem: 90, pesoMedio: 2.2 }
            ]
        };
        
        const cultivo_3 = {
            dataPovoamento: "2024-05-03",
            origemPL: "CELM",
            quantidadeEstocada: 250000,
            testeEstresse: false,
            tipoTeste: "",
            alteracaoNatatoria: "",
            larvasMortas: "",
            viveiro: 4,
            viveiroId: 4,
            id: 3,
            hasShrimp: true
        };
        
        const cultivo_4 = {
            dataPovoamento: "2024-06-03",
            origemPL: "CELM",
            quantidadeEstocada: 289000,
            testeEstresse: false,
            tipoTeste: "",
            alteracaoNatatoria: "",
            larvasMortas: "",
            viveiro: 5,
            viveiroId: 5,
            id: 4,
            hasShrimp: true
        };
        
        
        const history = [
            {
                dataPovoamento: "2024-03-01",
                origemPL: "Larvifort",
                quantidadeEstocada: 300000,
                testeEstresse: "Não",
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 1,
                viveiroId: 1,
                id: 1,
                hasShrimp: true,
                biometrics: [
                    { data: "2024-03-08", Pesagem: 120, Contagem: 1200, pesoMedio: 0.1 },
                    { data: "2024-03-29", Pesagem: 250, Contagem: 500, pesoMedio: 0.5 },
                    { data: "2024-04-30", Pesagem: 89, Contagem: 100, pesoMedio: 0.9 },
                    { data: "2024-05-23", Pesagem: 135, Contagem: 110, pesoMedio: 1.2 }
                ]
            },
            {
                dataPovoamento: "2024-04-01",
                origemPL: "Larvifort",
                quantidadeEstocada: 299000,
                testeEstresse: "Não",
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 3,
                viveiroId: 3,
                id: 2,
                hasShrimp: true,
                biometrics: [
                    { data: "2024-04-19", Pesagem: 140, Contagem: 146, pesoMedio: 1.0 },
                    { data: "2024-05-02", Pesagem: 200, Contagem: 150, pesoMedio: 1.3 },
                    { data: "2024-05-24", Pesagem: 200, Contagem: 90, pesoMedio: 2.2 }
                ]
            },
            {
                dataPovoamento: "2024-05-03",
                origemPL: "CELM",
                quantidadeEstocada: 250000,
                testeEstresse: false,
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 4,
                viveiroId: 4,
                id: 3,
                hasShrimp: true
            },
            {
                dataPovoamento: "2024-06-03",
                origemPL: "CELM",
                quantidadeEstocada: 289000,
                testeEstresse: false,
                tipoTeste: "",
                alteracaoNatatoria: "",
                larvasMortas: "",
                viveiro: 5,
                viveiroId: 5,
                id: 4,
                hasShrimp: true
            }
        ];    
        
        const financial = {
            labor: [
                { month: "2024-01", payroll: [{ name: "total", salary: 9900 }] },
                { month: "2024-02", payroll: [{ name: "total", salary: 11500 }] },
                { month: "2024-03", payroll: [{ name: "total", salary: 11900 }] },
                { month: "2024-04", payroll: [{ name: "total", salary: 11900 }] },
                { month: "2024-05", payroll: [{ name: "total", salary: 12500 }] }
            ]
        };    
        
        const stockData = {
        ration: [
            {
                dataCompra: "2024-05-02",
                marcaRacao: "Samaria",
                tipoRacao: "Inicial",
                quantidadeSacos: 20,
                tamanhoSaco: "15 kg",
                dataValidade: "2024-08-30",
                precoSaco: 125
            }
        ],
        probiotics: [],
        fertilizers: [],
        others: []
        }
        
    
        localStorage.setItem('formData', JSON.stringify(formData));
        localStorage.setItem('viveiros', JSON.stringify(viveiros));
        localStorage.setItem('history', JSON.stringify(history));
        localStorage.setItem('cultivo-1', JSON.stringify(cultivo_1));
        localStorage.setItem('cultivo-2', JSON.stringify(cultivo_2));
        localStorage.setItem('cultivo-3', JSON.stringify(cultivo_3));
        localStorage.setItem('cultivo-4', JSON.stringify(cultivo_4));
        localStorage.setItem('financial', JSON.stringify(financial));
        localStorage.setItem('stockData', JSON.stringify(stockData));
    }
}

export default Example;