efiniÃ§Ã£o dos sinais das contas
const sinaisDefinidos = new Map([
    ['conta1', '+'], ['conta2', '+'], ['conta3', '+'], ['conta4', '+'],
    ['conta5', '+'], ['conta6', '+'], ['conta7', '+'], ['conta8', '+'],
    ['conta9', '+'], ['conta10', '+'], ['conta11', '+'], ['conta12', '+'],
    ['conta13', '+'], ['conta14', '+'], ['conta15', '+'], ['conta16', '+'],
    ['conta17', '+'], ['conta18', '+'], ['conta19', '+'], ['conta20', '+'],
    ['conta21', '+'], ['conta22', '+'], ['conta23', '+'], ['conta24', '+'],
    ['conta25', '+'], ['conta26', '+'], ['conta27', '+'], ['conta28', '+'],
    ['conta29', '+'], ['conta30', '+'], ['conta31', '+'], ['conta32', '+'],
    ['conta33', '+'], ['conta34', '+'], ['conta35', '+'], ['conta36', '+'],
    ['conta37', '+/-'], ['conta38', '+/-'], ['conta39', '+/-'], ['conta40', '+/-'],
    ['conta41', '+'], ['conta42', '+'], ['conta43', '+'], ['conta44', '+'],
    ['conta45', '+'], ['conta46', '+'], ['conta47', '+'], ['conta48', '+'],
    ['conta49', '+'], ['conta50', '+'], ['conta51', '+'], ['conta52', '+'],
    ['conta53', '+'], ['conta54', '+'], ['conta55', '+'], ['conta56', '+'],
    ['conta57', '+'], ['conta58', '+'], ['conta59', '+'], ['conta60', '+'],
    ['conta61', '+'], ['conta62', '+'], ['conta63', '+'], ['conta64', '+'],
    ['conta65', '+'], ['conta66', '+'], ['conta67', '+'], ['conta68', '+'],
    ['conta69', '+'], ['conta70', '+'], ['conta71', '+'], ['conta72', '+'],
    ['conta73', '+'], ['conta74', '+'], ['conta75', '+'], ['conta76', '+'],
    ['conta77', '+'], ['conta78', '+'], ['conta79', '+'], ['conta80', '+'],
    ['conta81', '+'], ['conta82', '+'], ['conta83', '+'], ['conta84', '+'],
    ['conta85', '+'], ['conta86', '+'], ['conta87', '+'], ['conta88', '+'],
    ['conta89', '+/-'], ['conta90', '+/-'], ['conta91', '+/-'], 
    ['conta92', '+/-'], ['conta93', '+/-'], ['conta94', '+/-'], ['conta95', '+/-'],
    ['conta96', '+/-'], ['conta97', '+/-'], ['conta98', '+/-'], 
    ['conta99', '+/-'], ['conta100', '+/-'],
    ['conta101', '-'], ['conta102', '-'], ['conta103', '-'], ['conta104', '-'],
    ['conta105', '-'], ['conta106', '-'], ['conta107', '-'], ['conta108', '-'],
    ['conta109', '-'], ['conta110', '-'], ['conta111', '-'], ['conta112', '-'],
    ['conta113', '-'], ['conta114', '-'], ['conta115', '-'], ['conta116', '-'],
    ['conta117', '-'], ['conta118', '-'], ['conta119', '-'], ['conta120', '-'],
    ['conta121', '-'], ['conta122', '-'], ['conta123', '-'], ['conta124', '-'],
    ['conta125', '-'], ['conta126', '-'], ['conta127', '-'], ['conta128', '-'],
    ['conta129', '-'], ['conta130', '-'], ['conta131', '-'], ['conta132', '-'],
    ['conta133', '-'], ['conta134', '-'], ['conta135', '-'],
    ['conta136', '+'], ['conta137', '+'], ['conta138', '+'], ['conta139', '+'],
    ['conta140', '+'], ['conta141', '+'], ['conta142', '+'], ['conta143', '+'],
    ['conta144', '+'], ['conta145', '+'], ['conta146', '+'], ['conta147', '+'],
    ['conta148', '+'], ['conta149', '+'], ['conta150', '+'], ['conta151', '+'],
    ['conta152', '+'], ['conta153', '+'], ['conta154', '+'], ['conta155', '+'],
    ['conta156', '+'], ['conta157', '+'], ['conta158', '+'], ['conta159', '+'],
    ['conta160', '+'], ['conta161', '+'], ['conta162', '+'], ['conta163', '+'],
    ['conta164', '+'], ['conta165', '+'], ['conta166', '+/-'], ['conta167', '+'],
    ['conta168', '+'], ['conta169', '+'], ['conta170', '+']
]);

