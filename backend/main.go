package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
)

type Product struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
	Stock int    `json:"stock"`
}

type Summary struct {
	TotalProducts   int `json:"total_products"`
	TotalAssetValue int `json:"total_asset_value"`
}

var products = []Product{
	{
		ID:    1,
		Name:  "Mechanical Keyboard RGB",
		Price: 850000,
		Stock: 12,
	},
	{
		ID:    2,
		Name:  "Wireless Mouse Ergonomic",
		Price: 350000,
		Stock: 4,
	},
	{
		ID:    3,
		Name:  "Monitor Gaming 24 Inch",
		Price: 2100000,
		Stock: 7,
	},
	{
		ID:    4,
		Name:  "USB-C Hub Multiport",
		Price: 275000,
		Stock: 3,
	},
	{
		ID:    5,
		Name:  "Headset Noise Cancelling",
		Price: 1200000,
		Stock: 15,
	},
	{
		ID:    6,
		Name:  "Desk Mat XXL",
		Price: 150000,
		Stock: 2,
	},
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func writeJSON(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func productsHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	result := append([]Product(nil), products...)

	sortBy := r.URL.Query().Get("sort_by")
	order := r.URL.Query().Get("order")

	if sortBy == "price" {
		sort.Slice(result, func(i, j int) bool {
			if order == "desc" {
				return result[i].Price > result[j].Price
			}

			return result[i].Price < result[j].Price
		})
	}

	if sortBy == "stock" {
		sort.Slice(result, func(i, j int) bool {
			if order == "desc" {
				return result[i].Stock > result[j].Stock
			}

			return result[i].Stock < result[j].Stock
		})
	}

	writeJSON(w, result)
}

func lowStockHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var result []Product

	for _, product := range products {
		if product.Stock < 5 {
			result = append(result, product)
		}
	}

	writeJSON(w, result)
}

func summaryHandler(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	totalAssetValue := 0

	for _, product := range products {
		totalAssetValue += product.Price * product.Stock
	}

	summary := Summary{
		TotalProducts:   len(products),
		TotalAssetValue: totalAssetValue,
	}

	writeJSON(w, summary)
}

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/products/low-stock", lowStockHandler)
	mux.HandleFunc("/products/summary", summaryHandler)
	mux.HandleFunc("/products", productsHandler)

	log.Println("Backend running on http://localhost:8080")

	log.Fatal(http.ListenAndServe(":8080", mux))
}
