import { useState } from 'react';

export default function MenuPanel({ categories, products, onSelectCategory, onAddProduct }) {
  const [activeCategoryId, setActiveCategoryId] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setActiveCategoryId(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className="panel">
      <h2>Menü</h2>
      <div className="row" id="categories">
        {categories.map((category) => (
          <button key={category.id} onClick={() => handleCategoryClick(category.id)}>
            {category.name}
          </button>
        ))}
      </div>
      <div className="row" id="products">
        {activeCategoryId &&
          products.map((product) => (
            <button key={product.id} onClick={() => onAddProduct(product.id)}>
              {product.name} - {product.price} ₺
            </button>
          ))}
      </div>
    </div>
  );
}
