import { useState } from "react";

export default function App() { const [itens, setItens] = useState([]); const [nome, setNome] = useState(""); const [preco, setPreco] = useState(""); const [mesReferencia, setMesReferencia] = useState(""); const [meta, setMeta] = useState(""); const [listaCompras, setListaCompras] = useState([]);

const adicionar = () => { if (!nome || !preco || !mesReferencia) return; const precoNum = parseFloat(preco);

const existente = itens.find((i) => i.nome === nome);
let novoItem;

if (existente) {
  const diff = precoNum - existente.preco;
  const perc = ((diff / existente.preco) * 100).toFixed(2);

  novoItem = {
    ...existente,
    precoAnterior: existente.preco,
    preco: precoNum,
    variacao: perc,
    mesReferencia,
  };

  setItens(itens.map((i) => (i.nome === nome ? novoItem : i)));
} else {
  novoItem = {
    nome,
    preco: precoNum,
    precoAnterior: null,
    variacao: null,
    mesReferencia,
  };
  setItens([...itens, novoItem]);
}

setNome("");
setPreco("");
setMesReferencia("");

};

const adicionarLista = (produto) => { if (!produto) return; const existente = listaCompras.find((p) => p.nome === produto.nome); if (!existente) setListaCompras([...listaCompras, produto]); };

const removerLista = (nome) => { setListaCompras(listaCompras.filter((i) => i.nome !== nome)); };

const totalLista = listaCompras.reduce((acc, i) => acc + i.preco, 0);

const atualizarPrecoLista = (nome, novoPreco) => { const precoNum = parseFloat(novoPreco); const listaAtualizada = listaCompras.map((i) => { if (i.nome === nome) { const diff = precoNum - i.preco; const perc = ((diff / i.preco) * 100).toFixed(2); return { ...i, precoAnterior: i.preco, preco: precoNum, variacao: perc, }; } return i; }); setListaCompras(listaAtualizada); };

return ( <div className="p-4 max-w-xl mx-auto space-y-6"> <h1 className="text-2xl font-bold">Lista de Compras com Referência</h1>

<div className="grid grid-cols-4 gap-2">
    <input
      className="border p-2 col-span-1"
      placeholder="Produto"
      value={nome}
      onChange={(e) => setNome(e.target.value)}
    />
    <input
      className="border p-2 col-span-1"
      placeholder="Preço"
      value={preco}
      onChange={(e) => setPreco(e.target.value)}
    />
    <input
      className="border p-2 col-span-1"
      placeholder="Mês Ref. (ex: nov/2025)"
      value={mesReferencia}
      onChange={(e) => setMesReferencia(e.target.value)}
    />
    <button
      className="bg-blue-600 text-white rounded p-2 col-span-1"
      onClick={adicionar}
    >
      Salvar preço
    </button>
  </div>

  <div className="border p-4 rounded-lg space-y-2">
    <h2 className="font-semibold">Histórico de Preços</h2>
    {itens.map((i) => (
      <div
        key={i.nome}
        className="p-2 border rounded flex justify-between items-center"
      >
        <div>
          <p className="font-semibold">{i.nome}</p>
          <p>
            R$ {i.preco.toFixed(2)} ({i.mesReferencia})
          </p>
          {i.precoAnterior && (
            <p className={i.variacao > 0 ? "text-red-600" : "text-green-600"}>
              {i.variacao}% ({i.precoAnterior.toFixed(2)} → {i.preco.toFixed(2)})
            </p>
          )}
        </div>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => adicionarLista(i)}
        >
          Adicionar à lista
        </button>
      </div>
    ))}
  </div>

  <div className="border p-4 rounded-lg space-y-2">
    <h2 className="font-semibold">Lista de Compras Atual</h2>
    {listaCompras.map((i) => (
      <div key={i.nome} className="flex justify-between items-center border p-2 rounded">
        <div>
          <p className="font-semibold">{i.nome}</p>
          <p>Preço atual: R$ {i.preco.toFixed(2)}</p>
          {i.precoAnterior && (
            <p className={i.variacao > 0 ? "text-red-600" : "text-green-600"}>
              {i.variacao}%
            </p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="border p-1 w-20"
            placeholder="Novo preço"
            onChange={(e) => atualizarPrecoLista(i.nome, e.target.value)}
          />
          <button
            className="bg-red-600 text-white px-2 py-1 rounded"
            onClick={() => removerLista(i.nome)}
          >
            Remover
          </button>
        </div>
      </div>
    ))}

    <p className="font-bold text-lg mt-3">Total: R$ {totalLista.toFixed(2)}</p>

    {meta && (
      <p className={
        totalLista > parseFloat(meta) ? "text-red-600" : "text-green-600"
      }>
        {totalLista > parseFloat(meta)
          ? `Ultrapassou a meta por R$ ${(totalLista - parseFloat(meta)).toFixed(2)}`
          : `Dentro da meta. Restam R$ ${(parseFloat(meta) - totalLista).toFixed(2)}`}
      </p>
    )}
  </div>

  <div className="border p-4 rounded-lg space-y-3">
    <h2 className="font-semibold">Meta de Compras</h2>
    <input
      className="border p-2 w-full"
      placeholder="Digite sua meta: ex: 200"
      value={meta}
      onChange={(e) => setMeta(e.target.value)}
    />
  </div>
</div>

); }