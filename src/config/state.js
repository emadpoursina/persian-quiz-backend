import { atomWithStorage } from "jotai/utils";

export const currentUserAtom = atomWithStorage(
  "persian-quiz-current-user",
  null
);
