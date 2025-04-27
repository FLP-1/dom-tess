import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Typography, Box } from '@mui/material';
import { termosDeUso } from '../constants/legalTexts';

const TermosDeUso: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${termosDeUso.title} - DOM`}</title>
        <meta name="description" content={termosDeUso.metaDescription} />
      </Head>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {termosDeUso.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {termosDeUso.lastUpdate} {new Date().toLocaleDateString('pt-BR')}
          </Typography>
        </Box>

        {termosDeUso.sections.map((section, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              {section.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {section.content}
            </Typography>
            {section.items && (
              <Typography variant="body1" component="ul" paragraph>
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{item}</li>
                ))}
              </Typography>
            )}
          </Box>
        ))}
      </Container>
    </>
  );
};

export default TermosDeUso; 