import React from 'react'
import './App.css'
import { TriviaProvider, useTrivia } from './components/TriviaContext'
import Header from './components/Header'
import FilterControls from './components/FilterControls'
import QuestionCount from './components/QuestionCount'
import CategoryNavigation from './components/CategoryNavigation'
import CategoryDistributionChart from './components/CategoryDistributionChart'
import DifficultyDistributionChart from './components/DifficultyDistributionChart'
import SampleQuestionTable from './components/SampleQuestionTable'

const AppContent: React.FC = () => {
  const { loading, error } = useTrivia()

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <CategoryNavigation />
      </aside>

      <main className="main-content">
        <div className="top-controls">
          <Header />
          <FilterControls />
        </div>
        <QuestionCount />

        {loading && (
          <div className="state">Loading data…</div>
        )}

        {error && (
          <div className="state error">{error}</div>
        )}

        {!loading && !error && (
          <>
            <section className="charts-grid">
              <CategoryDistributionChart />
              <DifficultyDistributionChart />
            </section>

            <section className="tables-grid">
              <SampleQuestionTable />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <TriviaProvider>
      <AppContent />
    </TriviaProvider>
  )
}

export default App
