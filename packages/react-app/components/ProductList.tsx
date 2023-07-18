import { useState, useMemo } from "react";
import { useContractCall } from "@/hooks/contracts/useContractRead";
import Product from "@/components/Product";
import ErrorAlert from "@/components/alerts/ErrorAlert";
import LoadingAlert from "@/components/alerts/LoadingAlert";
import SuccessAlert from "@/components/alerts/SuccessAlert";

const ProductList = () => {
  const { data } = useContractCall("getProductsLength", [], true);
  const productLength = data ? Number(data.toString()) : 0;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState("");

  const clear = () => {
    setError("");
    setSuccess("");
    setLoading("");
  };

  const handleProductStateChange = (error, success, loading) => {
    setError(error);
    setSuccess(success);
    setLoading(loading);
  };

  const products = useMemo(() => {
    if (!productLength) return [];
    const products = [];
    for (let i = 0; i < productLength; i++) {
      products.push(
        <Product
          key={i} // Use a unique identifier here, such as product ID
          id={i}
          onStateChange={handleProductStateChange}
          loading={loading}
          clear={clear}
        />
      );
    }
    return products;
  }, [productLength, loading]);

  return (
    <div>
      {error && <ErrorAlert message={error} clear={clear} />}
      {success && <SuccessAlert message={success} />}
      {loading && <LoadingAlert message={loading} />}
      <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {products}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
