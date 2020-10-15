import * as Sentry from '@sentry/browser';
import * as R from 'fp-ts/lib/Record';
import { pipe } from 'fp-ts/lib/pipeable';
import * as O from 'fp-ts/lib/Option';

import { sentryConfig } from '../api/config';
import { LocalSessionWithId } from '../model/Session';

function beforeBreadcrumb(
  breadcrumb: Sentry.Breadcrumb,
  hintP?: Sentry.BreadcrumbHint,
): Sentry.Breadcrumb | null {
  const hintO = O.fromNullable(hintP);

  switch (breadcrumb.category) {
    case 'ui.click':
      return pipe(
        hintO,
        O.fold(
          () => breadcrumb,
          hint => {
            const { target } = hint.event;

            if (target.ariaLabel) {
              breadcrumb.message = target.ariaLabel;
            }

            return breadcrumb;
          },
        ),
      );
    case 'ui.input':
      return pipe(
        hintO,
        O.fold(
          () => breadcrumb,
          hint => {
            const { target } = hint.event;

            if (target.value) {
              breadcrumb.message = `${target.ariaLabel}. Previous Value: ${target.value}`;
            } else if (target.ariaLabel) {
              breadcrumb.message = target.ariaLabel;
            }

            return breadcrumb;
          },
        ),
      );
    default:
      return breadcrumb;
  }
}

export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb);
}

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
  });
}

export function captureLog(
  error: Error,
  extras: Record<string, string> = {},
  tags: Record<string, string> = {},
) {
  Sentry.withScope(scope => {
    pipe(
      extras,
      R.mapWithIndex((key, extra) => {
        scope.setExtra(key, extra);
      }),
    );

    pipe(
      tags,
      R.mapWithIndex((key, tag) => {
        scope.setTag(key, tag);
      }),
    );

    Sentry.captureException(error);
  });
}

Sentry.init({
  dsn: sentryConfig.dsn,
  release: process.env.REACT_APP_VERSION,
  beforeBreadcrumb,
});
