import { HashRouter, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { AppShell } from './components/Shell'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Tasks } from './pages/Tasks'
import { TaskNew } from './pages/TaskNew'
import { TaskDetail } from './pages/TaskDetail'
import { Projects } from './pages/Projects'
import { ProjectDetail } from './pages/ProjectDetail'
import { Resources } from './pages/Resources'
import { FlowLibrary } from './pages/FlowLibrary'
import { FlowDetail } from './pages/FlowDetail'
import { FlowApprovals } from './pages/FlowApprovals'
import { CommandCenter } from './pages/CommandCenter'
import { RuleManager } from './pages/RuleManager'
import { Docs } from './pages/Docs'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/new" element={<TaskNew />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="resources" element={<Resources />} />
          <Route path="flows" element={<FlowLibrary />} />
          <Route path="flows/:id" element={<FlowDetail />} />
          <Route path="approvals" element={<FlowApprovals />} />
          <Route path="command" element={<CommandCenter />} />
          <Route path="rules" element={<RuleManager />} />
          <Route path="docs" element={<Docs />} />
          <Route path="docs/:id" element={<Docs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </MotionConfig>
  )
}
