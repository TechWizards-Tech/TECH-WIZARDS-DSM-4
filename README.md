# 🧪 Sistema para Coleta de Imagens de Microscópios Ópticos e Visualização Mobile/Web

> Projeto acadêmico — FATEC Jacareí • Curso: **Desenvolvimento de Software Multiplataforma (DSM)** • **4º semestre**

## 📌 Visão Geral
Em aulas que utilizam **microscópios ópticos**, cada estudante normalmente precisa visualizar o experimento **individualmente** no equipamento, o que limita a experiência didática.  
Este projeto propõe **especificar e construir** um sistema que permita **acoplar uma câmera digital** à ocular do microscópio e, utilizando uma **placa embarcada** (ex.: *Raspberry Pi*), **transmitir as imagens via Wi‑Fi** para um **servidor em nuvem**.  
As imagens poderão ser visualizadas **em tempo real** por meio de um **aplicativo mobile** e de uma **interface web**, com opção de **salvar capturas** selecionadas pelo usuário.

> O sistema deverá funcionar com os microscópios ópticos disponíveis na **Fatec Jacareí**.

---

## 🎯 Objetivos do Projeto
- **Coletar imagens** de microscópios ópticos por meio de uma câmera digital acoplada.
- **Transmitir** o fluxo de vídeo **via Wi‑Fi** para um **servidor em nuvem**.
- Disponibilizar **aplicativo mobile** e **interface web** para **visualização em tempo real**.
- Permitir **capturas de imagem** (snapshots) com **armazenamento** seguro.
- Garantir **compatibilidade** com os microscópios da Fatec Jacareí.
- Documentar arquitetura, instalação e uso para **reprodutibilidade**.

---

## 🏗️ Arquitetura (proposta)
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
      [Banco de Dados]  │
            │           ▼
        [Armazenamento de Imagens (S3/Blob)]
                        │
                        ▼
       [App Mobile]  +  [Web App]  ← tempo real e snapshots
```

## 🧰 Tecnologias (sugestão)
- **Embarcado**: Raspberry Pi OS, Python, 
- **Backend**: Python (Flask)
- **Web**: React
- **Mobile**: React Native

## 👥 Equipe
- Maria Eduarda Ferreira
- Pollyana Roberta
- Leandro Barbosa
- Felipe Correa
- Pamela Freitas
- Raquel Massae
- Bruna Caiado

- **Infra**: Docker, Docker Compose, CI/CD simples (GitHub Actions).

---
