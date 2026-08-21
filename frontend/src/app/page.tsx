"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import SummaryCard from "./components/SummaryCard";
import { Product, Summary } from "./types";

const API_URL = "http://localhost:8080";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "stock-desc"
  | "stock-asc";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] =
    useState<SortOption>("default");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mengambil data produk dari backend
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        let endpoint = `${API_URL}/products`;

        if (lowStockOnly) {
          endpoint = `${API_URL}/products/low-stock`;
        } else if (sortOption !== "default") {
          const [sortBy, order] = sortOption.split("-");

          endpoint =
            `${API_URL}/products?sort_by=${sortBy}&order=${order}`;
        }

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk.");
        }

        const data: Product[] = await response.json();

        setProducts(data);
      } catch (error) {
        console.error(error);
        setError(
          "Gagal mengambil data produk. Pastikan backend Go berjalan."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [sortOption, lowStockOnly]);

  // Mengambil summary produk
  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await fetch(
          `${API_URL}/products/summary`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil summary.");
        }

        const data: Summary = await response.json();

        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSummary();
  }, []);

  // Filter produk berdasarkan nama
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Mengubah angka menjadi format Rupiah
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-6">
        <Hero />

        {/* Summary */}
        <section className="grid gap-5 md:grid-cols-2">
          <SummaryCard
            title="Total Products"
            value={
              summary
                ? summary.total_products.toString()
                : "-"
            }
          />

          <SummaryCard
            title="Total Asset Value"
            value={
              summary
                ? formatRupiah(summary.total_asset_value)
                : "-"
            }
          />
        </section>

        {/* Search dan Filter */}
        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Filter
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Cari, urutkan, atau tampilkan produk dengan stok rendah.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_190px_auto]">
            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {/* Sorting */}
            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value as SortOption
                )
              }
              className="h-11 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="default">Default</option>

              <option value="price-asc">
                Harga Terendah
              </option>

              <option value="price-desc">
                Harga Tertinggi
              </option>

              <option value="stock-desc">
                Stok Terbanyak
              </option>

              <option value="stock-asc">
                Stok Tersedikit
              </option>
            </select>

            {/* Low Stock */}
            <button
              onClick={() =>
                setLowStockOnly(!lowStockOnly)
              }
              className={`h-11 rounded-lg px-5 text-sm font-semibold transition ${
                lowStockOnly
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {lowStockOnly
                ? "Low Stock Aktif"
                : "Show Low Stock"}
            </button>
          </div>
        </section>

        {/* Daftar Produk */}
        <section className="py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Daftar produk yang tersedia
              </p>
            </div>

            <p className="text-sm text-gray-500">
              {filteredProducts.length} product
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
              Loading products...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
              {error}
            </div>
          )}

          {/* Produk tidak ditemukan */}
          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500">
                Produk tidak ditemukan.
              </div>
            )}

          {/* Daftar Produk */}
          {!loading &&
            !error &&
            filteredProducts.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
        </section>
      </div>
    </main>
  );
}