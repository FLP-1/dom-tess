import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

interface ErrorMessageProps {
  title?: string;
  description: string;
}

export function ErrorMessage({ title = 'Erro', description }: ErrorMessageProps) {
  return (
    <Alert
      status="error"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="200px"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        {description}
      </AlertDescription>
    </Alert>
  );
} 