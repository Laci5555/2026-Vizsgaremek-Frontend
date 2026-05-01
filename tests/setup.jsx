import React from "react";
import "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

// Silence common console noise during tests
const originalError = console.error;
const originalWarn = console.warn;
console.error = (...args) => {
  const msg = args.map(a => a?.toString() || "").join(" ");
  if (msg.includes("act(...)") || 
      msg.includes("An update to %s inside a test") || 
      msg.includes("src attribute") ||
      msg.includes("empty string") ||
      msg.includes("download the whole page again")) {
    return;
  }
  originalError(...args);
};
console.warn = (...args) => {
  const msg = args[0]?.toString() || "";
  if (msg.includes("act(...)")) return;
  originalWarn(...args);
};

// Browser API Mocks
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) { this.callback = callback; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

const PLACEHOLDER_IMG = "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-2409187029.jpg";

// Mock Firebase Modules
vi.mock("firebase/app", () => ({ initializeApp: vi.fn() }));
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
  getDocs: vi.fn(() => Promise.resolve({ 
    docs: [{ data: () => ({ name: "Test Item", username: "Tester", picture: PLACEHOLDER_IMG, img: PLACEHOLDER_IMG, email: "test@test.com" }), id: "test-id" }] 
  })),
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

// Mock local files
vi.mock("../src/firebaseApp", () => ({
  db: {},
  auth: { currentUser: { email: "test@test.com", photoURL: PLACEHOLDER_IMG } },
}));

// Mock React Router
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

// Mock Navbar globally to speed up other tests
vi.mock("../src/components/Navbar", () => ({
  default: () => <div data-testid="navbar-mock">Navbar</div>
}));
