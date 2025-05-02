'use client';

import React, { useRef, useCallback, useState } from 'react';
import { HStack, Input, IconButton, Box, useToast, Text, InputProps } from '@chakra-ui/react';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import { BaseInputProps } from '../../types/common';
import { withAccessibility } from '../../hocs/withAccessibility';

interface MessageInputCustomProps {
  chatType: 'group' | 'private';
  onSend?: (message: string, files?: File[]) => Promise<void>;
  maxFileSize?: number; // em MB
  allowedFileTypes?: string[];
  isLoading?: boolean;
}

type MessageInputProps = Omit<InputProps, 'onChange'> & MessageInputCustomProps & {
  onChange?: (value: string) => void;
};

const BaseMessageInput = React.forwardRef<HTMLInputElement, MessageInputProps>(
  (
    {
      value = '',
      onChange,
      onSend,
      chatType,
      maxFileSize = 10,
      allowedFileTypes = ['image/*', 'video/*', 'application/pdf'],
      isDisabled,
      isLoading,
      ...props
    },
    ref
  ) => {
    const [message, setMessage] = useState<string>(typeof value === 'string' ? value : '');
    const [files, setFiles] = useState<File[]>([]);
    const [isSending, setIsSending] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const handleMessageChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setMessage(newValue);
        onChange?.(newValue);
      },
      [onChange]
    );

    const handleFileChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        const invalidFiles = selectedFiles.filter(
          file => file.size > maxFileSize * 1024 * 1024
        );

        if (invalidFiles.length > 0) {
          toast({
            title: 'Arquivo muito grande',
            description: `Os arquivos devem ter no máximo ${maxFileSize}MB`,
            status: 'error',
            duration: 3000,
          });
          return;
        }

        setFiles(selectedFiles);
      },
      [maxFileSize, toast]
    );

    const handleSend = useCallback(async () => {
      if (!message.trim() && files.length === 0) return;

      try {
        setIsSending(true);
        await onSend?.(message, files);
        setMessage('');
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast({
          title: 'Erro ao enviar mensagem',
          description: error instanceof Error ? error.message : 'Tente novamente mais tarde',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setIsSending(false);
      }
    }, [message, files, onSend, toast]);

    const handleKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    return (
      <HStack spacing={2} width="100%">
        <IconButton
          aria-label="Anexar arquivo"
          icon={<FiPaperclip />}
          onClick={() => fileInputRef.current?.click()}
          variant="ghost"
          isDisabled={isDisabled || isLoading || isSending}
          title="Anexar arquivo"
        />
        <Input
          ref={ref}
          value={message}
          onChange={handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          isDisabled={isDisabled || isLoading || isSending}
          aria-label="Mensagem"
          {...props}
        />
        <IconButton
          aria-label="Enviar mensagem"
          icon={<FiSend />}
          colorScheme="blue"
          onClick={handleSend}
          isDisabled={isDisabled || isLoading || isSending || (!message.trim() && files.length === 0)}
          isLoading={isSending}
          title="Enviar mensagem"
        />
        <Box
          as="input"
          type="file"
          ref={fileInputRef}
          display="none"
          multiple
          accept={allowedFileTypes.join(',')}
          onChange={handleFileChange}
          aria-label="Selecionar arquivos"
        />
        {files.length > 0 && (
          <Box
            position="absolute"
            bottom="100%"
            left={0}
            right={0}
            p={2}
            bg="gray.100"
            borderTopRadius="md"
          >
            <Text fontSize="sm">
              {files.length} arquivo{files.length > 1 ? 's' : ''} selecionado{files.length > 1 ? 's' : ''}
            </Text>
          </Box>
        )}
      </HStack>
    );
  }
);

BaseMessageInput.displayName = 'BaseMessageInput';

const EnhancedMessageInput = withAccessibility(BaseMessageInput as React.ComponentType<BaseInputProps>);
export { EnhancedMessageInput as MessageInput }; 