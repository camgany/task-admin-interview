import {
  useMemo,
  useState,
  forwardRef,
  type FormEvent,
  type ReactNode,
  type ButtonHTMLAttributes,
} from 'react'
import {
  Badge,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  Label,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from 'flowbite-react'

type Status = 'todo' | 'doing' | 'done'
type Priority = 'low' | 'medium' | 'high'
type View = 'dashboard' | Status

type Task = {
  id: string
  title: string
  owner: string
  priority: Priority
  status: Status
  due: string
}

const STATUS_LABEL: Record<Status, string> = {
  todo: 'To do',
  doing: 'In progress',
  done: 'Done',
}

const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

const PRIORITY_COLOR: Record<Priority, 'gray' | 'warning' | 'failure'> = {
  low: 'gray',
  medium: 'warning',
  high: 'failure',
}

const STATUS_DOT: Record<Status, string> = {
  todo: 'bg-cyan-500',
  doing: 'bg-indigo-500',
  done: 'bg-green-500',
}

const STATUSES: Status[] = ['todo', 'doing', 'done']
const PRIORITIES: Priority[] = ['low', 'medium', 'high']
const OWNERS = ['Alex', 'Jordan', 'Sam', 'Taylor']

const MenuTrigger = forwardRef<
  HTMLButtonElement,
  { children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>
>(function MenuTrigger({ children, className = '', ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={`inline-flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 ${className}`}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">{children}</span>
      <svg className="h-3.5 w-3.5 shrink-0 text-gray-500" viewBox="0 0 10 6" fill="none" aria-hidden>
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
})

function StatusDot({ status }: { status: Status }) {
  return <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
}

function StatusMenu({
  value,
  onChange,
  compact = false,
}: {
  value: Status
  onChange: (status: Status) => void
  compact?: boolean
}) {
  return (
    <Dropdown
      label=""
      dismissOnClick
      renderTrigger={() => (
        <MenuTrigger>
          <StatusDot status={value} />
          <span className={compact ? 'text-xs' : ''}>{STATUS_LABEL[value]}</span>
        </MenuTrigger>
      )}
    >
      {STATUSES.map(status => (
        <DropdownItem key={status} onClick={() => onChange(status)}>
          <span className="flex items-center gap-2">
            <StatusDot status={status} />
            {STATUS_LABEL[status]}
            {status === value ? <span className="ml-auto text-xs text-cyan-700">Selected</span> : null}
          </span>
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

function OwnerMenu({ value, onChange }: { value: string; onChange: (owner: string) => void }) {
  return (
    <Dropdown
      label=""
      dismissOnClick
      renderTrigger={() => <MenuTrigger>{value}</MenuTrigger>}
    >
      {OWNERS.map(name => (
        <DropdownItem key={name} onClick={() => onChange(name)}>
          <span className="flex w-full items-center justify-between gap-3">
            {name}
            {name === value ? <span className="text-xs text-cyan-700">Selected</span> : null}
          </span>
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

function PriorityMenu({
  value,
  onChange,
}: {
  value: Priority
  onChange: (priority: Priority) => void
}) {
  return (
    <Dropdown
      label=""
      dismissOnClick
      renderTrigger={() => (
        <MenuTrigger>
          <Badge color={PRIORITY_COLOR[value]}>{PRIORITY_LABEL[value]}</Badge>
        </MenuTrigger>
      )}
    >
      {PRIORITIES.map(p => (
        <DropdownItem key={p} onClick={() => onChange(p)}>
          <span className="flex w-full items-center justify-between gap-3">
            <Badge color={PRIORITY_COLOR[p]}>{PRIORITY_LABEL[p]}</Badge>
            {p === value ? <span className="text-xs text-cyan-700">Selected</span> : null}
          </span>
        </DropdownItem>
      ))}
    </Dropdown>
  )
}

const SEED: Task[] = [
  {
    id: '1',
    title: 'Confirm staging deploy checklist',
    owner: 'Alex',
    priority: 'high',
    status: 'doing',
    due: '2026-09-23',
  },
  {
    id: '2',
    title: 'Review customer onboarding tickets',
    owner: 'Jordan',
    priority: 'medium',
    status: 'todo',
    due: '2026-09-24',
  },
  {
    id: '3',
    title: 'Update support FAQ for the mobile app',
    owner: 'Sam',
    priority: 'low',
    status: 'todo',
    due: '2026-09-25',
  },
  {
    id: '4',
    title: 'Close weekly ops report',
    owner: 'Taylor',
    priority: 'medium',
    status: 'done',
    due: '2026-09-22',
  },
  {
    id: '5',
    title: 'Triage payment webhook alerts',
    owner: 'Alex',
    priority: 'high',
    status: 'todo',
    due: '2026-09-23',
  },
  {
    id: '6',
    title: 'Prep Friday release notes',
    owner: 'Jordan',
    priority: 'medium',
    status: 'doing',
    due: '2026-09-26',
  },
]

function pct(part: number, total: number) {
  if (total === 0) return 0
  return Math.round((part / total) * 100)
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(SEED)
  const [view, setView] = useState<View>('dashboard')
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState(OWNERS[0])
  const [priority, setPriority] = useState<Priority>('medium')
  const [due, setDue] = useState('2026-09-24')

  const stats = useMemo(() => {
    const total = tasks.length
    const todo = tasks.filter(t => t.status === 'todo').length
    const doing = tasks.filter(t => t.status === 'doing').length
    const done = tasks.filter(t => t.status === 'done').length
    const high = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
    const byOwner = OWNERS.map(name => ({
      name,
      count: tasks.filter(t => t.owner === name && t.status !== 'done').length,
    }))
    const byPriority = (['high', 'medium', 'low'] as Priority[]).map(p => ({
      priority: p,
      count: tasks.filter(t => t.priority === p).length,
    }))
    return { total, todo, doing, done, high, byOwner, byPriority }
  }, [tasks])

  const visible =
    view === 'dashboard' ? tasks : tasks.filter(t => t.status === view)

  function addTask(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    setTasks(prev => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        owner,
        priority,
        status: 'todo',
        due,
      },
      ...prev,
    ])
    setTitle('')
  }

  function setStatus(id: string, status: Status) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)))
  }

  function removeTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const navItem = (id: View, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setView(id)}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${
        view === id
          ? 'bg-cyan-700 text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white p-4 md:block">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-700 text-sm font-bold text-white">
            TA
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Task Admin</p>
            <p className="text-xs text-gray-500">Operations</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItem('dashboard', 'Dashboard')}
          {navItem('todo', 'To do')}
          {navItem('doing', 'In progress')}
          {navItem('done', 'Done')}
        </nav>

        <p className="mt-8 text-xs text-gray-500">
          Internal board for delivery and support work.
        </p>
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {view === 'dashboard' ? 'Operations dashboard' : STATUS_LABEL[view]}
            </h1>
            <p className="text-sm text-gray-500">
              Track daily ops, support follow-ups, and release work.
            </p>
          </div>
          <Badge color="info" size="sm">
            Today · Sep 23
          </Badge>
        </header>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Card className="!p-4">
            <p className="text-sm text-gray-500">Open tasks</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-gray-500">To do</p>
            <p className="text-3xl font-bold text-cyan-700">{stats.todo}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-gray-500">In progress</p>
            <p className="text-3xl font-bold text-purple-700">{stats.doing}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-gray-500">Done</p>
            <p className="text-3xl font-bold text-green-700">{stats.done}</p>
          </Card>
          <Card className="!p-4">
            <p className="text-sm text-gray-500">High priority open</p>
            <p className="text-3xl font-bold text-red-600">{stats.high}</p>
          </Card>
        </div>

        {view === 'dashboard' && (
          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Status mix</h2>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>To do</span>
                    <span>{pct(stats.todo, stats.total)}%</span>
                  </div>
                  <Progress progress={pct(stats.todo, stats.total)} color="cyan" size="lg" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>In progress</span>
                    <span>{pct(stats.doing, stats.total)}%</span>
                  </div>
                  <Progress progress={pct(stats.doing, stats.total)} color="purple" size="lg" />
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>Done</span>
                    <span>{pct(stats.done, stats.total)}%</span>
                  </div>
                  <Progress progress={pct(stats.done, stats.total)} color="green" size="lg" />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Workload by owner</h2>
              <div className="space-y-4">
                {stats.byOwner.map(row => (
                  <div key={row.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>{row.name}</span>
                      <span>
                        {row.count} open · {pct(row.count, stats.total - stats.done || 1)}%
                      </span>
                    </div>
                    <Progress
                      progress={pct(row.count, Math.max(stats.total - stats.done, 1))}
                      color="blue"
                      size="lg"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Priority distribution</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {stats.byPriority.map(row => (
                  <div key={row.priority} className="rounded-lg border border-gray-200 p-4">
                    <p className="mb-2 text-sm capitalize text-gray-500">{row.priority}</p>
                    <p className="mb-3 text-2xl font-bold text-gray-900">{row.count}</p>
                    <Progress
                      progress={pct(row.count, stats.total)}
                      color={
                        row.priority === 'high'
                          ? 'red'
                          : row.priority === 'medium'
                            ? 'yellow'
                            : 'gray'
                      }
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        <Card className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Add task</h2>
          <form className="grid gap-3 md:grid-cols-5" onSubmit={addTask}>
            <div className="md:col-span-2">
              <Label htmlFor="title" className="mb-1 block">
                Title
              </Label>
              <TextInput
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Add a task…"
                required
              />
            </div>
            <div>
              <Label className="mb-1 block">Owner</Label>
              <OwnerMenu value={owner} onChange={setOwner} />
            </div>
            <div>
              <Label className="mb-1 block">Priority</Label>
              <PriorityMenu value={priority} onChange={setPriority} />
            </div>
            <div>
              <Label htmlFor="due" className="mb-1 block">
                Due
              </Label>
              <TextInput
                id="due"
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
              />
            </div>
            <div className="md:col-span-5">
              <Button type="submit" color="cyan">
                Add task
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {view === 'dashboard' ? 'All tasks' : `${STATUS_LABEL[view]} tasks`}
            </h2>
            <Badge color="gray">{visible.length}</Badge>
          </div>

          <div className="overflow-x-auto">
            <Table hoverable>
              <TableHead>
                <TableRow>
                  <TableHeadCell>Task</TableHeadCell>
                  <TableHeadCell>Owner</TableHeadCell>
                  <TableHeadCell>Priority</TableHeadCell>
                  <TableHeadCell>Due</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>
                    <span className="sr-only">Actions</span>
                  </TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No tasks in this view.
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map(task => (
                    <TableRow key={task.id} className="bg-white">
                      <TableCell className="max-w-xs font-medium text-gray-900">
                        {task.title}
                      </TableCell>
                      <TableCell>{task.owner}</TableCell>
                      <TableCell>
                        <Badge color={PRIORITY_COLOR[task.priority]} className="capitalize">
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.due}</TableCell>
                      <TableCell>
                        <div className="min-w-[9.5rem]">
                          <StatusMenu
                            compact
                            value={task.status}
                            onChange={status => setStatus(task.id, status)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="xs"
                          color="failure"
                          outline
                          onClick={() => removeTask(task.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </main>
    </div>
  )
}

export default App
