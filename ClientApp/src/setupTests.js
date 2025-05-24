// Optional: Import jest-dom for custom matchers
// This extends Vitest's expect with matchers like .toBeInTheDocument(), .toHaveTextContent(), etc.
import '@testing-library/jest-dom';

// You can add other global setup here if needed, for example:
// - Mocking global objects (localStorage, fetch)
// - Setting up MSW (Mock Service Worker) for API mocking across tests

// Example: Clean up after each test (Vitest does this by default for many things)
// import { afterEach } from 'vitest';
// import { cleanup } from '@testing-library/react';
// afterEach(() => {
//   cleanup(); // Cleans up DOM created by React Testing Library
// });
