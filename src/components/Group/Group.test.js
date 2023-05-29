import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useDispatch } from 'react-redux';
import { fetchUpdateTask, fetchDeleteTask } from '../../redux/slices/groups';
import ListGroup from './Group';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../redux/slices/groups.js', () => ({
  fetchUpdateTask: jest.fn(),
  fetchDeleteTask: jest.fn(),
}));

describe('ListGroup', () => {
  const group = {
    _id: '1',
    title: 'Group Title',
    tasks: [
      {
        _id: '1',
        title: 'Task 1',
        status: false,
        priority: false,
      },
      {
        _id: '2',
        title: 'Task 2',
        status: true,
        priority: true,
      },
    ],
  };

  const setStatisticsMock = jest.fn();
  const removeGroupMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders group title', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const groupTitle = screen.getByText('Group Title');
    expect(groupTitle).toBeInTheDocument();
  });

  it('renders task list', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const task1 = screen.getByText('1. Task 1');
    const task2 = screen.getByText('2. Task 2');
    expect(task1).toBeInTheDocument();
    expect(task2).toBeInTheDocument();
  });

  it('calls removeGroup when "Видалити групу" button is clicked', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const removeGroupButton = screen.getByText('Видалити групу');
    fireEvent.click(removeGroupButton);

    expect(removeGroupMock).toHaveBeenCalledTimes(1);
    expect(removeGroupMock).toHaveBeenCalledWith(group);
  });

  it('renders "Список задач порожній" when tasks list is empty', () => {
    const emptyGroup = {
      ...group,
      tasks: [],
    };

    render(
      <Router>
        <ListGroup
          group={emptyGroup}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const emptyMessage = screen.getByText('Список задач порожній');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('calls fetchDeleteTask when removeTask is called', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const removeTaskButton = screen.getAllByText('Видалити')[0];
    fireEvent.click(removeTaskButton);

    expect(fetchDeleteTask).toHaveBeenCalledTimes(1);
    expect(fetchDeleteTask).toHaveBeenCalledWith({
      groupId: group._id,
      taskId: group.tasks[0]._id,
    });
  });

  it('calls fetchUpdateTask when statusTask is called', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const statusTaskButton = screen.getByText('Закрити');
    fireEvent.click(statusTaskButton);

    expect(fetchUpdateTask).toHaveBeenCalledTimes(1);
    expect(fetchUpdateTask).toHaveBeenCalledWith({
      updatedTask: {
        ...group.tasks[1],
        status: false,
      },
      groupId: group._id,
      taskId: group.tasks[1]._id,
    });
  });

  it('calls fetchUpdateTask when priorityTask is called', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );

    const priorityTaskButton = screen.getAllByText('Пріорітет')[0];
    fireEvent.click(priorityTaskButton);

    expect(fetchUpdateTask).toHaveBeenCalledTimes(1);
    expect(fetchUpdateTask).toHaveBeenCalledWith({
      updatedTask: {
        ...group.tasks[0],
        priority: true,
      },
      groupId: group._id,
      taskId: group.tasks[0]._id,
    });
  });

  it('calls fetchUpdateTask when saveTask is called', () => {
    render(
      <Router>
        <ListGroup
          group={group}
          setStatistics={setStatisticsMock}
          removeGroup={removeGroupMock}
        />
      </Router>
    );
    const editTaskButton = screen.getAllByText('Змінити')[0];
    fireEvent.click(editTaskButton);
    const newTitle = 'New Task Title';
    const input = screen.getAllByPlaceholderText('Назва задачі')[0];
    fireEvent.change(input, { target: { value: newTitle } });
    const saveTaskButton = screen.getByText('Зберегти');
    fireEvent.click(saveTaskButton);

    expect(fetchUpdateTask).toHaveBeenCalledTimes(1);
    expect(fetchUpdateTask).toHaveBeenCalledWith({
      updatedTask: {
        ...group.tasks[0],
        title: 'Task 1',
      },
      groupId: group._id,
      taskId: group.tasks[0]._id,
    });
  });
});