(async function(){
  var fixes = {"Celular Telefone": "Celular / Telefone", "Móveis e decoração": "Móveis e Decoração", "Utensílios e Eletrodomésticos": "Utensílios / Eletrodomésticos", "Táxi (sem reembolso). Aplicativo": "Táxi (sem reembolso) / Aplicativo", "Revisão Anual / Manut/ Conserto": "Revisão Anual / Manut / Cons", "Empresa / Aut.": "Empresa / Atividade Autônoma", "Cursos e Eventos / Empresa": "Cursos e Eventos Empresa", "Aplicativos / armazenamento": "Aplicativos / Armazenamento", "Higiene / Estética Produtos": "Higiene / Estética / Produtos", "Salão Beleza / Manicure": "Salão de Beleza / Manicure", "Clube filhos": "Clube Filhos", "Plano saúde filhos": "Plano Saúde Filhos", "Transferência": "Transferências"};
  var count = 0;
  for(var t of allData){
    if(t.deleted) continue;
    var changed = false;
    if(fixes[t.cat]){t.cat = fixes[t.cat]; changed = true;}
    if(fixes[t.tipo]){t.tipo = fixes[t.tipo]; changed = true;}
    if(changed){
      var row=[t.date,t.desc,(t.value||0).toFixed(2).replace('.',','),t.cat,t.tipo||t.cat,t.account,t.type,t.consolidated?'1':'0',t._transferId||'',t._isAdjust?'1':'',t._id||''];
      var payload=t._id
        ? {action:'update',id:String(t._id),data:row,sheet:'Transações'}
        : {action:'update',row:t._row,data:row,sheet:'Transações'};
      await sheetsPost(payload);
      count++;
    }
  }
  renderDash();
  alert('Concluído! '+count+' transações corrigidas.');
})();