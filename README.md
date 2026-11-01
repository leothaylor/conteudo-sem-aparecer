# Conteúdo Sem Aparecer — Landing page GitHub Pages

Projeto independente para o produto **Conteúdo Sem Aparecer**, de Leo / Rotina ACS.

**Estado:** pronto para revisão visual e implantação em repositório próprio. A página **NÃO está publicada** por esta entrega e **NÃO possui checkout ativo** até a configuração da URL real do novo produto da Hotmart (ID interno informado: `8855018`).

## Conteúdo criado

- `index.html`: página comercial completa, com 6 passos, explicação das ferramentas, três materiais, galeria com 6 artes reais, oferta e FAQ.
- `styles.css`: layout responsivo em desktop/tablet/celular.
- `site-config.js`: **único lugar para inserir o checkout Hotmart válido** e ajustar o preço exibido.
- `app.js`: ativa o botão apenas após configurar URL Hotmart segura; preserva `utm_*`, `src`, `sck` e `fbclid` recebidos na página; navegação da galeria.
- `assets/`: imagens otimizadas, extraídas das artes e PDFs do próprio produto, mais Open Graph local.
- `PREVIA_...` se houver: prévias de inspeção, não são necessárias para a publicação.

## Como abrir localmente

Abra `index.html` no navegador, de preferência com uma extensão simples como Live Server ou um servidor local. Sem dependências nem instalações pagas.

Se tiver Python instalado, no terminal desta pasta:

```powershell
python -m http.server 8000
```

Abra `http://localhost:8000/`.

## Publicação gratuita no GitHub Pages

1. No GitHub, crie **um repositório NOVO e vazio**, sugerido `conteudo-sem-aparecer` — não utilize nem modifique o repositório do SuperKit.
2. Envie para a raiz do novo repositório os arquivos `index.html`, `styles.css`, `app.js`, `site-config.js` e a pasta `assets/`.
3. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch**, `main` e `/(root)`.
4. Aguarde o status de publicação no próprio GitHub e abra a URL informada por ele. Se o usuário for `leothaylor` e o repositório tiver o nome sugerido, a URL **prevista**, ainda não confirmada, será `https://leothaylor.github.io/conteudo-sem-aparecer/`.
5. Confira no celular e no computador, com a galeria e os links internos.

**O GitHub Pages publica os arquivos em site estático.** Não é necessária uma página Hotmart Pages nem contrato de serviço adicional. O uso do domínio próprio, se desejado, fica para uma etapa futura.

## Ativação do checkout sem reescrever a página

Somente depois de o checkout do **novo produto** estar aprovado, abra `site-config.js` e substitua a string vazia:

```javascript
checkoutUrl: "",
```

pela **URL real e completa** do checkout Hotmart, copiada do painel do produto correto. Não use o link do SuperKit e não improvise IDs.

O botão "Checkout em configuração" será substituído automaticamente pelo botão de compra. O script preserva UTMs do visitante caso estejam presentes. Não envia dados para serviços de analytics.

Antes de divulgar:

- Confirmar ID do produto, oferta, preço, ZIP/PDF de entrega e status de vendas na Hotmart.
- Conferir o texto do anúncio e os termos efetivos da oferta na Hotmart.
- Trocar `<meta name="robots" content="noindex,nofollow">` por `index,follow` **apenas quando tudo estiver ativo e aprovado**.
- Configurar o Open Graph `og:image` com URL HTTPS absoluta, por exemplo a URL completa da imagem publicada em `assets/compartilhar.png`.
- Se usar domínio próprio, definir `<link rel="canonical">`, atualizar `og:url` e `og:image` para esse domínio e conferir HTTPS.
- Conferir SEO, a prévia do link no WhatsApp e Instagram, links e responsividade.
- Caso deseje medições, planejar implementação específica para este produto. **Não copiar GTM, Meta Pixel e GA4 do SuperKit**, pois as conversões e públicos são de outro produto.
- Não declarar checkout ativo sem confirmar uma navegação real até a oferta e o preço.

## O que não foi implementado

- Nenhuma compra, pagamento, checkout ativo ou URL Hotmart inventada.
- Nenhuma integração com anúncios, Meta Pixel, GTM, Clarity ou GA4.
- Nenhuma assinatura/serviço pago.
- Nenhum depoimento ou resultado comercial fictício.
- Nenhuma alteração nos sites existentes da operação.

## Procedência e transparência

A descrição da oferta foi adaptada de `04_Descricao_Hotmart.md` do pacote final V1.3. As imagens são amostras do produto e as seis artes fornecidas por Leo. O estudo de caso visual não afirma acesso a prompts históricos originais. Valor de teste: **R$ 47,90** informado para o cadastro novo.
