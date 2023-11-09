/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { OpenSearchDashboardsRequest, RequestHandlerContext } from '../../../../../src/core/server';
import { IMessage, IInput } from '../../../common/types/chat_saved_object_attributes';
import { LLMRequestSchema } from '../../routes/chat_routes';
import { PPLGenerationRequestSchema } from '../../routes/langchain_routes';

export interface ChatService {
  requestLLM(
    payload: { messages: IMessage[]; input: IInput; sessionId?: string },
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<unknown, unknown, LLMRequestSchema, 'post'>
  ): Promise<IMessage[]>;
  generatePPL(
    context: RequestHandlerContext,
    request: OpenSearchDashboardsRequest<unknown, unknown, PPLGenerationRequestSchema, 'post'>
  ): Promise<string>;
}