import { useCallback, useEffect, useMemo, useState } from "react";
import "./styles.css";

const PAGE_SIZE = 10;

const Pagination = ({
  start,
  goToNext,
  goToPrev,
  handlePageChange,
  numOfPages,
}) => {
  return (
    <div className="page-num-container">
      <button
        disabled={start === 0}
        className="page-numbers"
        onClick={goToPrev}
      >{`<`}</button>
      {[...Array(numOfPages).keys()].map((n) => {
        return (
          <button
            className={"page-numbers " + `${start === n ? "active" : ""}`}
            onClick={() => handlePageChange(n)}
          >
            {n}
          </button>
        );
      })}
      <button
        disabled={start === numOfPages - 1}
        className="page-numbers"
        onClick={goToNext}
      >{`>`}</button>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <>
      <img
        src={product.thumbnail}
        alt={product.title}
        height={200}
        width={200}
      />
      {product.title}
    </>
  );
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(PAGE_SIZE);
  const numOfPages = useMemo(
    () => Math.ceil(products.length / PAGE_SIZE),
    [products]
  );
  const fetchData = useCallback(async () => {
    const response = await fetch("https://dummyjson.com/products?limit=500");
    const json = await response.json();
    setProducts(json.products);
  }, []);

  const handlePageChange = useCallback(
    (pageNum) => {
      setStart(pageNum);
      setEnd(pageNum + PAGE_SIZE);
    },
    [setEnd, setStart]
  );

  const goToPrev = useCallback(() => {
    setStart((prev) => prev - 1);
    setEnd((prev) => prev - 1);
  }, [setStart, setEnd]);

  const goToNext = useCallback(() => {
    setStart((prev) => prev + 1);
    setEnd((prev) => prev + 1);
  }, [setStart, setEnd]);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="App">
      <h1>Pagination</h1>
      {start},{end}
      <Pagination
        start={start}
        goToNext={goToNext}
        goToPrev={goToPrev}
        handlePageChange={handlePageChange}
        numOfPages={numOfPages}
      />
      <div className="products-container">
        {products.slice(start, end).map((p) => (
          <div className="product" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
