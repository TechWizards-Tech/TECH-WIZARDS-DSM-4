# 🧪 Sistema para Coleta de Imagens de Microscópios Ópticos e Visualização Mobile/Web

> Projeto acadêmico — FATEC Jacareí • Curso: **Desenvolvimento de Software Multiplataforma (DSM)** • **4º semestre**

---

## Objetivo do Projeto
O sistema permite **coletar imagens e vídeos de microscópios ópticos** por meio de uma câmera digital acoplada, transmitir o fluxo de vídeo **em tempo real** via Wi‑Fi para um **servidor em nuvem**, e disponibilizar **aplicativo mobile** e **interface web** para visualização e armazenamento de **snapshots**.  
O projeto atende aos microscópios disponíveis na Fatec Jacareí e visa **melhorar a experiência didática dos alunos**.

---

## Tecnologias Utilizadas
- **Embarcado**: Raspberry Pi OS, Python  
- **Backend**: Python (Flask)  
- **Web**: React  
- **Mobile**: React Native  
- **CI/CD e automação**: GitHub Actions, Jest, ESLint, Prettier, npm audit  
- **Gerenciamento de tarefas**: Trello / GitHub Projects  

---

## Fluxo de Desenvolvimento
O versionamento segue o modelo de branches:

- `main` → branch principal (protegida, apenas merges via Pull Request)  
- `dev` → branch de integração  
- `feature/` → branches de novas funcionalidades  

---


## 📸 Galeria

<p align="center">
  <img src="https://raw.githubusercontent.com/TechWizards-Tech/TECH-WIZARDS-DSM-4/main/documentos/DSM-4.jpeg" width="350">
  <img src="https://raw.githubusercontent.com/TechWizards-Tech/TECH-WIZARDS-DSM-4/main/documentos/dsm-4%20(2).jpeg" width="350">
</p>

---
## Integração e Entrega Contínua (CI/CD do Projeto)

O projeto possui **workflow automatizado** de CI que executa **lint, prettier e testes unitários** via GitHub Actions.  
Todos os requisitos IEC.01 e IEC.02 foram cumpridos.  

| Item | Descrição | Status (✓ / ✗) |
|------|-----------|----------------|
| 1 | Repositório privado com README inicial | ✓ |
| 2 | Colaboradores adicionados | ✓ |
| 3 | Branches configuradas: `main`, `dev`, `feature/` | ✓ |
| 4 | Proteção da `main` configurada (apenas PRs) | ✓ |
| 5 | Pull Request criado e revisado | ✓ |
| 6 | GitHub Actions configurado com workflow inicial | ✓ |
| 7 | ESLint integrado ao pipeline | ✓ |
| 8 | Prettier integrado ao pipeline | ✓ |
| 9 | Jest configurado com testes unitários e mocks | ✓ |
| 10 | Pipeline executa automaticamente em commits/PRs | ✓ |
| 11 | Pipeline falha em caso de erro de lint/teste | ✓ |
| 12 | Documentação no README descrevendo o CI/CD | ✓ |
| 13 | Tarefa “IEC.01 – Concluído” marcada no Trello/GitHub Projects | ✓ |
| 14 | Testes avançados, cobertura e segurança (IEC.02) | ✓ |

---

## 🏗️ Arquitetura do Sistema (proposta)

```
[Câmera acoplada ao microscópio]
            │
            ▼
   [Placa embarcada - ex.: Raspberry Pi]
            │  captura/stream (RTSP/WebRTC/HTTP)
       ┌────┴──────────────────────────────────┐
       │         Rede Wi‑Fi         │
       └────┬──────────────────────────────────┘
            │
            ▼
      [Servidor em Nuvem / Backend API]
            │           │  
            │           ▼
           [Stream de Video]
                        │
                        ▼
       [App Mobile]  +  [Web App]  ← tempo real e snapshots
```

---

## Organização do Projeto
- `/app` → código-fonte do aplicativo, mobile e web  
- `/app/tests` → testes unitários e mocks (Jest)  
- `.github/workflows` → configuração do GitHub Actions  

---

## Equipe
- Maria Eduarda Ferreira  (PO)
- Pollyana Roberta  (SM)
- Leandro Barbosa  (DEV)
- Felipe Correa  (DEV)
- Pamela Freitas  (DEV)
- Raquel Massae  (DEV)
- Bruna Caiado  (DEV)

---

## Status da Entrega
- [x] IEC.01 – Pipeline inicial configurado  
- [x] IEC.02 – Testes automatizados e segurança do pipeline  
- [ ] IEC.03 – Em andamento

---

## Referências
- [Documentação GitHub Actions](https://docs.github.com/en/actions)  
- [ESLint Docs](https://eslint.org/docs/latest/)  
- [Prettier Docs](https://prettier.io/docs/en/)  
- [Jest Docs](https://jestjs.io/docs/getting-started)
