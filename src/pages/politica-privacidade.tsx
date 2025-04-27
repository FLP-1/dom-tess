import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Typography, Box } from '@mui/material';
import { politicaPrivacidade } from '../constants/legalTexts';

const PoliticaPrivacidade: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${politicaPrivacidade.title} - DOM`}</title>
        <meta name="description" content={politicaPrivacidade.metaDescription} />
      </Head>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {politicaPrivacidade.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {politicaPrivacidade.lastUpdate} {new Date().toLocaleDateString('pt-BR')}
          </Typography>
        </Box>

        {politicaPrivacidade.sections.map((section, index) => (
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

export default PoliticaPrivacidade; 