import { PageProps, Product, VariationTypeOption } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Carousel from '@/Components/Core/Carousel';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';
import { arraysAreEqual } from '@/helpers';

function Show(
  {
    appName, product, variationOptions
  }:
  PageProps<{
    product: Product,
    variationOptions: number[]
  }>) {
  const form = useForm<{
    option_ids: Record<string, number>;
    quantity: number;
    price: number | null;
  }>({
    option_ids: {},
    quantity: 1,
    price: null // TODO populate price on change

  });

  const { url } = usePage();
  const [selectedOptions, setSelectedOptions] = useState<Record<number, VariationTypeOption>>({});

  // Parse URL parameters for options
  const urlParams = useMemo(() => {
    if (typeof window === 'undefined') return {}; // SSR-safe: return empty object on server

    const params = new URLSearchParams(window.location.search);
    const options: Record<number, number> = {};

    params.forEach((value, key) => {
      const match = key.match(/options\[(\d+)\]/);
      if (match) {
        const typeId = parseInt(match[1]);
        const optionId = parseInt(value);
        if (!isNaN(typeId) && !isNaN(optionId)) {
          options[typeId] = optionId;
        }
      }
    });

    return options;
  }, []);


  const images = useMemo(() => {
    for (let typeId in selectedOptions) {
      const option = selectedOptions[typeId];
      if (option.images.length > 0) return option.images;
    }
    return product.images;
  }, [product, selectedOptions]);

  const computedProduct = useMemo(() => {
    const selectedOptionsIds: number[] = Object.values(selectedOptions)
      .map(op => op.id)
      .sort();

    for (let variation of product.variations) {
      const optionIds: number[] = variation
        .variation_type_option_ids.sort();
      if (arraysAreEqual(selectedOptionsIds, optionIds)) {
        return {
          price: variation.price,
          quantity: variation.quantity ?? Number.MAX_VALUE
        };
      }

    }
    return {
      price: product.price,
      quantity: product.quantity
    };
  }, [product, selectedOptions]);

  useEffect(() => {
    // Make sure we’re running in the browser (for SSR safety)
    if (typeof window === 'undefined') return;

    const optionsToUse = Object.keys(urlParams).length > 0 ? urlParams : variationOptions;

    for (let type of product.variationTypes) {
      const selectedOptionId = optionsToUse[type.id];
      if (selectedOptionId) {
        const option = type.options.find(opt => opt.id === selectedOptionId);
        if (option) {
          chooseOption(type.id, option, false);
        } else if (type.options.length > 0) {
          chooseOption(type.id, type.options[0], false);
        }
      } else if (type.options.length > 0) {
        chooseOption(type.id, type.options[0], false);
      }
    }
  }, [product.variationTypes, urlParams]);

  const chooseOption = (
    typeId: number,
    option: VariationTypeOption,
    updateRouter: boolean = true
  ) => {
    setSelectedOptions((prevSelectedOptions) => {
      const newOptions = {
        ...prevSelectedOptions,
        [typeId]: option
      };

      if (typeof window !== 'undefined' && updateRouter) {
        const params = new URLSearchParams();
        Object.entries(newOptions).forEach(([tId, opt]) => {
          params.set(`options[${tId}]`, opt.id.toString());
        });

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({}, '', newUrl);
      }

      return newOptions;
    });
  };

  const onQuantityChange =
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      form.setData('quantity', parseInt(ev.target.value));
    };

  const addToCart = () => {
    form.post(route('cart.store', product.id), {
      preserveScroll: true,
      preserveState: true,
      onError: (err) => {
        console.log(err);
      }
    });
  };

  const renderProductVariationTypes = () => {
    return (
      product.variationTypes.map((type, i) => (
        <div key={type.id}>
          <b className="block mb-2">{type.name}</b>
          {type.type === 'Image' &&
            <div className="flex gap-2 mb-4">
              {type.options.map(option => (
                <div onClick={() => chooseOption(type.id, option)} key={option.id}>
                  {option.images &&
                    <img src={option.images[0].thumb} alt=""
                         className={'w-[50px] ' + (selectedOptions[type.id]?.id === option.id ?
                             'outline outline-4 outline-primary' :
                             ''
                         )} />}
                </div>
              ))}
            </div>}
          {type.type === 'Radio' &&
            <div className="flex join mb-4">
              {type.options.map(option => (
                <input onChange={() => chooseOption(type.id, option)}
                       key={option.id}
                       className="join-item btn"
                       type="radio"
                       value={option.id}
                       checked={selectedOptions[type.id]?.id === option.id}
                       name={'variation_type_' + type.id}
                       aria-label={option.name} />
              ))}
            </div>}
        </div>
      ))
    );
  };
  const renderAddToCartButton = () => {
    return (
      <div className="flex gap-4 mb-8">
        <select value={form.data.quantity}
                onChange={onQuantityChange}
                className="select select-bordered w-full">
          {Array.from({
            length: Math.min(10, computedProduct.quantity)
          }).map((_, i) => (
            <option key={i + 1} value={i + 1}>Quantity: {i + 1}</option>
          ))}
        </select>
        <button onClick={addToCart} className="btn btn-primary">Add to Cart</button>
      </div>
    );
  };

  useEffect(() => {
    const idsMap = Object.fromEntries(
      Object.entries(selectedOptions)
        .map(([typeId, option]: [string, VariationTypeOption]) => [
          typeId,
          option.id
        ])
    );
    form.setData('option_ids', idsMap);
  }, [selectedOptions]);

  return (
    <AuthenticatedLayout>
      <Head>
        <title>{product.title}</title>
        <meta name="title" content={product.meta_title || product.title} />
        <meta name="description" content={product.meta_description} />
        <link rel="canonical" href={route('product.show', product.slug)} />

        <meta property="og:title" content={product.meta_title} />
        <meta property="og:description" content={product.meta_description} />
        <meta property="og:image" content={product.images[0]?.small} />
        <meta property="og:url" content={route('product.show', product.slug)} />
        <meta property="og:type" content="product" />
        <meta property="site_name" content={appName} />
      </Head>
      <div className="container mx-auto p-8">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-12">
          <div className="col-span-7">
            <Carousel images={images} />
          </div>
          <div className="col-span-5">
            <h1 className="text-2xl">{product.title}</h1>
            <p className="card-text mb-8">
              by <Link href="/" className="hover:underline"> {product.user.name} </Link>&nbsp;
              in <Link href={route('product.byDepartment', product.department.slug)}
                       className="hover:underline">{product.department.name}</Link>
            </p>
            <div>
              <div className="text-3xl font-semibold mb-8">
                <CurrencyFormatter amount={product.price} />
              </div>
            </div>
            {/*<pre>{JSON.stringify(product.variationTypes, undefined, 2)}</pre>*/}
            {renderProductVariationTypes()}

            {computedProduct.quantity != undefined &&
              computedProduct.quantity < 10 &&
              <div className="text-error my-4">
                <span>Only {computedProduct.quantity} left</span>
              </div>
            }

            {renderAddToCartButton()}
            <b className="text-xl">About the Item</b>
            <div className="wysiwyg-output"
                 dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Show;
