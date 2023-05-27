import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GroupsFilter from './GroupsFilter';

describe('GroupsFilter component', () => {
  const filterMock = {
    searchGroup: '',
    selectedSort: 'Сортування',
  };

  const setFilterMock = jest.fn();

  beforeEach(() => {
    setFilterMock.mockClear();
  });

  it('renders the filter inputs', () => {
    render(<GroupsFilter filter={filterMock} setFilter={setFilterMock} />);

    expect(screen.getByPlaceholderText('Пошук...')).toBeInTheDocument();
    expect(screen.getByText('За назвою групи')).toBeInTheDocument();
    expect(screen.getByText('За назвою задачі')).toBeInTheDocument();
  });

  it('updates searchGroup value when input value changes', () => {
    render(<GroupsFilter filter={filterMock} setFilter={setFilterMock} />);

    const input = screen.getByPlaceholderText('Пошук...');
    fireEvent.change(input, { target: { value: 'searchValue' } });

    expect(setFilterMock).toHaveBeenCalledWith({ ...filterMock, searchGroup: 'searchValue' });
  });

  it('updates selectedSort value when option changes', () => {
    render(<GroupsFilter filter={filterMock} setFilter={setFilterMock} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'taskTitle' } });

    expect(setFilterMock).toHaveBeenCalledWith({ ...filterMock, selectedSort: 'taskTitle' });
  });
});
