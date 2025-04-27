const fs = require('fs');

const nomes = [
  'Arroz', 'Feijão', 'Café', 'Macarrão', 'Farinha de Trigo', 'Ovos', 'Cebola', 'Alho', 'Carne Bovina', 'Leite',
  'Açúcar', 'Óleo de Soja', 'Sabão em Pó', 'Cerveja', 'Detergente', 'Shampoo', 'Banana', 'Pão Francês', 'Iogurte', 'Biscoito Cream Cracker',
  'Refrigerante', 'Sabão em Barra', 'Creme Dental', 'Alface', 'Presunto', 'Queijo Mussarela', 'Margarina', 'Água Mineral', 'Pão Integral', 'Biscoito Maizena',
  'Suco de Laranja', 'Sabão Líquido', 'Desodorante', 'Tomate', 'Frango Congelado', 'Requeijão', 'Manteiga', 'Água Sanitária', 'Papel Higiênico', 'Cenoura',
  'Linguiça Toscana', 'Leite Condensado', 'Creme de Leite', 'Amaciante', 'Escova de Dentes', 'Batata', 'Mortadela', 'Iogurte Grego', 'Biscoito Recheado', 'Suco de Uva',
  'Sabão Líquido', 'Condicionador', 'Abobrinha', 'Salsicha', 'Leite Desnatado', 'Margarina', 'Desinfetante', 'Fio Dental', 'Maçã', 'Salame',
  'Leite Semidesnatado', 'Biscoito Água e Sal', 'Suco de Manga', 'Sabão Líquido', 'Sabonete', 'Pera', 'Presunto', 'Queijo Prato', 'Margarina', 'Água Mineral',
  'Pão de Forma', 'Biscoito Maria', 'Suco de Abacaxi', 'Ração para Cães', 'Ração para Gatos', 'Areia Sanitária', 'Desinfetante Pet', 'Shampoo Pet', 'Petisco para Cães', 'Petisco para Gatos',
  'Cenoura Baby', 'Beterraba', 'Couve', 'Espinafre', 'Laranja', 'Uva', 'Melancia', 'Abacaxi', 'Mamão', 'Limão',
  'Cerveja Artesanal', 'Vinho', 'Energético', 'Água de Coco', 'Chá Gelado', 'Suco Detox', 'Bolo de Cenoura', 'Pão de Queijo', 'Croissant', 'Rosca'
];

const marcas = [
  'Tio João', 'Camil', 'Pilão', 'Renata', 'Dona Benta', 'Granja Feliz', 'Natural', 'Friboi', 'Parmalat', 'União',
  'Soya', 'Omo', 'Skol', 'Ypê', 'Pantene', 'Padaria Central', 'Danone', 'Vitarella', 'Coca-Cola', 'Minuano',
  'Colgate', 'Americana', 'Sadia', 'Itambé', 'Qualy', 'Crystal', 'Pullman', 'Nestlé', 'Del Valle', 'Perdigão',
  'Mococa', 'Catilac', 'Aviação', 'Qboa', 'Neve', 'Comfort', 'Oral-B', 'Vigor', 'Trakinas', 'Seda',
  'Piracanjuba', 'Dori', 'Lysoform', 'Johnson & Johnson', 'Fuji', 'Williams', 'Primor', 'Minalba', 'Wickbold', 'Dove'
];

const categorias = [
  'Alimentos', 'Hortifruti', 'Carnes e Frios', 'Laticínios', 'Material de Limpeza', 'Bebidas', 'Higiene Pessoal', 'Padaria', 'Mercearia', 'Pet Shop'
];

const fotos = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80'
];

function slugify(str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

const produtos = [];
for (let i = 0; i < 100; i++) {
  const nome = nomes[i % nomes.length];
  const marca = marcas[i % marcas.length];
  const categoria = categorias[i % categorias.length];
  produtos.push({
    id: slugify(nome + '-' + marca),
    nome,
    marca,
    quantidade: Math.floor(Math.random() * 5) + 1,
    modelo: '',
    observacao: '',
    comprado: false,
    responsavel: '',
    foto: fotos[i % fotos.length],
    categoria
  });
}

fs.writeFileSync('produtosSupermercado.json', JSON.stringify(produtos, null, 2));
console.log('Arquivo produtosSupermercado.json gerado com sucesso!'); 