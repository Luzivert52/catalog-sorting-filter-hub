import { Product } from "../types";

type ProductCardProps = {
  product: Product;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  const isLowStock = product.stock < 5;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-gray-900">
          {product.name}
        </h3>

        {isLowStock && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Low Stock
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-bold text-gray-900">
        {formatRupiah(product.price)}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        Stock: {product.stock}
      </p>
    </article>
  );
}