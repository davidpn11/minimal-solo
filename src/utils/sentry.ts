import * as Sentry from "@sentry/browser";
import {sentryConfig} from "../api/config";
import {LocalSessionWithId} from "../model/Session";

Sentry.init(sentryConfig);

export function setSentryUserContext(userId: string) {
  Sentry.configureScope(scope => scope.setUser({ id: userId }));
}

export function setSentrySessionTags(session: LocalSessionWithId) {
  Sentry.configureScope(scope => {
    scope.setTags({
      sessionId: session.id,
      sessionStatus: session.status,
      sessionCode: session.code,
    });
  })
}