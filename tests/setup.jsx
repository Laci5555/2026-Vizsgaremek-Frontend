import React from "react";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Global Mocks for Vitest
import { vi } from "vitest";

// Mock Firebase Modules
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(() => vi.fn()),
  GoogleAuthProvider: class {},
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  collection: vi.fn((db, path) => ({ _path: path })),
  doc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()),
  arrayUnion: vi.fn(),
  arrayRemove: vi.fn(),
  Timestamp: { now: () => Date.now(), fromDate: (d) => d },
  or: vi.fn(),
}));

// Mock the local firebaseApp file globally
vi.mock("../src/firebaseApp", () => ({
  db: {},
  auth: {},
}));

// Mock React Router globally
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: "/" })),
    useParams: vi.fn(() => ({ id: "123" })),
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
    NavLink: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
    Navigate: ({ to }) => <div data-testid="navigate-mock" data-to={to} />,
  };
});
// Mock Navbar globally
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));

