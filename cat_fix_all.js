(async function(){
  var fixes = {"Aplicativos / armazenamento": "Aplicativos / Armazenamento", "Celular / Telefone": "Celular Telefone", "Celular filhos": "Celular Filhos", "Clube filhos": "Clube Filhos", "Combo TV + Internet + Telefone": "Combo TV + Internet + Tel", "Consultoria": "Consultorias", "Contador": "Contabilidade", "CRF / TRF Anuidade": "CREF / TEF anuidade", "Cursos e Eventos / Empresa": "Cursos e Eventos Empresa", "Estacionamento / Taxi / Empresa": "Estacionamento/Taxi / Empresa", "Higiene / Estética": "Higiene / Estética / Produtos", "IMSS / IR (PF)": "INSS / IR (PF)", "Lazer e Informação": "Lazer", "Livros e materiais": "Material Escolar", "Móveis e decoração": "Móveis e Decoração", "NEXUS": "Nexus / Vistage", "Nexus/Vistage": "Nexus / Vistage", "Plano saúde filhos": "Plano Saúde Filhos", "Salão Beleza / Manicure": "Salão de Beleza / Manicure", "Seguro do Carro": "Seguro Automóvel", "Taxi filhos": "Táxi Filhos", "Terapia.Massagem.Tratamentos": "Terapia / Massagem / Tratamento", "Utensílios / Eletrodomésticos": "Utensílios e Eletrodomésticos"};

  // 1. Corrige transações no Sheets
  var count = 0;
  for(var t of allData){
    if(t.deleted) continue;
    var changed = false;
    if(fixes[t.cat]){t.cat = fixes[t.cat]; changed = true;}
    if(fixes[t.tipo]){t.tipo = fixes[t.tipo]; changed = true;}
    if(changed){
      var row=[t.date,t.desc,(t.value||0).toFixed(2).replace('.',','),t.cat,t.tipo||t.cat,t.account,t.type,t.consolidated?'1':'0',t._transferId||'',t._isAdjust?'1':'',t._id||''];
      var payload=t._id ? {action:'update',id:String(t._id),data:row,sheet:'Transações'} : {action:'update',row:t._row,data:row,sheet:'Transações'};
      await sheetsPost(payload);
      count++;
    }
  }
  console.log('Transações corrigidas:', count);

  // 2. Corrige orcData para ALE e SI
  var orcCount = 0;
  ['ALE','SI'].forEach(function(u){
    if(!orcData[u]) return;
    Object.keys(orcData[u]).forEach(function(pasta){
      var cats = orcData[u][pasta];
      Object.keys(cats).forEach(function(cat){
        if(fixes[cat]){
          var correto = fixes[cat];
          // Merge: se já existe o nome correto, some os valores; senão renomeia
          if(cats[correto]){
            // Mantém o correto, remove o errado
            delete cats[cat];
          } else {
            cats[correto] = cats[cat];
            delete cats[cat];
          }
          orcCount++;
          console.log(u+' orcData:', pasta, '→', cat, '→', correto);
        }
      });
    });
  });
  console.log('orcData corrigidos:', orcCount);

  // 3. Salva orcData
  saveOrc();
  renderDash();
  alert('Concluído!\n'+count+' transações corrigidas\n'+orcCount+' categorias do orçamento atualizadas');
})();