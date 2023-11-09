/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiFlyout, EuiFlyoutHeader, EuiResizableContainer } from '@elastic/eui';
import cs from 'classnames';
import React from 'react';
import { useChatContext } from './contexts/chat_context';
import { ChatPage } from './tabs/chat/chat_page';
import { ChatWindowHeader } from './tabs/chat_window_header';
import { ChatHistoryPage } from './tabs/history/chat_history_page';
import { LangchainTracesFlyoutBody } from './components/langchain_traces_flyout_body';

let chatHistoryPageLoaded = false;

interface ChatFlyoutProps {
  flyoutVisible: boolean;
  overrideComponent: React.ReactNode | null;
  flyoutProps: Partial<React.ComponentProps<typeof EuiFlyout>>;
  flyoutFullScreen: boolean;
  toggleFlyoutFullScreen: () => void;
}

export const ChatFlyout: React.FC<ChatFlyoutProps> = (props) => {
  const chatContext = useChatContext();

  let chatPageVisible = false;
  let chatHistoryPageVisible = false;
  let chatTraceVisible = false;

  if (!props.overrideComponent) {
    switch (chatContext.selectedTabId) {
      case 'chat':
        chatPageVisible = true;
        break;

      case 'history':
        chatHistoryPageVisible = true;
        break;

      case 'trace':
        chatTraceVisible = true;
        break;

      default:
        break;
    }
  }

  // Always show chat page in fullscreen mode
  if (!props.overrideComponent && props.flyoutFullScreen) {
    chatPageVisible = true;
  }

  if (!chatHistoryPageLoaded && chatHistoryPageVisible) chatHistoryPageLoaded = true;

  const resizable = props.flyoutFullScreen && (chatHistoryPageVisible || chatTraceVisible);
  const getLeftPanelSize = () => {
    if (resizable) {
      return undefined;
    }
    if (chatPageVisible) {
      return 100;
    }
    return 0;
  };

  const getRightPanelSize = () => {
    if (resizable) {
      return undefined;
    }
    if (chatHistoryPageVisible || chatTraceVisible) {
      return 100;
    }
    return 0;
  };

  const leftPanelSize = getLeftPanelSize();
  const rightPanelSize = getRightPanelSize();

  return (
    <EuiFlyout
      className={cs('llm-chat-flyout', {
        'llm-chat-fullscreen': props.flyoutFullScreen,
        'llm-chat-hidden': !props.flyoutVisible,
      })}
      type="push"
      paddingSize="none"
      size="460px"
      ownFocus={false}
      hideCloseButton
      onClose={() => chatContext.setFlyoutVisible(false)}
      {...props.flyoutProps}
    >
      <>
        <EuiFlyoutHeader className={cs('llm-chat-flyout-header')}>
          <ChatWindowHeader
            flyoutFullScreen={props.flyoutFullScreen}
            toggleFlyoutFullScreen={props.toggleFlyoutFullScreen}
          />
        </EuiFlyoutHeader>

        {props.overrideComponent}
        <EuiResizableContainer style={{ height: '100%', overflow: 'hidden' }}>
          {(Panel, Resizer) => (
            <>
              <Panel
                className={cs('llm-chat-horizontal-resize-panel', {
                  'llm-chat-hidden': leftPanelSize === 0,
                })}
                scrollable={false}
                size={leftPanelSize}
                initialSize={resizable ? 70 : undefined}
                paddingSize="none"
              >
                <ChatPage />
              </Panel>
              <>
                {resizable && <Resizer />}
                <Panel
                  className={cs('llm-chat-horizontal-resize-panel', {
                    'llm-chat-hidden': leftPanelSize === 100,
                  })}
                  scrollable={false}
                  size={rightPanelSize}
                  initialSize={resizable ? 30 : undefined}
                  paddingSize="none"
                >
                  {chatHistoryPageLoaded && (
                    <ChatHistoryPage
                      // refresh data when user switched to table from another tab
                      shouldRefresh={chatHistoryPageVisible}
                      className={cs({ 'llm-chat-hidden': !chatHistoryPageVisible })}
                    />
                  )}
                  {chatTraceVisible && chatContext.traceId && <LangchainTracesFlyoutBody />}
                </Panel>
              </>
            </>
          )}
        </EuiResizableContainer>
      </>
    </EuiFlyout>
  );
};