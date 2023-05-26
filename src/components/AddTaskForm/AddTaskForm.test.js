import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useDispatch } from 'react-redux';
import { fetchCreateTask } from '../../redux/slices/groups';
import AddTaskForm from './AddTaskForm';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('../../redux/slices/groups.js', () => ({
    fetchCreateTask: jest.fn(),
  }));

describe('AddTaskForm component', () => {
  const dispatchMock = jest.fn();
  beforeEach(() => {
    useDispatch.mockReturnValue(dispatchMock);
  });
  useDispatch.mockReturnValue(dispatchMock);
  it('renders input and button', () => {
    render(<AddTaskForm setVisible={() => {}} id={1} />);

    const inputElement = screen.getByPlaceholderText('Назва задачі');
    const buttonElement = screen.getByText('Додати задачу');

    expect(inputElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it('updates input value when typed', () => {
    render(<AddTaskForm setVisible={() => {}} id={1} />);

    const inputElement = screen.getByPlaceholderText('Назва задачі');

    fireEvent.change(inputElement, { target: { value: 'New Task' } });

    expect(inputElement.value).toBe('New Task');
  });

  it('dispatches fetchCreateTask action when button is clicked', () => {
    render(<AddTaskForm setVisible={() => {}} id={1} />);

    const inputElement = screen.getByPlaceholderText('Назва задачі');
    const buttonElement = screen.getByText('Додати задачу');

    fireEvent.change(inputElement, { target: { value: 'New Task' } });
    fireEvent.click(buttonElement);

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(fetchCreateTask).toHaveBeenCalledWith({
      newTask: {
        title: 'New Task',
        status: true,
        priority: false,
      },
      id: 1,
    });
  });
  
  it('resets input value after adding task', () => {
    render(<AddTaskForm setVisible={() => {}} id={1} />);

    const inputElement = screen.getByPlaceholderText('Назва задачі');
    const buttonElement = screen.getByText('Додати задачу');

    fireEvent.change(inputElement, { target: { value: 'New Task' } });
    fireEvent.click(buttonElement);

    expect(inputElement.value).toBe('');
  });
});
