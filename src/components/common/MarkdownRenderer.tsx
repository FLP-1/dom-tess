'use client';

import React from 'react';
import { Box, Heading, Link, Image, Table, Thead, Tbody, Tr, Th, Td, Code, UnorderedList, OrderedList, ListItem, Text } from '@chakra-ui/react';
import { MarkdownRendererProps } from '../../types/markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, components }) => {
  const defaultComponents = {
    h1: ({ children }) => (
      <Heading as="h1" size="2xl" my={4} role="heading" aria-level={1}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading as="h2" size="xl" my={3} role="heading" aria-level={2}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading as="h3" size="lg" my={2} role="heading" aria-level={3}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading as="h4" size="md" my={2} role="heading" aria-level={4}>
        {children}
      </Heading>
    ),
    h5: ({ children }) => (
      <Heading as="h5" size="sm" my={1} role="heading" aria-level={5}>
        {children}
      </Heading>
    ),
    h6: ({ children }) => (
      <Heading as="h6" size="xs" my={1} role="heading" aria-level={6}>
        {children}
      </Heading>
    ),
    p: ({ children }) => (
      <Text mb={4}>{children}</Text>
    ),
    a: ({ href, children }) => (
      <Link
        href={href}
        color="blue.500"
        textDecoration="underline"
        isExternal={href?.startsWith('http')}
        aria-label={typeof children === 'string' ? children : undefined}
      >
        {children}
      </Link>
    ),
    img: ({ src, alt }) => (
      <Image
        src={src}
        alt={alt || ''}
        maxW="100%"
        my={4}
        loading="lazy"
        role="img"
        aria-label={alt || 'Imagem sem descrição'}
      />
    ),
    table: ({ children }) => (
      <Box overflowX="auto" my={4}>
        <Table variant="simple" role="table">
          {children}
        </Table>
      </Box>
    ),
    thead: ({ children }) => <Thead role="rowgroup">{children}</Thead>,
    tbody: ({ children }) => <Tbody role="rowgroup">{children}</Tbody>,
    tr: ({ children }) => <Tr role="row">{children}</Tr>,
    th: ({ children }) => <Th role="columnheader">{children}</Th>,
    td: ({ children }) => <Td role="cell">{children}</Td>,
    code: ({ inline, className, children }) => {
      const language = className?.replace('language-', '');
      return inline ? (
        <Code px={2} py={1}>
          {children}
        </Code>
      ) : (
        <Box
          as="pre"
          p={4}
          bg="gray.50"
          borderRadius="md"
          overflowX="auto"
          whiteSpace="pre-wrap"
          role="code"
          aria-label={`Bloco de código em ${language || 'texto plano'}`}
        >
          <Code className={className} display="block">
            {children}
          </Code>
        </Box>
      );
    },
    ul: ({ children }) => (
      <UnorderedList ml={4} mb={4} spacing={2} role="list">
        {children}
      </UnorderedList>
    ),
    ol: ({ children }) => (
      <OrderedList ml={4} mb={4} spacing={2} role="list">
        {children}
      </OrderedList>
    ),
    li: ({ children }) => <ListItem role="listitem">{children}</ListItem>,
    blockquote: ({ children }) => (
      <Box
        as="blockquote"
        borderLeft="4px"
        borderColor="gray.200"
        pl={4}
        py={2}
        my={4}
        role="blockquote"
      >
        {children}
      </Box>
    ),
  };

  return (
    <Box className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ ...defaultComponents, ...components }}
      >
        {markdown}
      </ReactMarkdown>
    </Box>
  );
}; 