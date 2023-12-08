/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { act, fireEvent, getAllByLabelText, getByLabelText, render } from '@testing-library/react';

import { ChatHistoryList } from '../chat_history_list';

describe('<ChatHistoryList />', () => {
  it('should render two history titles, update times and one horizontal rule', async () => {
    const { getByText } = render(
      <ChatHistoryList
        chatHistories={[
          { id: '1', title: 'foo', updatedTimeMs: 0 },
          { id: '2', title: 'bar', updatedTimeMs: 360000 },
        ]}
      />
    );

    expect(getByText('foo')).toBeInTheDocument();
    expect(getByText('bar')).toBeInTheDocument();
    expect(getByText('January 1, 1970 at 12:0 AM')).toBeInTheDocument();
    expect(getByText('January 1, 1970 at 12:6 AM')).toBeInTheDocument();
    expect(getAllByLabelText(document.body, 'history horizontal rule')).toHaveLength(1);
  });

  it('should call onHistoryTitleClick id and title after', () => {
    const onHistoryTitleClick = jest.fn();
    const { getByText } = render(
      <ChatHistoryList
        chatHistories={[{ id: '1', title: 'foo', updatedTimeMs: 0 }]}
        onChatHistoryTitleClick={onHistoryTitleClick}
      />
    );

    expect(onHistoryTitleClick).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByText('foo'));
    });
    expect(onHistoryTitleClick).toHaveBeenCalled();
  });

  it('should call onChatHistoryTitleClick id and title after', () => {
    const onChatHistoryTitleClickMock = jest.fn();
    const { getByText } = render(
      <ChatHistoryList
        chatHistories={[{ id: '1', title: 'foo', updatedTimeMs: 0 }]}
        onChatHistoryTitleClick={onChatHistoryTitleClickMock}
      />
    );

    expect(onChatHistoryTitleClickMock).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByText('foo'));
    });
    expect(onChatHistoryTitleClickMock).toHaveBeenCalledWith('1', 'foo');
  });

  it('should call onChatHistoryEditClick id and title after', () => {
    const onChatHistoryEditClickMock = jest.fn();
    const { getByLabelText } = render(
      <ChatHistoryList
        chatHistories={[{ id: '1', title: 'foo', updatedTimeMs: 0 }]}
        onChatHistoryEditClick={onChatHistoryEditClickMock}
      />
    );

    expect(onChatHistoryEditClickMock).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByLabelText('Edit conversation name'));
    });
    expect(onChatHistoryEditClickMock).toHaveBeenCalledWith({ id: '1', title: 'foo' });
  });

  it('should call onChatHistoryEditClick id and title after', () => {
    const onChatHistoryDeleteClickMock = jest.fn();
    const { getByLabelText } = render(
      <ChatHistoryList
        chatHistories={[{ id: '1', title: 'foo', updatedTimeMs: 0 }]}
        onChatHistoryDeleteClick={onChatHistoryDeleteClickMock}
      />
    );

    expect(onChatHistoryDeleteClickMock).not.toHaveBeenCalled();
    act(() => {
      fireEvent.click(getByLabelText('Delete conversation'));
    });
    expect(onChatHistoryDeleteClickMock).toHaveBeenCalledWith({ id: '1' });
  });
});
