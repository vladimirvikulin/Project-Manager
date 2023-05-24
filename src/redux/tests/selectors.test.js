import { loadedMockObject, errorMockObject } from "../../mocs/state";
import { selectIsAuth } from '../slices/auth';
import { selectGroups } from "../slices/groups";

describe("Testing redux selectors", () => {
  it("should select success auth", () => {
    expect(selectIsAuth(loadedMockObject)).toBe(true);
  });
  it("should select error auth", () => {
    expect(selectIsAuth(errorMockObject)).toBe(false);
  });
  it("should select groups from loaded object", () => {
    const successResult = selectGroups(loadedMockObject)
    expect(successResult).toEqual(loadedMockObject.groups);
  });
  it("should select no groups from error loaded object", () => {
    const errorResult = selectGroups(errorMockObject)
    expect(errorResult).toEqual(errorMockObject.groups);
  });
});