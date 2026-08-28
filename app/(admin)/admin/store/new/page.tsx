'use client';

import { ProductForm } from '../components/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-8">New Product</h1>
      <ProductForm />
    </div>
  );
}
