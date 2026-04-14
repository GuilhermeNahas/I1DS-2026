## Documento de Especificação: Arquitetura Segura para IA Corporativa via Óculos AR

A integração de dispositivos de Realidade Aumentada (AR) em ambientes corporativos exige um rigoroso controle sobre a transmissão de dados sensíveis, como telemetria, localização e consultas à Inteligência Artificial. A presente especificação formaliza uma arquitetura de segurança moderna, desenhada para proteger o tráfego de ponta a ponta, mitigar interceptações e adulterações, e respeitar as severas restrições de processamento e bateria inerentes aos dispositivos vestíveis.

A solução abandona o uso de chaves simétricas globais e adota uma abordagem híbrida, garantindo que o compromisso de um único dispositivo não coloque toda a frota em risco, além de vincular matematicamente a identidade do usuário ao conteúdo transmitido.

---

### 1. Pilares Tecnológicos e Justificativas

A segurança do sistema é sustentada por três escolhas de design fundamentais, esquematizadas abaixo para fácil compreensão:

- **Eficiência de Bateria (EdDSA/Ed25519):** Em vez do tradicional e pesado RSA, os óculos utilizam curvas elípticas (Ed25519) dentro do seu Enclave Seguro (TEE) para assinar os tokens de acesso (JWT). Isso garante assinaturas muito mais rápidas, menor consumo de energia e pacotes de rede menores.
- **Isolamento de Chaves (HPKE):** A criptografia do conteúdo (payload) não depende mais de uma "chave mestra" compartilhada. O sistema utiliza HPKE (_Hybrid Public Key Encryption_). O óculos usa a chave pública do servidor para empacotar os dados. Apenas o servidor possui a chave privada necessária para abrir esse pacote, eliminando o risco de distribuição de chaves.
- **Prevenção contra Troca de Dados (_Cryptographic Binding_):** Para evitar que um invasor intercepte um token válido e o anexe a um arquivo malicioso, o sistema cria uma "amarração criptográfica". O JWT inclui um campo (`c_hash`) que contém a "impressão digital" (hash SHA-256) exata do pacote de dados.

---

### 2. Esquematização do Fluxo de Comunicação

O processo de envio e validação de dados ocorre em quatro fases distintas, operando em cadeia:

#### Fase A: Origem Segura (No Dispositivo AR)

1.  **Coleta e Criptografia:** O dispositivo coleta a requisição (ex: comando de voz ou imagem) e a criptografa usando o protocolo HPKE com a chave pública do servidor. O resultado é um "Pacote Opaco".
2.  **Geração da Identidade Digital:** O dispositivo calcula o hash SHA-256 deste Pacote Opaco.
3.  **Assinatura:** O dispositivo gera um token JWT contendo a identidade do usuário, o tempo de expiração curto, um identificador único contra repetições (`jti`) e insere o hash calculado no passo anterior dentro da variável `c_hash`. Tudo isso é assinado com a chave privada Ed25519 armazenada no chip de segurança do óculos.

#### Fase B: Trânsito em Rede

- **Encapsulamento mTLS:** O dispositivo estabelece uma conexão mTLS (Autenticação Mútua via TLS) com o servidor, garantindo que o óculos e o servidor comprovem suas identidades antes de qualquer envio de dados, frustrando ataques de interceptação em redes Wi-Fi ou 3G comprometidas. O JWT vai no cabeçalho (_Header_) e o Pacote Opaco no corpo da requisição (_Body_).

#### Fase C: Portão de Entrada (Gateway / Auth Service)

1.  **Triagem Inicial:** O Gateway recebe os dados e verifica se o JWT possui uma assinatura Ed25519 válida, consultando a chave pública correspondente àquele óculos.
2.  **Proteção Temporal:** O servidor valida se o token não está expirado e verifica no cache se o identificador único (`jti`) já foi usado nos últimos segundos (mecanismo _anti-replay_).
3.  **Auditoria de Integridade (A Prova Final):** O servidor calcula o hash SHA-256 do pacote opaco recebido e compara com o valor `c_hash` descrito no JWT. Se forem diferentes, o pacote foi adulterado em trânsito e a requisição é sumariamente descartada.

#### Fase D: Processamento e Resposta (AI Backend)

1.  **Abertura do Cofre:** Com a autenticação validada, o Pacote Opaco é entregue ao núcleo do sistema (Backend da IA), que está protegido em um ambiente seguro (TEE do Servidor ou HSM).
2.  **Ação:** O Backend utiliza sua Chave Privada HPKE para descriptografar os dados reais da requisição em texto claro.
3.  **Resposta:** A IA processa a solicitação respeitando as permissões do usuário estabelecidas no JWT e devolve a resposta pelo mesmo túnel seguro.

---

### Conclusão

Esta arquitetura transforma um modelo de confiança cega (onde chaves simétricas podem ser extraídas do hardware) em um modelo _Zero Trust_ robusto. A introdução do **Binding Criptográfico** e da **Criptografia Híbrida** blinda a operação contra manipulação de pacotes, enquanto a escolha cuidadosa dos algoritmos garante que o dispositivo vestível opere com máxima eficiência energética e baixa latência.
