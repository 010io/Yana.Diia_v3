# 🚀 Getting Started with Yana.Diia.AI

## 🎯 What You'll Learn

- How to run the project locally
- How to use the Lego Constructor
- How to generate flows with AI Pipeline

---

## ⚡ Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/010io/Yana.Diia_v3.git
cd Yana.Diia_v3
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open in Browser

```
http://localhost:3000
```

---

## 🎨 Your First Flow

### Option A: Lego Constructor (Visual)

1. Navigate to `/lego`
2. Drag components from left panel
3. Connect them to create flow
4. Preview in right panel

### Option B: AI Pipeline (Automatic)

1. Navigate to `/pipeline`
2. Enter BRD description (Ukrainian)
3. Click "Генерувати"
4. Review 3-7 variants
5. Select best one

---

## 🔧 Configuration

### Environment Variables (.env.local)

```bash
# Frontend
NEXT_PUBLIC_APP_URL=http://localhost:3000
LLM_MODE=mock  # Use 'real' with API keys

# Backend (optional)
NEXT_PUBLIC_API_URL=/api
```

---

## 📚 Next Steps

- [Architecture Overview](./Architecture)
- [API Documentation](./API-Documentation)
- [Deploy to Vercel](./Deployment)

---

**Need help?** Open an issue on [GitHub](https://github.com/010io/Yana.Diia_v3/issues)