// VariÃ¡veis globais
let resultados = [];
let resultadosFiltrados = [];

// Elementos DOM
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');
const errorMessage = document.getElementById('errorMessage');
const tableBody = document.getElementById('tableBody');
const grupoFilter = document.getElementById('grupoFilter');
const statusFilter = document.getElementById('statusFilter');

// Event listeners
uploadBox.addEventListener('click', () => fileInput.click());
uploadBox.addEventListener('dragover', handleDragOver);
uploadBox.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
grupoFilter.addEventListener('change', aplicarFiltros);
statusFilter.addEventListener('change', aplicarFiltros);

function handleDragOver(e) {
    e.preventDefault();
    uploadBox.classList.add('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processarArquivo(files[0]);
    }
}

function handleFileSelect(e) {
    if (e.target.files.length > 0) {
        processarArquivo(e.target.files[0]);
    }
}

async function processarArquivo(file) {
    if (file.size > 10 * 1024 * 1024) {
        mostrarErro('Arquivo muito grande. MÃ¡ximo permitido: 10MB');
        return;
    }

    mostrarLoading();
    
    try {
        const conteudo = await lerArquivo(file);
        const contas = extrairContas(conteudo);
        resultados = analisarContas(contas);
        resultadosFiltrados = [...resultados];
        
        preencherFiltros();
        exibirResultados();
        mostrarResultados();
    } catch (error) {
        console.error('Erro ao processar arquivo:', error);
        mostrarErro('Erro ao processar o arquivo. Verifique se Ã© um arquivo CADOC vÃ¡lido.');
    }
}

