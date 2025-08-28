const pedido = [];
let total = 0;

function adicionarItem(item) {
  pedido.push(item);

  // Atualiza a lista no HTML
  const listaPedido = document.getElementById('lista-pedido');
  const li = document.createElement('li');
  li.textContent = item;
  listaPedido.appendChild(li);

  // Extrai o preço do item (exemplo: "Burguer - R$ 15,00")
  const preco = extrairPreco(item);
  total += preco;

  atualizarTotal();
}

function extrairPreco(texto) {
  // Busca "R$ XX,XX" no texto e retorna como número float
  const regex = /R\$ (\d+),(\d{2})/;
  const resultado = regex.exec(texto);
  if (resultado) {
    return parseFloat(resultado[1] + '.' + resultado[2]);
  }
  return 0;
}

function atualizarTotal() {
  let totalElemento = document.getElementById('total-pedido');
  if (!totalElemento) {
    totalElemento = document.createElement('p');
    totalElemento.id = 'total-pedido';
    totalElemento.style.fontWeight = 'bold';
    const pedidoSection = document.getElementById('pedido');
    pedidoSection.appendChild(totalElemento);
  }
  totalElemento.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function enviarPedido() {
  if (pedido.length === 0) {
    alert('Seu pedido está vazio!');
    return;
  }

  const mensagem = encodeURIComponent(
    `Olá! Gostaria de fazer o pedido:\n\n${pedido.join('\n')}\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`
  );

  // Coloque seu número no formato internacional, sem espaços nem sinais
  const numeroWhatsapp = '555197652633';

  window.open(`https://wa.me/${numeroWhatsapp}?text=${mensagem}`, '_blank');
}
