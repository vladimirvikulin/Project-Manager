import { 
    loadingMockObject, 
    loadedMockObject, 
    loadedRemovedMockObject, 
    loadedUpdatedMockObject, 
    groupToUpdateMockObject,
    groupMockObject, 
    taskMockObject,
    taskGroupAddedMockObject,
    taskDeletedOrUpdatedMockArray,
    taskDeletedOrUpdatedMockObject
} from '../../mocs/groupMock.js';
import groupReducer, {
    fetchGroups,
    fetchCreateGroup,
    fetchRemoveGroup,
    fetchUpdateGroup,
    fetchCreateTask,
    fetchDeleteTask,
    fetchUpdateTask
} from '../slices/groups.js'

describe("Testing group slice", () => {
    it("should return default state when passed an empty action", () => {
      const result = groupReducer(undefined, { type: '' });
      expect(result).toEqual(loadingMockObject)
    });
    it("should return empty items array when fetchGroups pending", () => {
        const action = { type: fetchGroups.pending.type };
        const result = groupReducer(loadingMockObject, action);
        expect(result.groups.items).toEqual([]);
      });
    it("should return payload when fetchGroups fulfilled", () => {
        const action = { type: fetchGroups.fulfilled.type, payload: loadedMockObject};
        const result = groupReducer(loadedMockObject, action);
        expect(result.groups.items).toEqual(action.payload);
      });
    it("should return empty items array when fetchGroups error", () => {
        const action = { type: fetchGroups.rejected.type };
        const result = groupReducer(loadingMockObject, action);
        expect(result.groups.items).toEqual([]);
      });
      it("should return items with pushed payload when fetchCreateGroup fulfilled", () => {
        const action = { type: fetchCreateGroup.fulfilled.type, payload: groupMockObject };
        const result = groupReducer(loadedMockObject, action);
        expect(result.groups.items).toEqual([...loadedMockObject.groups.items, action.payload]);
      });
      it("should return filtered items array when fetchRemoveGroup pending", () => {
        const action = { type: fetchRemoveGroup.pending.type, meta: {arg : loadedMockObject.groups.items[1]._id}};
        const result = groupReducer(loadedMockObject, action);
        expect(result).toEqual(loadedRemovedMockObject);
      });
      it("should return updated items array when fetchUpdateGroup fulfilled", () => {
        const action = { type: fetchUpdateGroup.fulfilled.type, payload: groupToUpdateMockObject, meta: {arg : { groupId: groupToUpdateMockObject._id }}};
        const result = groupReducer(loadedMockObject, action);
        console.log(result.groups)
        expect(result).toEqual(loadedUpdatedMockObject);
      });
      it("should return items array with pushed payload when fetchCreateTask fulfilled", () => {
        const action = { type: fetchCreateTask.fulfilled.type, payload: taskMockObject, meta: {arg : { id:  loadedMockObject.groups.items[0]._id}}};
        const result = groupReducer(loadedMockObject, action);
        expect(result).toEqual(taskGroupAddedMockObject);
      });
      it("should return items array with pushed payload when fetchDeleteTask fulfilled", () => {
        const action = { type: fetchDeleteTask.fulfilled.type, payload: taskDeletedOrUpdatedMockArray, meta: {arg : { groupId:  loadedMockObject.groups.items[0]._id}}};
        const result = groupReducer(loadedMockObject, action);
        expect(result).toEqual(taskDeletedOrUpdatedMockObject);
      });
      it("should return items array with pushed payload when fetchUpdateTask fulfilled", () => {
        const action = { type: fetchUpdateTask.fulfilled.type, payload: taskDeletedOrUpdatedMockArray, meta: {arg : { groupId:  loadedMockObject.groups.items[0]._id}}};
        const result = groupReducer(loadedMockObject, action);
        expect(result).toEqual(taskDeletedOrUpdatedMockObject);
      });
  });