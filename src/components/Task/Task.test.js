import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { taskMockObject} from '../../mocs/groupMock'
import Task from './Task.js';

describe('Task component', () => {
  const task = taskMockObject;

  const props = {
    task,
    edit: null,
    value: '',
    setValue: jest.fn(),
    priorityTask: jest.fn(),
    number: 1,
    editTask: jest.fn(),
    removeTask: jest.fn(),
    saveTask: jest.fn(),
    statusTask: jest.fn(),
  };

  it('renders task details when not in edit mode', () => {
    render(<Task {...props} />);

    expect(screen.getByText('1. task3')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-input')).toBeNull();
    expect(screen.getByText('Змінити')).toBeInTheDocument();
    expect(screen.getByText('Видалити')).toBeInTheDocument();
    expect(screen.getByText('Відкрити')).toBeInTheDocument();
  });

  it('renders task details in edit mode', () => {
    render(<Task {...props} edit={task._id} />);

    expect(screen.getByTestId('edit-input')).toBeInTheDocument();
    expect(screen.getByTestId('edit-input')).toHaveValue('');
    expect(screen.getByText('Зберегти')).toBeInTheDocument();
  });

  it('calls setValue function when input value changes', () => {
    render(<Task {...props} edit={task._id} />);
    const input = screen.getByTestId('edit-input');

    fireEvent.change(input, { target: { value: 'Updated Task' } });

    expect(props.setValue).toHaveBeenCalledTimes(1);
    expect(props.setValue).toHaveBeenCalledWith('Updated Task');
  });

  it('calls priorityTask function when priority button is clicked', () => {
    render(<Task {...props} />);

    const priorityButton = screen.getByText('Пріорітет');
    fireEvent.click(priorityButton);

    expect(props.priorityTask).toHaveBeenCalledTimes(1);
    expect(props.priorityTask).toHaveBeenCalledWith(task);
  });

  it('calls editTask function when edit button is clicked', () => {
    render(<Task {...props} />);

    const editButton = screen.getByText('Змінити');
    fireEvent.click(editButton);

    expect(props.editTask).toHaveBeenCalledTimes(1);
    expect(props.editTask).toHaveBeenCalledWith(task);
  });

  it('calls removeTask function when delete button is clicked', () => {
    render(<Task {...props} />);

    const deleteButton = screen.getByText('Видалити');
    fireEvent.click(deleteButton);

    expect(props.removeTask).toHaveBeenCalledTimes(1);
    expect(props.removeTask).toHaveBeenCalledWith(task);
  });

  it('calls statusTask function when open/close button is clicked', () => {
    render(<Task {...props} />);

    const openCloseButton = screen.getByText('Відкрити');
    fireEvent.click(openCloseButton);

    expect(props.statusTask).toHaveBeenCalledTimes(1);
    expect(props.statusTask).toHaveBeenCalledWith(task);
  });

  it('calls saveTask function when save button is clicked', () => {
    render(<Task {...props} edit={task._id} />);

    const saveButton = screen.getByText('Зберегти');
    fireEvent.click(saveButton);

    expect(props.saveTask).toHaveBeenCalledTimes(1);
    expect(props.saveTask).toHaveBeenCalledWith(task);
  });
});
