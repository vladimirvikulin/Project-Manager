import { loadingMockObject, loadedMockObject, loadedUserInfoMockObject } from "../../mocs/authMock";
import authReducer, { logout, fetchAuth, fetchAuthMe, fetchRegister } from '../slices/auth';

describe("Testing auth slice", () => {
    it("should logout return data to be null", () => {
        const action = { type: logout.type };
        const result = authReducer(loadedMockObject.auth, action);
        expect(result.data).toBeNull();
      });
      it("should return default state when passed an empty action", () => {
        const result = authReducer(undefined, { type: '' });
        expect(result).toEqual(loadingMockObject)
      });
      it("should return data null when fetchAuth pending", () => {
        const action = { type: fetchAuth.pending.type };
        const result = authReducer(loadedMockObject, action);
        expect(result.data).toBeNull();;
      });
      it("should return data payload when fetchAuth fulfilled", () => {
        const action = { type: fetchAuth.fulfilled.type, payload: loadedUserInfoMockObject };
        const result = authReducer(loadingMockObject, action);
        expect(result.data).toEqual(action.payload);;
      });
      it("should return data null when fetchAuth error", () => {
        const action = { type: fetchAuth.rejected.type };
        const result = authReducer(loadedMockObject, action);
        expect(result.data).toBeNull();;
      });
      it("should return data null when fetchAuthMe pending", () => {
        const action = { type: fetchAuthMe.pending.type };
        const result = authReducer(loadedMockObject, action);
        expect(result.data).toBeNull();;
      });
      it("should return data payload when fetchAuthMe fulfilled", () => {
        const action = { type: fetchAuthMe.fulfilled.type, payload: loadedUserInfoMockObject };
        const result = authReducer(loadingMockObject, action);
        expect(result.data).toEqual(action.payload);;
      });
      it("should return data null when fetchAuthMe error", () => {
        const action = { type: fetchAuthMe.rejected.type };
        const result = authReducer(loadedMockObject, action);
        expect(result.data).toBeNull();;
      });
      it("should return data null when fetchRegister pending", () => {
        const action = { type: fetchRegister.pending.type };
        const result = authReducer(loadedMockObject, action);
        expect(result.data).toBeNull();;
      });
      it("should return data payload when fetchRegister fulfilled", () => {
        const action = { type: fetchRegister.fulfilled.type, payload: loadedUserInfoMockObject };
        const result = authReducer(loadingMockObject, action);
        expect(result.data).toEqual(action.payload);;
      });
      it("should return data null when fetchRegister error", () => {
        const action = { type: fetchRegister.rejected.type };
        const result = authReducer(loadedMockObject, action);
        expect(result.data).toBeNull();;
      });
 });