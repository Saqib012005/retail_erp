import { env } from '@/config/env'

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Single switch used by every service.
 * - Mock mode: return local mock data (optional short delay to mimic network)
 * - API mode: call the provided API function
 *
 * If API mode fails (e.g. the backend route is not implemented yet), fall back
 * to the mock data so screens keep working instead of rendering empty tables.
 *
 * Pages/components should only call services — never import `@/mocks/*` directly.
 */
export async function fromMockOrApi<T>(
  mockData: T | (() => T | Promise<T>),
  apiCall: () => Promise<T>
): Promise<T> {
  const mock = async (): Promise<T> => {
    if (env.mockDelayMs > 0) await delay(env.mockDelayMs)
    return typeof mockData === 'function'
      ? await (mockData as () => T | Promise<T>)()
      : mockData
  }

  if (env.useMocks) return mock()

  try {
    return await apiCall()
  } catch (error) {
    console.warn(
      '[dataSource] API request failed; falling back to mock data.',
      error
    )
    return mock()
  }
}
