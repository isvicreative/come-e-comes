const pedido = [];
let total = 0;

const listaPedido = document.getElementById('lista-pedido');
const totalPedido = document.getElementById('total-pedido');
const btnFinalizar = document.getElementById('finalizar-pedido');

const modal = document.getElementById('modal-ingredientes');
const formIngredientes = document.getElementById('form-ingredientes');
const btnCancelar = document.getElementById('btn-cancelar');
const btnConfirmar = document.getElementById('btn-confirmar');

let itemSelecionado = null; 
let ingredientesOriginais = [];
let ingredientesParaRemover = [];

document.querySelectorAll('.btn-adicionar').forEach(botao => {
  botao.addEventListener('click', () => {
    const itemDiv = botao.closest('.item');
    const nome = itemDiv.getAttribute('data-nome');
    const preco = parseFloat(itemDiv.getAttribute('data-preco'));
    const ingredientes = itemDiv.getAttribute('data-ingredientes').split(',').map(i => i.trim());

    itemSelecionado = { nome, precoUnitario: preco };
    ingredientesOriginais = ingredientes;
    ingredientesParaRemover = [];

    // Se tiver só 1 ingrediente ou menos, adiciona direto sem modal
    if (ingredientes.length <= 1) {
      adicionarItemPersonalizado(nome, preco, []);
    } else {
      abrirModal(ingredientes);
    }
  });
});

function abrirModal(ingredientes) {
  formIngredientes.innerHTML = '';
  ingredientes.forEach((ingrediente, i) => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.textAlign = 'left';
    label.style.marginBottom = '6px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = ingrediente;
    checkbox.id = `ingrediente-${i}`;

    checkbox.addEventListener('change', e => {
      if (e.target.checked) {
        ingredientesParaRemover.push(e.target.value);
      } else {
        ingredientesParaRemover = ingredientesParaRemover.filter(x => x !== e.target.value);
      }
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + ingrediente));

    formIngredientes.appendChild(label);
  });

  modal.style.display = 'block';
}

btnCancelar.onclick = () => {
  modal.style.display = 'none';
};

btnConfirmar.onclick = () => {
  modal.style.display = 'none';
  adicionarItemPersonalizado(itemSelecionado.nome, itemSelecionado.precoUnitario, ingredientesParaRemover);
};

window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
}

function adicionarItemPersonalizado(nome, precoUnitario, ingredientesRemovidos) {
  const chave = `${nome}___${ingredientesRemovidos.sort().join(',')}`;
  const index = pedido.findIndex(i => i.chave === chave);

  if (index > -1) {
    pedido[index].quantidade++;
  } else {
    pedido.push({
      chave,
      nome,
      precoUnitario,
      quantidade: 1,
      ingredientesRemovidos
    });
  }

  atualizarPedido();
}

function atualizarPedido() {
  listaPedido.innerHTML = '';
  total = 0;

  pedido.forEach((item, index) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <span class="quantidade">${item.quantidade}x</span> ${item.nome}
      ${item.ingredientesRemovidos.length > 0 ? `<span class="removidos">(sem ${item.ingredientesRemovidos.join(', ')})</span>` : ''}
      <button class="remover" data-index="${index}">X</button>
    `;

    listaPedido.appendChild(li);

    total += item.precoUnitario * item.quantidade;
  });

  totalPedido.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  document.querySelectorAll('#lista-pedido button.remover').forEach(botao => {
    botao.onclick = (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      removerItemPedido(idx);
    };
  });
}

function removerItemPedido(index) {
  pedido.splice(index, 1);
  atualizarPedido();
}

btnFinalizar.onclick = () => {
  if (pedido.length === 0) {
    alert('Seu pedido está vazio!');
    return;
  }

  let mensagem = 'Olá, gostaria de fazer o pedido:\n';

  pedido.forEach(item => {
    mensagem += `- ${item.quantidade}x ${item.nome}`;
    if (item.ingredientesRemovidos.length > 0) {
      mensagem += ` (sem ${item.ingredientesRemovidos.join(', ')})`;
    }
    mensagem += '\n';
  });

  mensagem += `Total: R$ ${total.toFixed(2).replace('.', ',')}`;

  const numeroWhatsapp = '5551997652633';
  const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

  window.open(urlWhatsapp, '_blank');
};
