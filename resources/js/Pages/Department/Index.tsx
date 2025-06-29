import { Department, PageProps, PaginationProps, Product } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ProductItem from '@/Components/App/ProductItem';


function Index(
  {
    appName,
    department,
    products
  }: PageProps<{
    department: Department;
    products: PaginationProps<Product>
  }>) {
  return (
    <AuthenticatedLayout>

      <Head>
        <title>{department.name}</title>
        <meta name="title" content={department.meta_title} />
        <meta name="description" content={department.meta_description} />
        <link rel="canonical" href={route('product.byDepartment', department.slug)} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={route('product.byDepartment', department.slug)} />
        <meta property="og:title" content={department.meta_title} />
        <meta property="og:description" content={department.meta_description} />
        <meta property="site_name" content={appName} />
      </Head>
      <div className="container mx-auto">
        <div className="hero bg-base-200 min-h-[120px]">
          <div className="hero-content text-center">
            <div className="max-w-lg">
              <h1 className="text-5xl font-bold">
                {department.name}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.data.length === 0 && (
              <div className="card w-full bg-base-100 shadow-xl col-span-3">
                <div className="card-body items-center text-center text-gray-500 text-2xl font-bold">
                  No products found
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 p-8">
          {
            products.data.map((product: Product) => (
              <ProductItem product={product} key={product.id}></ProductItem>
            ))
          }
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
