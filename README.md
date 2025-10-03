# 🧪 Sistema para Coleta de Imagens de Microscópios Ópticos e Visualização Mobile/Web

> Projeto acadêmico — FATEC Jacareí • Curso: **Desenvolvimento de Software Multiplataforma (DSM)** • **4º semestre**

## 📌 Visão Geral
Em aulas que utilizam **microscópios ópticos**, cada estudante normalmente precisa visualizar o experimento **individualmente** no equipamento, o que limita a experiência didática.  
Este projeto propõe **especificar e construir** um sistema que permita **acoplar uma câmera digital** à ocular do microscópio e, utilizando uma **placa embarcada** (ex.: *Raspberry Pi*), **transmitir as imagens via Wi‑Fi** para um **servidor em nuvem**.  
As imagens poderão ser visualizadas **em tempo real** por meio de um **aplicativo mobile** e de uma **interface web**, com opção de **salvar capturas** selecionadas pelo usuário.

> O sistema deverá funcionar com os microscópios ópticos disponíveis na **Fatec Jacareí**.

---

## ✅ Requisitos Funcionais 
1. O sistema deve capturar imagens e vídeos de microscópios ópticos por meio de uma câmera acoplada.
2. O sistema deve transmitir o fluxo de vídeo em tempo real para um servidor em nuvem.
3. O sistema deve disponibilizar uma aplicação web e uma aplicação mobile para visualização das imagens em tempo real.
4. O sistema deve permitir ao usuário realizar capturas (snapshots) e salvar imagens selecionadas.
5. O sistema deve garantir compatibilidade com os microscópios disponíveis na Fatec Jacareí.
6. O sistema deve permitir múltiplos acessos simultâneos (ex.: toda a turma visualizando a mesma amostra).

## ⚙ Requisitos Não Funcionais
1. O sistema deve ser acessível em dispositivos móveis (Android) e navegadores web.
2. A transmissão deve ter baixa latência, garantindo experiência em tempo real.
3. O sistema deve ser escalável para suportar acessos simultâneos sem perda significativa de desempenho.
4. A solução embarcada (Raspberry Pi) deve ser de fácil configuração e manutenção.
5. O backend deve seguir boas práticas de desenvolvimento e ser documentado.
6. A interface deve ser simples, intuitiva e responsiva, garantindo boa experiência do usuário.
   
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
            │           ▼
           [Stream de Video]
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
