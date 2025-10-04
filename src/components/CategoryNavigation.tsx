import React from 'react'
import { useTrivia } from './TriviaContext'

const CategoryNavigation: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, visibleQuestions } = useTrivia()

  const categoryCounts = visibleQuestions.reduce((categoryCounts, question) => {
    categoryCounts.set(question.category, (categoryCounts.get(question.category) ?? 0) + 1)
    return categoryCounts
  }, new Map<string, number>())

  return (
    <div className="category-navigation">
      <h2>Categories</h2>
      <p className="category-navigation-subtitle">Click a category to filter.</p>
      <ul className="category-list">
        {categories.map((category) => (
          <li
            key={category.id}
            className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <span className="category-name">{category.name}</span>
            <span className="category-count">{categoryCounts.get(category.name) ?? 0}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoryNavigation
