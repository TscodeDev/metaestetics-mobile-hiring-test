# Bug List

There are bugs in the codebase. Your job is to find them, understand why they're broken, and fix them.

## Known Issues

1. **Phone number validation** - Something's wrong with how phone numbers are validated
2. **Memory leak** - There's a memory leak somewhere in the Profile screen
3. **Form state** - Form data doesn't persist when navigating between registration steps
4. **Keyboard handling** - On smaller screens, the keyboard covers important UI elements
5. **Image updates** - Profile images don't update immediately after editing

### 1. Phone number validation

**Root cause:** The phone number field mixed country code and local number into a single value while the Yup schemas (`registerStep2ValidationSchema`, `editProfileValidationSchema`) expected exactly 10 digits for `phoneNumber`. The original phone input wiring also misused `react-native-phone-number-input` callbacks, causing bad values and runtime errors.

**Fix:** Store `phoneNumber` as digits only and `countryCode` separately in both the registration Step 2 screen and the EditProfile screen. The shared phone input (and/or simple `Input` field) normalizes user input by stripping non‑digit characters before saving to Formik state. The existing Yup regex (`/^[0-9]{10}$/`) remains unchanged and now matches the stored format, so validation and UX are consistent.

### 2. Memory leak in Profile

**Root cause:** Profile-related state and async behavior were not fully centralized. Editing the profile previously left error state and async work tied to components, which could outlive the screen and give the impression of a leak or stale UI.

**Fix:** The `Profile` screen is now a pure view of `state.auth.user` (no `useEffect` or local async state), and all profile updates are handled through a dedicated Redux thunk (`updateProfileThunk`). The thunk updates both AsyncStorage and Redux, and the `EditProfile` screen clears any auth error on unmount using `clearError`, so no listeners or pending state remain attached after leaving the screen.

### 3. Form state not persisting between registration steps

**Root cause:** The multi‑step registration flow originally had placeholder step components with no shared state. Each step effectively owned its own local values, so moving forward or back discarded previous input.

**Fix:** The `Register` container now owns a single `formData: Partial<RegisterData>` object. Each step (Step1–Step4) is a Formik form initialized from `formData` and calls a shared `onDataChange` callback before navigating to the next/previous step. This merges the step’s values into the central `formData`, ensuring all fields persist across steps and can be reviewed in the final step.

### 4. Keyboard covering UI on smaller screens

**Root cause:** The main forms (Login, Register, Edit Profile) were not wrapped in keyboard‑aware containers, so on smaller devices the software keyboard could cover text fields and primary buttons.

**Fix:** The affected screens now use `KeyboardAvoidingView` with a platform‑appropriate `behavior` (`padding` on iOS, `height` on Android) and a `ScrollView` with `keyboardShouldPersistTaps="handled"`. This lets the content scroll above the keyboard and keeps critical controls (like “Next”, “Login”, “Save”) visible while typing.

### 5. Profile image updates not reflecting immediately

**Root cause:** Updating the profile image in the EditProfile screen did not reliably propagate to the central user state and persisted storage, so the Profile screen often continued to show the old avatar after saving.

**Fix:** The EditProfile form uses `ImagePickerComponent` to update the `profileImage` field in Formik. On submit it dispatches `updateProfileThunk`, which calls `mockApiService.updateProfile` and then updates both AsyncStorage (via `storageService.saveUser`) and the Redux `auth.user` state. Because the Profile screen renders directly from `state.auth.user.profileImage`, the new image appears immediately after a successful save and navigation back.

## Your Task

- Find these bugs
- Understand the root cause
- Fix them properly
- Document what you found and how you fixed it

**Bonus:** If you find additional bugs or issues, include them in your submission.

---

## Evaluation

We'll evaluate:
- Did you find the bugs?
- Did you understand WHY they were bugs?
- Was your fix correct and complete?
- Did you introduce new bugs while fixing old ones?
- Did you document your process?

---

## Task Implementation Summary (Tasks 1–4)

### Task 1: Registration Flow

- **Goal:** Multi-step registration with email/password, personal info (name, phone, DOB, gender), optional profile photo, review & submit, and auto-login.
- **Implementation:** `Register` holds shared `formData: Partial<RegisterData>` and coordinates four Formik+Yup steps (`Step1EmailPassword`, `Step2PersonalInfo`, `Step3ProfilePhoto`, `Step4Review`). On final submit it dispatches `registerThunk`, which calls `mockApiService.register`, persists user/token with `storageService`, and updates `auth` state so the user is logged in immediately.

### Task 2: Profile Editing

- **Goal:** Allow users to edit their profile, with pre-populated fields, cancel without saving, persisted changes, and immediate UI updates (including image).
- **Implementation:** `EditProfile` is a Formik form using `editProfileValidationSchema`, initialized from `auth.user`. It lets users change name, phone (`countryCode` + 10-digit `phoneNumber`), DOB, gender, and `profileImage` via `ImagePickerComponent`. On save it dispatches `updateProfileThunk` (which calls `mockApiService.updateProfile` and updates AsyncStorage + Redux), then navigates back so `Profile` shows the updated data; Cancel just goes back without dispatching.

### Task 3: Clinics Performance

- **Goal:** Make the Clinics screen fast for 100+ items, with smooth loading, search, and scrolling, and fewer unnecessary re-renders.
- **Implementation:** `ClinicsScreen` now uses a typed `Clinic` model and `useClinicData` (backed by `mockApiService.getClinics/searchClinics`) instead of local mock arrays. Search is debounced (300ms), and `FlatList` is optimized with `initialNumToRender`, `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews`, and memoized `ClinicItem` + `renderItem`/`keyExtractor`, eliminating most jank and redundant re-renders.

### Task 4: Reusable Data Hook

- **Goal:** Replace ad-hoc fetching with a generic, reusable hook that handles loading, errors, caching, and refetch, and integrates with the mock API.
- **Implementation:** `useDataFetch<TData, TParams>` is a generic hook that accepts a cache key, a typed fetch function, and params; it manages `data`, `loading`, `error`, and `refetch`, with a simple TTL-based in-memory cache shared across instances. `useClinicData` is a thin wrapper around `useDataFetch` that plugs into `mockApiService` for clinics; other screens can reuse `useDataFetch` with their own keys and fetch functions.
