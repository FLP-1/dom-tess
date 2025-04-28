import { Box, Heading, VStack, Flex, Text, Button, Checkbox, Input, FormLabel, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, Select, FormControl } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './page.module.css';
import { EditIcon } from '@chakra-ui/icons';

type Produto = {
  id: string;
  nome: string;
  quantidade: number;
  marca: string;
  modelo: string;
  observacao: string;
  comprado: boolean;
  responsavel: string;
};

export default function GrupoComprasPage() {
  const router = useRouter();
  const params = useParams();
  const grupoId = Array.isArray(params?.grupoId) ? params.grupoId[0] : params?.grupoId;
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [grupoNome, setGrupoNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todos' | 'comprado' | 'falta'>('todos');
  const [ordem, setOrdem] = useState<'nome' | 'responsavel'>('nome');
  const [catalogo, setCatalogo] = useState<Produto[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [novoProduto, setNovoProduto] = useState({ nome: '', quantidade: 1, marca: '', modelo: '', observacao: '', responsavel: '', comprado: false });
  const [busca, setBusca] = useState('');
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  useEffect(() => {
    async function fetchGrupo() {
      setLoading(true);
      if (!grupoId) return;
      const grupoRef = doc(db, 'shoppingGroups', grupoId);
      const grupoSnap = await getDoc(grupoRef);
      if (grupoSnap.exists()) {
        const data = grupoSnap.data();
        setGrupoNome(data.nome || '');
        setProdutos(data.produtos || []);
      }
      setLoading(false);
    }
    fetchGrupo();
  }, [grupoId]);

  useEffect(() => {
    async function fetchCatalogo() {
      const snap = await getDocs(collection(db, 'products'));
      setCatalogo(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Produto)));
    }
    fetchCatalogo();
  }, []);

  const produtosFiltrados = produtos
    .filter(p =>
      filtro === 'todos' ? true : filtro === 'comprado' ? p.comprado : !p.comprado
    )
    .sort((a, b) => {
      if (ordem === 'nome') return a.nome.localeCompare(b.nome);
      if (ordem === 'responsavel') return a.responsavel.localeCompare(b.responsavel);
      return 0;
    });

  const toggleComprado = async (id: string) => {
    const idx = produtos.findIndex(p => p.id === id);
    if (idx === -1 || !grupoId) return;
    const updated = [...produtos];
    updated[idx] = { ...updated[idx], comprado: !updated[idx].comprado };
    setProdutos(updated);
    // Atualiza no Firestore
    const grupoRef = doc(db, 'shoppingGroups', grupoId);
    await updateDoc(grupoRef, { produtos: updated });
  };

  const handleAdicionarProduto = async () => {
    if (!grupoId) return;
    let produto = null;
    if (produtoSelecionado && produtoSelecionado !== 'novo') {
      produto = catalogo.find(p => p.id === produtoSelecionado);
      if (!produto) return;
      produto = { ...produto, id: Math.random().toString(36).slice(2), quantidade: 1, comprado: false, responsavel: '' };
    } else {
      produto = { ...novoProduto, id: Math.random().toString(36).slice(2) };
    }
    const updated = [...produtos, produto];
    setProdutos(updated);
    const grupoRef = doc(db, 'shoppingGroups', grupoId);
    await updateDoc(grupoRef, { produtos: updated });
    setProdutoSelecionado('');
    setNovoProduto({ nome: '', quantidade: 1, marca: '', modelo: '', observacao: '', responsavel: '', comprado: false });
    onClose();
  };

  const removerProduto = async (id: string) => {
    if (!grupoId) return;
    const updated = produtos.filter(p => p.id !== id);
    setProdutos(updated);
    const grupoRef = doc(db, 'shoppingGroups', grupoId);
    await updateDoc(grupoRef, { produtos: updated });
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    onOpen();
  };

  const handleSalvarEdicao = async () => {
    if (!produtoEditando || !grupoId) return;
    const updated = produtos.map(p => p.id === produtoEditando.id ? produtoEditando : p);
    setProdutos(updated);
    const grupoRef = doc(db, 'shoppingGroups', grupoId);
    await updateDoc(grupoRef, { produtos: updated });
    setProdutoEditando(null);
    onClose();
  };

  return (
    <Box>
      <Button mb={4} onClick={() => router.back()} colorScheme="gray" size="sm">Voltar</Button>
      <Heading as="h2" size="md" mb={4} color="blue.700">Produtos do Grupo: {grupoNome}</Heading>
      <Flex mb={4} gap={2} flexWrap="wrap">
        <Box>
          <FormLabel htmlFor="filtro-produtos" fontSize="0.9rem" mb={0}>Filtro</FormLabel>
          <Select
            id="filtro-produtos"
            value={filtro}
            onChange={e => setFiltro(e.target.value as any)}
            width="auto"
            mb={2}
            borderRadius={6}
            borderColor="#CBD5E0"
            padding={2}
          >
            <option value="todos">Todos</option>
            <option value="falta">Falta Comprar</option>
            <option value="comprado">Comprados</option>
          </Select>
        </Box>
        <Box>
          <FormLabel htmlFor="ordem-produtos" fontSize="0.9rem" mb={0}>Ordenar</FormLabel>
          <Select
            id="ordem-produtos"
            value={ordem}
            onChange={e => setOrdem(e.target.value as any)}
            width="auto"
            mb={2}
            borderRadius={6}
            borderColor="#CBD5E0"
            padding={2}
          >
            <option value="nome">Ordenar por Nome</option>
            <option value="responsavel">Ordenar por Responsável</option>
          </Select>
        </Box>
        <Button colorScheme="blue" size="sm" onClick={onOpen}>Adicionar Produto</Button>
      </Flex>
      {loading ? (
        <Flex justify="center" align="center" minH="100px"><Spinner /></Flex>
      ) : (
        <VStack align="stretch" spacing={3}>
          {produtosFiltrados.map(produto => (
            <Flex key={produto.id} align="center" justify="space-between" p={3} bg="white" borderRadius="md" boxShadow="sm">
              <Checkbox isChecked={produto.comprado} onChange={() => toggleComprado(produto.id)} mr={3} colorScheme="green" />
              <Box flex={1} minW={0}>
                <Text as={produto.comprado ? 's' : undefined} fontWeight="bold" isTruncated>{produto.nome}</Text>
                <Text fontSize="sm" color="gray.600" isTruncated>
                  {produto.quantidade}x {produto.marca} {produto.modelo} {produto.observacao && `- ${produto.observacao}`}
                </Text>
                <Text fontSize="xs" color="gray.500">Responsável: {produto.responsavel}</Text>
              </Box>
              <Button colorScheme="yellow" size="xs" ml={2} onClick={() => handleEditarProduto(produto)} leftIcon={<EditIcon />}>Editar</Button>
              <Button colorScheme="red" size="xs" ml={2} onClick={() => removerProduto(produto.id)}>Remover</Button>
            </Flex>
          ))}
        </VStack>
      )}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor="select-produto-catalogo">Buscar no catálogo</FormLabel>
              <select
                id="select-produto-catalogo"
                title="Buscar no catálogo"
                aria-label="Buscar no catálogo"
                value={produtoSelecionado}
                onChange={e => setProdutoSelecionado(e.target.value)}
                className={styles.selectCatalogo}
              >
                <option value="">Selecione um produto</option>
                {catalogo.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase())).map(p => (
                  <option key={p.id} value={p.id}>{p.nome} {p.marca && `- ${p.marca}`}</option>
                ))}
                <option value="novo">Novo produto</option>
              </select>
            </FormControl>
            {produtoSelecionado === 'novo' && (
              <>
                <FormLabel>Nome</FormLabel>
                <Input value={novoProduto.nome} onChange={e => setNovoProduto({ ...novoProduto, nome: e.target.value })} mb={2} />
                <FormLabel>Quantidade</FormLabel>
                <Input type="number" value={novoProduto.quantidade} onChange={e => setNovoProduto({ ...novoProduto, quantidade: Number(e.target.value) })} mb={2} />
                <FormLabel>Marca</FormLabel>
                <Input value={novoProduto.marca} onChange={e => setNovoProduto({ ...novoProduto, marca: e.target.value })} mb={2} />
                <FormLabel>Modelo</FormLabel>
                <Input value={novoProduto.modelo} onChange={e => setNovoProduto({ ...novoProduto, modelo: e.target.value })} mb={2} />
                <FormLabel>Observação</FormLabel>
                <Input value={novoProduto.observacao} onChange={e => setNovoProduto({ ...novoProduto, observacao: e.target.value })} mb={2} />
                <FormLabel>Responsável</FormLabel>
                <Input value={novoProduto.responsavel} onChange={e => setNovoProduto({ ...novoProduto, responsavel: e.target.value })} mb={2} />
              </>
            )}
            {produtoSelecionado && produtoSelecionado !== 'novo' && (
              <>
                <FormLabel>Quantidade</FormLabel>
                <Input type="number" value={novoProduto.quantidade} onChange={e => setNovoProduto({ ...novoProduto, quantidade: Number(e.target.value) })} mb={2} />
                <FormLabel>Responsável</FormLabel>
                <Input value={novoProduto.responsavel} onChange={e => setNovoProduto({ ...novoProduto, responsavel: e.target.value })} mb={2} />
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAdicionarProduto} isDisabled={produtoSelecionado === '' && !novoProduto.nome}>
              Adicionar
            </Button>
            <Button onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={!!produtoEditando} onClose={() => setProdutoEditando(null)} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormLabel>Nome</FormLabel>
            <Input value={produtoEditando?.nome || ''} onChange={e => setProdutoEditando(p => p ? { ...p, nome: e.target.value } : p)} mb={2} />
            <FormLabel>Quantidade</FormLabel>
            <Input type="number" value={produtoEditando?.quantidade || 1} onChange={e => setProdutoEditando(p => p ? { ...p, quantidade: Number(e.target.value) } : p)} mb={2} />
            <FormLabel>Marca</FormLabel>
            <Input value={produtoEditando?.marca || ''} onChange={e => setProdutoEditando(p => p ? { ...p, marca: e.target.value } : p)} mb={2} />
            <FormLabel>Modelo</FormLabel>
            <Input value={produtoEditando?.modelo || ''} onChange={e => setProdutoEditando(p => p ? { ...p, modelo: e.target.value } : p)} mb={2} />
            <FormLabel>Observação</FormLabel>
            <Input value={produtoEditando?.observacao || ''} onChange={e => setProdutoEditando(p => p ? { ...p, observacao: e.target.value } : p)} mb={2} />
            <FormLabel>Responsável</FormLabel>
            <Input value={produtoEditando?.responsavel || ''} onChange={e => setProdutoEditando(p => p ? { ...p, responsavel: e.target.value } : p)} mb={2} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSalvarEdicao}>Salvar</Button>
            <Button onClick={() => setProdutoEditando(null)}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 