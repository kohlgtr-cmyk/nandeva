# 🔥 GUIA DE CONFIGURAÇÃO - Firebase para o Site Nandeva

## Por que preciso do Firebase?

Atualmente, seu site usa `localStorage`, que salva dados **apenas no navegador onde você adicionou**. 
Outros navegadores e dispositivos não conseguem ver esses dados.

Com o Firebase, os dados ficam na nuvem e **todos** veem o mesmo conteúdo, de qualquer lugar!

---

## 📋 Passo a Passo - Configuração Firebase (GRATUITO)

### 1️⃣ Criar Conta Google Firebase

1. Acesse: https://console.firebase.google.com
2. Faça login com sua conta Google
3. Clique em **"Adicionar projeto"** ou **"Create a project"**

### 2️⃣ Criar o Projeto

1. **Nome do projeto**: Digite `nandeva-site` (ou qualquer nome)
2. **Google Analytics**: Pode desabilitar (não é necessário)
3. Clique em **"Criar projeto"**
4. Aguarde alguns segundos até finalizar

### 3️⃣ Criar o Banco de Dados

1. No menu lateral esquerdo, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"** ou **"Create Database"**
3. **Localização**: Escolha `us-central1` (ou o mais próximo)
4. **Regras de segurança**: Escolha **"Iniciar no modo de teste"** ou **"Test mode"**
   - ⚠️ IMPORTANTE: Isso permite leitura/escrita por 30 dias. Depois você pode ajustar.
5. Clique em **"Ativar"**

### 4️⃣ Pegar as Credenciais

1. Clique no ícone de **engrenagem** ⚙️ ao lado de "Visão geral do projeto"
2. Clique em **"Configurações do projeto"**
3. Role para baixo até **"Seus aplicativos"**
4. Clique no ícone **</>** (Web)
5. **Apelido do app**: Digite `nandeva-web`
6. NÃO marque "Firebase Hosting"
7. Clique em **"Registrar app"**

### 5️⃣ Copiar os Dados

Você verá um código parecido com isso:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "nandeva-site.firebaseapp.com",
  databaseURL: "https://nandeva-site-default-rtdb.firebaseio.com",
  projectId: "nandeva-site",
  storageBucket: "nandeva-site.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Você precisa copiar apenas 3 valores:**

- ✅ `apiKey`: "AIzaSyB..."
- ✅ `databaseURL`: "https://nandeva-site-default-rtdb.firebaseio.com"
- ✅ `projectId`: "nandeva-site"

---

## 🔧 Como Configurar no Site

1. Acesse seu site: https://seusite.com
2. Faça login como **admin** (senha: nandeva2025)
3. Clique no ícone de **engrenagem** ⚙️ no topo
4. Role até a seção **"Firebase (Banco de Dados)"**
5. Cole os 3 valores que você copiou:
   - **API Key**: Cole o valor de `apiKey`
   - **Database URL**: Cole o valor de `databaseURL`
   - **Project ID**: Cole o valor de `projectId`
6. Clique em **"Salvar Configuração"**
7. A página vai recarregar automaticamente

---

## ✅ Pronto! Agora funciona assim:

- ✅ Você adiciona um show → Aparece em TODOS os navegadores
- ✅ Você adiciona uma foto → Aparece em TODOS os dispositivos
- ✅ Qualquer pessoa vê o mesmo conteúdo
- ✅ Dados sincronizam em tempo real (sem refresh)

---

## 🔒 Ajustar Regras de Segurança (IMPORTANTE - Fazer depois de 30 dias)

Depois de 30 dias, o modo teste expira. Para continuar funcionando:

1. No Firebase Console, vá em **Realtime Database**
2. Clique na aba **"Regras"**
3. Substitua por:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

Isso permite que **qualquer um** veja o conteúdo, mas só você (admin) pode editar.

---

## 🆘 Problemas Comuns

### "Erro ao conectar Firebase"
- ✅ Verifique se copiou corretamente os 3 valores
- ✅ Database URL deve terminar com `.firebaseio.com`
- ✅ Certifique-se de criar o Realtime Database (não Firestore)

### "Não aparece nada"
- ✅ Verifique se o Firebase está em modo "Teste"
- ✅ Aguarde alguns segundos após salvar
- ✅ Recarregue a página (F5)

### "Modo teste expirou"
- ✅ Siga as instruções de "Ajustar Regras de Segurança" acima

---

## 💡 Dica Extra

Depois de configurar, você pode:
- Acessar https://console.firebase.google.com
- Ver todos os dados em tempo real
- Fazer backup manual se quiser
- Adicionar autenticação mais forte no futuro

---

**Dúvidas?** Entre em contato com o desenvolvedor do site!
