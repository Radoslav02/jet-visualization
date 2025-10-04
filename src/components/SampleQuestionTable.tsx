import React from 'react'
import { useTrivia } from './TriviaContext'

const SampleQuestionTable: React.FC = () => {
  const { visibleQuestions, selectedCategory } = useTrivia()

  return (
    <div className="chart-card">
      <h2>Sample (first 10 questions){selectedCategory !== 'all' ? ` — ${selectedCategory}` : ''}</h2>
      <div className="question-table-container">
        <table className="question-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Question</th>
            </tr>
          </thead>
          <tbody>
            {visibleQuestions.slice(0, 10).map((q, i) => (
              <tr key={`${q.question}-${i}`}>
                <td>{i + 1}</td>
                <td>{q.category}</td>
                <td>
                  <span className={`pill ${q.difficulty}`}>{q.difficulty}</span>
                </td>
                <td> {q.question} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleQuestions.length === 0 && <div className="state">No data for selected filter.</div>}
    </div>
  )
}

export default SampleQuestionTable
