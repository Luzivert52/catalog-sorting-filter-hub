# Catalog Sorting & Filter Hub

Mini project menggunakan Go sebagai backend
dan Next.js sebagai frontend.

## Tech Stack

- Go
- Next.js
- React
- TypeScript
- Tailwind CSS

## Fitur

- Menampilkan katalog produk
- Search produk
- Search case-insensitive
- Sorting berdasarkan harga
- Sorting berdasarkan stock
- Filter Low Stock
- Total Products
- Total Asset Value
- Loading state
- Error handling

## Struktur

backend/
├── go.mod
└── main.go

frontend/
└── src/
    └── app/
        ├── components/
        │   ├── Hero.tsx
        │   ├── Navbar.tsx
        │   ├── ProductCard.tsx
        │   └── SummaryCard.tsx
        │
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx
        └── types.ts

## Cara Menjalankan Backend

Masuk ke folder backend: "cd backend"
Jakankan: go run main.go
Backend berjalan di: http://localhost:8080

## Cara Menjalankan Frontend

Masuk ke folder backend: "cd frontend"
Jakankan: npm run dev
Backend berjalan di: http://localhost:3000

## API EndPoint

Semua Produk:  GET /products

Sorting Harga: GET /products?sort_by=price&order=asr
               GET /products?sort_by=price&order=desc

Sorting Stock: GET /products?sort_by=stock&order=asr
               GET /products?sort_by=stock&order=desc

## Low Stock
GET /products/low-stock

## Summary
GET /products/summary