import React from 'react'
import { useTrivia } from './TriviaContext'

const QuestionCount: React.FC = () => {
  const { visibleQuestions } = useTrivia()

  return (
    <div className="question-count-badge">
      Showing <strong>{visibleQuestions.length}</strong> questions in view.
    </div>
  )
}

export default QuestionCount