function lerArquivo(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

function extrairContas(conteudo) {
    const contas = [];
    const parser = new DOMParser();
    
    try {
        const xmlDoc = parser.parseFromString(conteudo, 'text/xml');
        
        // Buscar todas as seÃ§Ãµes de contas
        const secoes = [
            'consolidadoPais',
            'consolidadoExterior', 
            'consolidadoPaisExterior',
            'consolidadoPrudencial',
            'assemelhadas'
        ];
        
        secoes.forEach(secao => {
            const elemento = xmlDoc.querySelector(secao);
            if (elemento) {
                const contasSecao = elemento.querySelectorAll('conta');
                contasSecao.forEach(conta => {
                    const codigoConta = conta.getAttribute('codigoConta');
                    const saldoAglutinado = parseFloat(conta.getAttribute('saldoAglutinado') || conta.getAttribute('saldo') || conta.getAttribute('saldoContabil') || '0');
                    const valorEliminacoes = parseFloat(conta.getAttribute('valorEliminacoes') || '0');
                    const saldoConsolidado = parseFloat(conta.getAttribute('saldoConsolidado') || '0');
                    
                    if (codigoConta) {
                        contas.push({
                            grupo: secao,
                            codigoConta,
                            saldoAglutinado,
                            valorEliminacoes,
                            saldoConsolidado
                        });
                    }
                });
            }
        });
        
        return contas;
    } catch (error) {
        throw new Error('Formato de arquivo invÃ¡lido');
    }
}

function analisarContas(contas) {
    const resultados = [];
    
    contas.forEach(conta => {
        const sinalDefinido = sinaisDefinidos.get(conta.codigoConta);
        
        if (sinalDefinido) {
            // Soma todos os valores
            const somaValores = conta.saldoAglutinado + conta.valorEliminacoes + conta.saldoConsolidado;
            
            // Determinar sinal calculado
            let sinalCalculado;
            if (somaValores > 0) {
                sinalCalculado = '+';
            } else if (somaValores < 0) {
                sinalCalculado = '-';
            } else {
                sinalCalculado = '0';
            }
            
            // Verificar consistÃªncia
            let consistente;
            if (sinalDefinido === '+/-') {
                consistente = true; // Contas que podem ter qualquer sinal
            } else {
                consistente = sinalDefinido === sinalCalculado;
            }
            
            resultados.push({
                grupo: conta.grupo,
                codigoConta: conta.codigoConta,
                sinalDefinido,
                somaValores,
                sinalCalculado,
                consistente
            });
        }
    });
    
    return resultados;
}

function preencherFiltros() {
    // Preencher filtro de grupos
    const grupos = [...new Set(resultados.map(r => r.grupo))];
    grupoFilter.innerHTML = '<option value="">Todos os Grupos</option>';
    grupos.forEach(grupo => {
        const option = document.createElement('option');
        option.value = grupo;
        option.textContent = formatarNomeGrupo(grupo);
        grupoFilter.appendChild(option);
    });
}

function formatarNomeGrupo(grupo) {
    const nomes = {
        'consolidadoPais': 'Consolidado PaÃ­s',
        'consolidadoExterior': 'Consolidado Exterior',
        'consolidadoPaisExterior': 'Consolidado PaÃ­s + Exterior',
        'consolidadoPrudencial': 'Consolidado Prudencial',
        'assemelhadas': 'Assemelhadas'
    };
    return nomes[grupo] || grupo;
}

function aplicarFiltros() {
    const grupoSelecionado = grupoFilter.value;
    const statusSelecionado = statusFilter.value;
    
    resultadosFiltrados = resultados.filter(resultado => {
        const filtroGrupo = !grupoSelecionado || resultado.grupo === grupoSelecionado;
        const filtroStatus = !statusSelecionado || 
            (statusSelecionado === 'consistente' && resultado.consistente) ||
            (statusSelecionado === 'inconsistente' && !resultado.consistente);
        
        return filtroGrupo && filtroStatus;
    });
    
    exibirResultados();
}

function exibirResultados() {
    // Atualizar cards de resumo
    const totalContas = resultados.length;
    const inconsistencias = resultados.filter(r => !r.consistente).length;
    const consistentes = totalContas - inconsistencias;
    
    document.getElementById('totalContas').textContent = totalContas;
    document.getElementById('totalInconsistencias').textContent = inconsistencias;
    document.getElementById('totalConsistentes').textContent = consistentes;
    
    // Atualizar tabela
    tableBody.innerHTML = '';
    
    resultadosFiltrados.forEach(resultado => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${formatarNomeGrupo(resultado.grupo)}</td>
            <td><code>${resultado.codigoConta}</code></td>
            <td><span class="sinal-${resultado.sinalDefinido === '+' ? 'positivo' : resultado.sinalDefinido === '-' ? 'negativo' : 'neutro'}">${resultado.sinalDefinido}</span></td>
            <td>${formatarValor(resultado.somaValores)}</td>
            <td><span class="sinal-${resultado.sinalCalculado === '+' ? 'positivo' : resultado.sinalCalculado === '-' ? 'negativo' : 'neutro'}">${resultado.sinalCalculado}</span></td>
            <td><span class="status-badge status-${resultado.consistente ? 'consistente' : 'inconsistente'}">
                ${resultado.consistente ? 'Consistente' : 'Inconsistente'}
            </span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    }).format(valor);
}

function mostrarLoading() {
    document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
    loading.style.display = 'block';
}

function mostrarResultados() {
    document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
    resultsSection.style.display = 'block';
}

function mostrarErro(mensagem) {
    document.querySelectorAll('.container > div').forEach(div => div.style.display = 'none');
    document.getElementById('errorText').textContent = mensagem;
    errorMessage.style.display = 'block';
}
