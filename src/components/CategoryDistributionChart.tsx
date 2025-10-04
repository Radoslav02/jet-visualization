import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useTrivia } from './TriviaContext'

const PIE_COLORS = ['#4CAF50', '#2196F3', '#FFC107', '#FF5722', '#9C27B0', '#00BCD4', '#CDDC39', '#FFEB3B', '#795548', '#607D8B', '#E91E63', '#009688', '#8BC34A', '#FF9800']

const CategoryDistributionChart: React.FC = () => {
  const { categoryDistribution, selectedCategory } = useTrivia()

  return (
    <div className="chart-card">
      <h2>Questions by Category{selectedCategory !== 'all' ? ` — ${selectedCategory}` : ''}</h2>
      {categoryDistribution.length === 0 ? (
        <div className="state">No data for selected filter.</div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            >
              {categoryDistribution.map((_, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" align="center" wrapperStyle={{fontSize: '0.8rem'}} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default CategoryDistributionChart
