# DOM V2 - TESS

Biblioteca de componentes React com foco em acessibilidade e usabilidade.

## Instalação

```bash
npm install @manus/dom-v2-tess
# ou
yarn add @manus/dom-v2-tess
```

## Uso

Importe os componentes necessários e utilize em sua aplicação:

```typescript
import { Button, Input, Select } from '@manus/dom-v2-tess';

function App() {
  return (
    <div>
      <Input label="Nome" />
      <Select label="Estado" options={[...]} />
      <Button>Enviar</Button>
    </div>
  );
}
```

## Documentação

Para mais informações sobre os componentes disponíveis e suas props, consulte a [documentação completa](docs/FormComponents.md).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to optimize and load
[Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js).
Your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).
For more details, check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
