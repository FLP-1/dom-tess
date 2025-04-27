"use client";

import { useState } from "react";
import { Button, Box, Heading, Text, Alert, AlertIcon, Stack } from "@chakra-ui/react";
import * as XLSX from "xlsx";

export default function MassaTestePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosSuccess, setProdutosSuccess] = useState(false);
  const [produtosError, setProdutosError] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setSuccess(false);
    setError("");
    setJsonData(null);
    try {
      const res = await fetch("/api/devtools/seed", { method: "POST" });
      if (!res.ok) throw new Error("Erro ao gerar massa de teste");
      const data = await res.json();
      setSuccess(true);
      setJsonData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!jsonData) return;
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "massa_teste.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = () => {
    if (!jsonData) return;
    const wb = XLSX.utils.book_new();
    // Usuários
    const wsUsuarios = XLSX.utils.json_to_sheet(jsonData.usuarios || []);
    XLSX.utils.book_append_sheet(wb, wsUsuarios, "Usuarios");
    // Grupos
    const wsGrupos = XLSX.utils.json_to_sheet(jsonData.grupos || []);
    XLSX.utils.book_append_sheet(wb, wsGrupos, "Grupos");
    // Parceiros
    const wsParceiros = XLSX.utils.json_to_sheet(jsonData.parceiros || []);
    XLSX.utils.book_append_sheet(wb, wsParceiros, "Parceiros");
    // Salvar arquivo
    XLSX.writeFile(wb, "massa_teste.xlsx");
  };

  const handleSeedProdutos = async () => {
    setLoading(true);
    setProdutosSuccess(false);
    setProdutosError("");
    try {
      // Carregar o JSON via fetch da pasta public
      const resJson = await fetch("/produtosSupermercado.json");
      const produtosSupermercado = await resJson.json();

      const res = await fetch("/api/devtools/produtos-supermercado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtosSupermercado)
      });
      if (!res.ok) throw new Error("Erro ao popular produtos");
      setProdutosSuccess(true);
      setProdutos(produtosSupermercado);
    } catch (err) {
      setProdutosError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadProdutosJSON = () => {
    if (!produtos.length) return;
    const blob = new Blob([JSON.stringify(produtos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "produtos_supermercado.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadProdutosExcel = () => {
    if (!produtos.length) return;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(produtos);
    XLSX.utils.book_append_sheet(wb, ws, "ProdutosSupermercado");
    XLSX.writeFile(wb, "produtos_supermercado.xlsx");
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={8} bg="white" borderRadius="lg" boxShadow="md">
      <Heading as="h2" size="lg" mb={4} color="brand.blue">
        Gerar Massa de Teste
      </Heading>
      <Text mb={6} color="gray.600">
        Clique no botão abaixo para popular o Firestore com dados de exemplo (parceiros, grupos e usuários).
      </Text>
      <Button colorScheme="blue" onClick={handleSeed} isLoading={loading} width="full">
        Gerar Massa de Teste
      </Button>
      {success && (
        <Alert status="success" mt={4} borderRadius="md">
          <AlertIcon /> Massa de teste gerada com sucesso!
        </Alert>
      )}
      {error && (
        <Alert status="error" mt={4} borderRadius="md">
          <AlertIcon /> {error}
        </Alert>
      )}
      {jsonData && (
        <Stack mt={4} spacing={3}>
          <Button colorScheme="green" width="full" onClick={handleDownloadJSON}>
            Baixar JSON da Massa de Teste
          </Button>
          <Button colorScheme="yellow" width="full" onClick={handleDownloadExcel}>
            Baixar Excel da Massa de Teste
          </Button>
        </Stack>
      )}
      <Button colorScheme="purple" onClick={handleSeedProdutos} width="full" mt={4}>
        Popular produtos de supermercado
      </Button>
      {produtosSuccess && (
        <Alert status="success" mt={4} borderRadius="md">
          <AlertIcon /> Produtos de supermercado populados com sucesso!
        </Alert>
      )}
      {produtosError && (
        <Alert status="error" mt={4} borderRadius="md">
          <AlertIcon /> {produtosError}
        </Alert>
      )}
      {produtos.length > 0 && (
        <Stack mt={4} spacing={3}>
          <Button colorScheme="green" width="full" onClick={handleDownloadProdutosJSON}>
            Baixar JSON dos Produtos
          </Button>
          <Button colorScheme="yellow" width="full" onClick={handleDownloadProdutosExcel}>
            Baixar Excel dos Produtos
          </Button>
        </Stack>
      )}
    </Box>
  );
} 