import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import List from './List';
import { fetchGroups, fetchRemoveGroup, selectGroups } from '../../redux/slices/groups';
import { selectIsAuth } from '../../redux/slices/auth';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../redux/slices/groups', () => ({
  fetchGroups: jest.fn(),
  fetchRemoveGroup: jest.fn(),
  selectGroups: {
    groups: {
      items: [],
      status: '',
    },
  },
}));

jest.mock('../../redux/slices/auth', () => ({
  selectIsAuth: jest.fn(),
}));

describe('List component', () => {
  const setStatisticsMock = jest.fn();
  const dispatchMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation((selector) => selector === selectGroups ? selectGroups : selectIsAuth);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Загальна статистика" button and "Створити групу" button', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: { items: [], status: 'loaded' },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    expect(screen.getByText('Загальна статистика')).toBeInTheDocument();
    expect(screen.getByText('Створити групу')).toBeInTheDocument();
  });

  it('redirects to "/login" if the user is not authenticated', () => {
    useSelector.mockReturnValueOnce(false);

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    expect(screen.queryByText('Загальна статистика')).not.toBeInTheDocument();
    expect(screen.queryByText('Створити групу')).not.toBeInTheDocument();
    expect(screen.queryByText('Завантаження')).not.toBeInTheDocument();
    expect(screen.queryByText('Сортування')).not.toBeInTheDocument();
    expect(screen.queryByText('Пошук...')).not.toBeInTheDocument();
  });

  it('dispatches fetchGroups action on component mount', () => {
    useSelector.mockReturnValueOnce(true);

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(fetchGroups());
  });

  it('renders the loading state while groups are being fetched', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: { items: [], status: 'loading' },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    expect(screen.getByText('Завантаження')).toBeInTheDocument();
  });

  it('renders the Group components based on the groups data', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: {
        items: [
          { _id: '1', title: 'Group 1', tasks: [] },
          { _id: '2', title: 'Group 2', tasks: [] },
        ],
        status: 'succeeded',
      },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
  });

  it('dispatches fetchRemoveGroup action when removeGroup function is called', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: {
        items: [{ _id: '1', title: 'Group 1', tasks: [] }],
        status: 'loaded',
      },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    const removeButton = screen.getByRole('button', { name: 'Видалити групу' });
    fireEvent.click(removeButton);

    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(dispatchMock).toHaveBeenCalledWith(fetchRemoveGroup('1'));
  });

  it('renders the statistics button and redirects to "/statistics" when clicked', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: {
        items: [{ _id: '1', title: 'Group 1', tasks: [] }],
        status: 'loaded',
      },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    const statisticsButton = screen.getByText('Загальна статистика');
    fireEvent.click(statisticsButton);

    expect(setStatisticsMock).toHaveBeenCalledTimes(1);
    expect(setStatisticsMock).toHaveBeenCalledWith({
      topPriorityGroups: [{count: 0, group: "Group 1"}],
      completed: 0,
      notCompleted: 0,
    });
    expect(screen.getByText('Статистика групи')).toBeInTheDocument();
  });

  it('renders the create group modal when "Створити групу" button is clicked', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: { items: [], status: 'loaded' },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    const createGroupButton = screen.getByText('Створити групу');
    fireEvent.click(createGroupButton);

    expect(screen.getByPlaceholderText('Назва групи')).toBeInTheDocument();
    expect(screen.getByText('Додати групу')).toBeInTheDocument();
  });

  it('renders the GroupsFilter component with search and sort options', () => {
    useSelector.mockReturnValueOnce(true);
    useSelector.mockReturnValueOnce({
      groups: { items: [], status: 'loaded' },
    });

    render(
      <Router>
        <List setStatistics={setStatisticsMock} />
      </Router>
    );

    expect(screen.getByPlaceholderText('Пошук...')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Сортування')).toBeInTheDocument();
    expect(screen.getByText('За назвою групи')).toBeInTheDocument();
    expect(screen.getByText('За назвою задачі')).toBeInTheDocument();
  });
});
