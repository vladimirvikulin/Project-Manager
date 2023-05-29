import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useDispatch } from 'react-redux';
import AddGroupForm from './AddGroupForm.js';
import { fetchCreateGroup } from '../../redux/slices/groups';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../redux/slices/groups', () => ({
  fetchCreateGroup: jest.fn(),
}));

describe('AddGroupForm component', () => {
  const dispatchMock = jest.fn();
  const setModalGroupVisibleMock = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
    dispatchMock.mockClear();
    setModalGroupVisibleMock.mockClear();
  });

  it('renders the form', () => {
    render(<AddGroupForm setModalGroupVisible={setModalGroupVisibleMock} />);

    expect(screen.getByPlaceholderText('Назва групи')).toBeInTheDocument();
    expect(screen.getByText('Додати групу')).toBeInTheDocument();
  });

  it('dispatches fetchCreateGroup and clears the input when addNewGroup is called', () => {
    render(<AddGroupForm setModalGroupVisible={setModalGroupVisibleMock} />);

    fireEvent.change(screen.getByPlaceholderText('Назва групи'), {
      target: { value: 'New Group' },
    });
    fireEvent.click(screen.getByText('Додати групу'));

    expect(fetchCreateGroup).toHaveBeenCalledWith({
      title: 'New Group',
      tasks: [],
      completed: 0,
      notCompleted: 0,
    });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(setModalGroupVisibleMock).toHaveBeenCalledWith(false);
    expect(screen.getByPlaceholderText('Назва групи').value).toBe('');
  });
});
