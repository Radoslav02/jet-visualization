import React from 'react'
import { useTrivia } from './TriviaContext'

const FilterControls: React.FC = () => {
  const { selectedCategory, setSelectedCategory, uniqueQuestionCategories, refetchQuestions, loading } = useTrivia()

  return (
    <div className="filter-controls">
      <label htmlFor="categoryFilter">Filter:</label>
      <select
        id="categoryFilter"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        disabled={loading}
      >
        <option value="all">All categories</option>
        {uniqueQuestionCategories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button onClick={() => refetchQuestions(50)} disabled={loading} className="refetch-button">
        Refetch 50
      </button>
    </div>
  )
}

export default FilterControls
