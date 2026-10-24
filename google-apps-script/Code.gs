const PLANILHA_ID = '13J6sEdLflk5Wd6EmJpcyI8Lp6sYRlB1XdtdyOIml-ZI';
const ABA = 'depoimentos';
const CABECALHOS = ['id', 'criado_em', 'autor', 'eh_adulto', 'nome_atleta', 'idade_atleta', 'nota', 'depoimento', 'ativo', 'ordem'];

// Execute uma vez no editor. Não apaga ou substitui linhas existentes.
function configurarPlanilha() {
  const planilha = SpreadsheetApp.openById(PLANILHA_ID);
  let aba = planilha.getSheetByName(ABA);
  if (!aba) aba = planilha.insertSheet(ABA);
  if (aba.getLastRow() > 0 && aba.getRange(1, 1, 1, 10).getValues()[0].join('|') !== CABECALHOS.join('|')) {
    throw new Error('A aba depoimentos já contém outra estrutura. Renomeie essa aba para depoimentos_antigos e execute novamente.');
  }
  if (aba.getLastRow() === 0) aba.getRange(1, 1, 1, 10).setValues([CABECALHOS]);
  aba.setFrozenRows(1);
  aba.getRange('A1:J1').setFontWeight('bold');
  const checkbox = SpreadsheetApp.newDataValidation().requireCheckbox().build();
  aba.getRange(2, 4, aba.getMaxRows() - 1, 1).setDataValidation(checkbox);
  aba.getRange(2, 9, aba.getMaxRows() - 1, 1).setDataValidation(checkbox);
  const properties = PropertiesService.getScriptProperties();
  if (!properties.getProperty('API_SECRET')) properties.setProperty('API_SECRET', Utilities.getUuid() + Utilities.getUuid());
  console.log('Planilha pronta. A chave API_SECRET está em Configurações do projeto → Propriedades do script.');
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function rows_(aba) {
  return aba.getLastRow() < 2 ? [] : aba.getRange(2, 1, aba.getLastRow() - 1, 10).getValues();
}

function testimonial_(row, includeInactive) {
  const result = {
    id: String(row[0]), author: String(row[2]), isAdult: row[3] === true,
    athlete: row[3] === true ? '' : String(row[4]), age: row[3] === true ? '' : String(row[5]),
    rating: Math.max(1, Math.min(5, Math.round(Number(row[6]) || 5))),
    content: String(row[7]), order: Number(row[9]) || 1,
  };
  if (includeInactive) result.active = row[8] === true;
  return result;
}

function validatedValues_(t) {
  if (!t || typeof t.isAdult !== 'boolean' || typeof t.active !== 'boolean') throw new Error('Booleano inválido');
  const text = (v, max) => {
    if (typeof v !== 'string' || !v.trim() || v.trim().length > max) throw new Error('Texto inválido');
    return /^[=+@-]/.test(v.trim()) ? "'" + v.trim() : v.trim();
  };
  const author = text(t.author, 100);
  const content = text(t.content, 3000);
  const athlete = t.isAdult ? '' : text(t.athlete, 100);
  const age = t.isAdult ? '' : t.age;
  if (!t.isAdult && (!Number.isInteger(age) || age < 1 || age > 17)) throw new Error('Idade inválida');
  if (!Number.isInteger(t.rating) || t.rating < 1 || t.rating > 5 || !Number.isInteger(t.order) || t.order < 1 || t.order > 100000) throw new Error('Nota ou ordem inválida');
  return [author, t.isAdult, athlete, age, t.rating, content, t.active, t.order];
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('API_SECRET');
    if (!secret || data.secret !== secret) return json_({ ok: false, code: 'UNAUTHORIZED' });
    if (!['list', 'listAll', 'create', 'update', 'delete'].includes(data.action)) return json_({ ok: false, code: 'INVALID_ACTION' });
    const aba = SpreadsheetApp.openById(PLANILHA_ID).getSheetByName(ABA);
    if (!aba) throw new Error('Execute configurarPlanilha primeiro.');
    if (data.action === 'list' || data.action === 'listAll') {
      const includeInactive = data.action === 'listAll';
      const testimonials = rows_(aba)
        .filter(row => row[0] && (includeInactive || (row[8] === true && row[2] && row[7])))
        .map(row => testimonial_(row, includeInactive))
        .sort((a, b) => a.order - b.order);
      return json_({ ok: true, testimonials });
    }
    const values = data.action === 'delete' ? null : validatedValues_(data.testimonial);
    if (data.action !== 'create' && (typeof data.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(data.id))) throw new Error('ID inválido');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      let id = data.id;
      if (data.action === 'create') {
        id = Utilities.getUuid();
        aba.appendRow([id, new Date()].concat(values));
      } else {
        // Localiza novamente pelo ID dentro do lock: excluir uma linha muda os índices seguintes.
        const matches = rows_(aba).map((row, index) => String(row[0]) === id ? index + 2 : -1).filter(index => index >= 2);
        if (matches.length === 0) return json_({ ok: false, code: 'NOT_FOUND' });
        if (matches.length > 1) return json_({ ok: false, code: 'CONFLICT' });
        if (data.action === 'delete') aba.deleteRow(matches[0]);
        else aba.getRange(matches[0], 3, 1, 8).setValues([values]);
      }
      SpreadsheetApp.flush();
      return json_({ ok: true, id });
    } finally {
      lock.releaseLock();
    }
  } catch {
    return json_({ ok: false, code: 'INTEGRATION_ERROR' });
  }
}
