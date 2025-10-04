import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useTrivia } from './TriviaContext'

const DifficultyDistributionChart: React.FC = () => {
  const { difficultyDistribution, selectedCategory } = useTrivia()

  return (
    <div className="chart-card">
      <h2>Questions by Difficulty{selectedCategory !== 'all' ? ` — ${selectedCategory}` : ''}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={difficultyDistribution}>
          <XAxis dataKey="name" axisLine={true} tickLine={false} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" name="Questions" fill="#3F51B5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DifficultyDistributionChart
