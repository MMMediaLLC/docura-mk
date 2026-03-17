# DOCURA - Cloud Run Deployment Guide

Овој водич ги содржи точните команди за да ја објавите вашата DOCURA апликација на Google Cloud Run. 

Бидејќи апликацијата користи чувствителни клучеви (Firebase & Gemini), тие мора безбедно да се пренесат на серверот.

---

## Чекор 1: Потребен софтвер
Ако веќе немате, мора да ја инсталирате **Google Cloud CLI** алатката на вашиот компјутер:
[Симнете ја овде: https://cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

Откако ќе ја инсталирате, најавете се преку вашиот терминал:
```bash
gcloud auth login
```
И одберете го вашиот Google Cloud проект (пр: `docura-ai-123`):
```bash
gcloud config set project [ВАШИОТ-ПРОЕКТ-ID]
```

---

## Чекор 2: Подготовка за Deploy

Во терминалот, осигурајте се дека сте во главната папка на проектот (каде што е `Dockerfile`).

Пред да ја извршите командата за објавување, мора да ги замените ознаките `[ВАШАТА_ВРЕДНОСТ]` со вистинските клучеви од вашиот `.env` фајл.

Еве ја целосната команда за објавување (Deploy):

```bash
gcloud run deploy docura-frontend \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-build-env-vars VITE_FIREBASE_API_KEY=[ВАШАТА_ВРЕДНОСТ],VITE_FIREBASE_AUTH_DOMAIN=[ВАШАТА_ВРЕДНОСТ],VITE_FIREBASE_PROJECT_ID=[ВАШАТА_ВРЕДНОСТ],VITE_FIREBASE_STORAGE_BUCKET=[ВАШАТА_ВРЕДНОСТ],VITE_FIREBASE_MESSAGING_SENDER_ID=[ВАШАТА_ВРЕДНОСТ],VITE_FIREBASE_APP_ID=[ВАШАТА_ВРЕДНОСТ],VITE_GEMINI_API_KEY=[ВАШАТА_ВРЕДНОСТ]
```

*(Забелешка: `europe-west1` е регионот Белгија, идеален за корисници од Европа. Може да го промените во `us-central1` ако сакате).*

---

## Чекор 3: Што се случува потоа?

1. Google Cloud ќе го подигне вашиот код.
2. Ќе ја прочита скриптата од `Dockerfile`.
3. Ќе ги инјектира безбедно вашите Cloud клучови.
4. Ќе ја компајлира (`npm run build`) апликацијата локално на нивните сервери.
5. На крај, ќе ви врати **Јавен URL** (на пр. `https://docura-frontend-12345-ew.a.run.app`) каде што апликацијата е во живо.

Кога ќе го купите вашиот домен (пр. `docura.ai`), можете во конзолата на Google Cloud многу лесно да го поврзете тој домен со овој URL.
