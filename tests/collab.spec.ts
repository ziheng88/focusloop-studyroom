import { test, expect, loadAllTestAccounts } from 'deepspace/testing'

const usableTestAccounts = loadAllTestAccounts().length
test.skip(
  usableTestAccounts < 2,
  'FocusLoop collaboration tests need two locally usable DeepSpace test accounts.',
)

test('two signed-in learners share a room, task, and mistake signal live', async ({ users }) => {
  const [learnerA, learnerB] = await users(2)
  const stamp = Date.now()
  const roomName = `Graph practice ${stamp}`
  const taskName = `Trace BFS ${stamp}`
  const problemTitle = `Visited set mistake ${stamp}`

  await Promise.all([learnerA.page.goto('/home'), learnerB.page.goto('/home')])
  await expect(learnerA.page.getByTestId('app-navigation')).toBeVisible({ timeout: 15_000 })
  await expect(learnerB.page.getByTestId('app-navigation')).toBeVisible({ timeout: 15_000 })

  // Learner A creates the shared space. All signed-in prototype users can read it;
  // deliberate private membership is documented as a post-v1 tradeoff.
  await learnerA.page.getByRole('button', { name: 'Create room' }).click()
  await learnerA.page.getByLabel('Room name').fill(roomName)
  await learnerA.page.getByLabel('Subject').fill('Algorithms')
  await learnerA.page.getByRole('button', { name: 'Create room', exact: true }).last().click()
  await expect(learnerA.page.getByRole('heading', { name: roomName })).toBeVisible({ timeout: 15_000 })

  // The new record reaches the other browser over DeepSpace Records.
  await expect(learnerB.page.getByRole('button', { name: new RegExp(roomName) })).toBeVisible({ timeout: 15_000 })
  await learnerB.page.getByRole('button', { name: new RegExp(roomName) }).click()

  await learnerA.page.getByLabel('Filter questions by topic category').selectOption('graphs')
  await expect(learnerA.page.getByRole('button', { name: 'Select Island counter' })).toBeVisible()
  await learnerA.page.getByLabel('Filter questions by topic category').selectOption('All')
  await learnerA.page.getByRole('button', { name: 'Select Duplicate detector' }).click()
  await learnerA.page.getByRole('button', { name: 'Start working on this' }).click()
  await expect(learnerA.page.getByText('You are working on this question now.')).toBeVisible()
  await expect(learnerB.page.getByText('Solving · Duplicate detector')).toBeVisible({ timeout: 15_000 })

  await learnerA.page.getByPlaceholder('Add a task, e.g. solve 3 graph problems').fill(taskName)
  await learnerA.page.getByPlaceholder('Topic (optional)').fill('BFS')
  await learnerA.page.getByRole('button', { name: 'Add', exact: true }).click()
  await expect(learnerB.page.getByText(taskName)).toBeVisible({ timeout: 15_000 })
  await expect(learnerB.page.getByText('BFS', { exact: true })).toBeVisible()
  await learnerB.page.getByRole('button', { name: `Advance ${taskName} from planned` }).click()
  await expect(learnerA.page.getByRole('button', { name: `Advance ${taskName} from in_progress` })).toBeVisible({ timeout: 15_000 })

  await learnerA.page.getByRole('button', { name: 'Log a mistake' }).click()
  await learnerA.page.getByLabel('Problem title or link label').fill(problemTitle)
  await learnerA.page.getByLabel('Topic', { exact: true }).fill('Graph traversal')
  await learnerA.page.getByLabel('What went wrong?').fill('I marked nodes visited after enqueueing them.')
  await learnerA.page.getByRole('button', { name: 'Save mistake' }).click()

  // B sees both the raw learning signal and FocusLoop's computed group priority.
  await expect(learnerB.page.getByText(problemTitle)).toBeVisible({ timeout: 15_000 })
  await expect(learnerB.page.getByText('Graph traversal', { exact: true })).toBeVisible()
  await expect(learnerB.page.getByRole('heading', { name: 'Weak-topic signal' })).toBeVisible()

  const fileName = `bfs-notes-${stamp}.txt`
  await learnerA.page.getByLabel('Upload study material').setInputFiles({
    name: fileName,
    mimeType: 'text/plain',
    buffer: Buffer.from('Review BFS queue and visited-set order.'),
  })
  await expect(learnerB.page.getByRole('link', { name: fileName })).toBeVisible({ timeout: 15_000 })

  await learnerA.page.getByRole('button', { name: 'Delete room', exact: true }).click()
  await expect(learnerA.page.getByRole('heading', { name: 'Delete this study room?' })).toBeVisible()
  await learnerA.page.getByRole('button', { name: 'Delete room', exact: true }).last().click()
  await expect(learnerA.page.getByText('Room deleted. Shared records are no longer shown in FocusLoop.')).toBeVisible({ timeout: 15_000 })
  await expect(learnerB.page.getByRole('button', { name: new RegExp(roomName) })).toHaveCount(0, { timeout: 15_000 })
  await expect(learnerB.page.getByText('This room was deleted by its owner.')).toBeVisible({ timeout: 15_000 })
  await expect(learnerB.page.getByRole('heading', { name: 'Create a room to begin.' })).toBeVisible()
})
