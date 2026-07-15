import useCategories from '../../hooks/useCategories'

export default function Categories() {
  const { data, isLoading, isError, error } = useCategories()

  if (isLoading) return <p>Loading categories...</p>
  if (isError) return <p className="form-error">{error.message || 'Could not load categories.'}</p>

  const categories = data?.response?.data || data?.data || data || []

  return (
    <section className="categories-section">
      <h2>Categories</h2>
      {categories.length > 0 ? (
        <ul className="categories-list">
          {categories.map((category) => (
            <li key={category.id || category.name}>{category.name}</li>
          ))}
        </ul>
      ) : (
        <p>No categories available.</p>
      )}
    </section>
  )
}
