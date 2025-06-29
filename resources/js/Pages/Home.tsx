import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginationProps, Product } from '@/types';
import { Head } from '@inertiajs/react';
import ProductItem from '@/Components/App/ProductItem';

export default function Home({ products }: PageProps<{ products: PaginationProps<Product> }>) {

  return (
    <AuthenticatedLayout>
      <Head title="Home" />
      

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
        {
          products.data.map((product: Product) => (
            <ProductItem product={product} key={product.id}></ProductItem>
          ))
        }
      </div>
    </AuthenticatedLayout>
  );
}
